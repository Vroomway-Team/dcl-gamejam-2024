
import * as CANNON from 'cannon'

import { EasingFunction, Entity, GltfContainer, InputAction, 
		 PointerEventType, Transform, TransformType, 
		 Tween, 
		 engine, inputSystem }	from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 			from '@dcl/sdk/math';
import { getCameraRotation } 	from '../utilities/func.playerData';


// Define an empty map for cannon bodies and dcl entities
export const cannonVehicleEntityMap: Map<CannonVehicle, CANNON.Body> = new Map();

// Setup the physics material used for the vehicles
const vehiclePhysicsMaterial: CANNON.Material = new CANNON.Material('vehicleMaterial')
	vehiclePhysicsMaterial.friction = 0.01
	vehiclePhysicsMaterial.restitution = 0.5
	
// Define the CannonVehicle class
export class CannonVehicle {
	/* 
	The CannonVehicle is made up of a DCL engine entity and a CannonBody
	It has some basic properties: max speed, acceleration
	
	The vehicles current velocity is dictated by the currentSpeed property and the camera rotation.
	Current speed is lerped up to max speed while the user holds FORWARD, and down to zero otherwise.	
	*/	
	
	entityPos         : Entity 			// Root Entity used to set object position
	entityRot         : Entity 			// Child Entity used to set object rotation
	cannonBody        : CANNON.Body 	// Cannon physics body
	
	currentSpeed      : number  = 0  	// This gets lerped between 0 and maxSpeed depending on if W is pressed
	isAccelerating    : boolean = false // Toggled by user pressing/releasing W. Referenced by CannonVehicleInputSystem
	
	tweenDuration     : number  = 50 	// In ms, eg 1 second = 1000
	timeSinceLastTween: number = 0
	
	constructor(
		world              : CANNON.World,
		transform          : TransformType,
		modelSrc           : string,
		public maxSpeed    : number = 20,
		public acceleration: number = 12
	) {
		
		// Set up root entity, used for adjusting position
		this.entityPos = engine.addEntity()
		Transform.create(this.entityPos, transform)
		
		// Setup child entity, used for rotating the vehicle
		this.entityRot = engine.addEntity()
		Transform.create(this.entityRot, {
			position: Vector3.create(0, 0, 0),
			parent  : this.entityPos,
		})
		
		// Add the gltf shape to the child
		GltfContainer.create(this.entityRot, {src: modelSrc})
		
		// Set up the cannon body to represent the vehicle
		this.cannonBody = new CANNON.Body({ 
			mass          : 1.0,
			position      : new CANNON.Vec3(transform.position.x, transform.position.y, transform.position.z),
			quaternion    : new CANNON.Quaternion(),
			shape         : new CANNON.Sphere(0.5),
			material      : vehiclePhysicsMaterial,
			linearDamping : 0.2,
			angularDamping: 0.4
		})
		world.addBody(this.cannonBody)
		
		// Add the body to the entityMap. This gets used by the cannonUpdateSystem to match the 
		// positions of the DCL entities to their cannon counterpart
		cannonVehicleEntityMap.set(this, this.cannonBody);
	}
	
	accelerate() {
		console.log("Accelerating")
		this.isAccelerating = true
    }

    decelerate() {
		console.log("Decelerating")
		this.isAccelerating = false
    }
	
	updateSpeed(dt: number) {
		// Adjust the current speed, depending on if we're accelerating or braking
		if (this.isAccelerating) {
			// Accel
			if (this.currentSpeed < this.maxSpeed) {
            	this.currentSpeed += (this.acceleration * dt);
				
				this.currentSpeed = Math.min(this.currentSpeed, this.maxSpeed)
        	}
		} else {
			// Decel
			if (this.currentSpeed > 0) {
				this.currentSpeed -= (this.acceleration * dt);
				this.currentSpeed = Math.max(this.currentSpeed, 0)
			}			
		}
	}
}


// Player input system to respond to forward input, and to move vehicle accordingly
export function CannonVehicleInputSystem(dt: number): void {
		
	// Loop through each of the vehicles in the map and handle their inputs and movements
	// This gives us cannonBody: a reference to the CANNON.Body used by the Class instance,
	// As well as cannonVehicle, a reference to the Class instance itself (which contains .entity, .entityChild, and .cannonBody)
	cannonVehicleEntityMap.forEach((cannonBody, cannonVehicle) => {
		
		// Handle acceleration/deceleration inputs
		if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
			cannonVehicle.accelerate()
		} 
		
		if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
			cannonVehicle.decelerate()
		}
		
		// Update the vehicle speed
		cannonVehicle.updateSpeed(dt)
		
		// Lerp the cannonVehicle.velocity toward the (camera direction * current speed)
		// We lerp it rather than set it to avoid being able to change direction instantly
		const cameraEulerRot  = Quaternion.toEulerAngles(getCameraRotation())
		const targetDirection = getForwardDirection(cameraEulerRot.y)
		const targetVelocity  = targetDirection.scale(cannonVehicle.currentSpeed)
		
		cannonBody.velocity.lerp(targetVelocity, 0.1, cannonBody.velocity)		

		// Calculate the vehicle yaw (rotation around the y-axis) based on the velocity vector
		// This is used to determine which way the vehicle should face
		// Rather than just take the camera angle above, which would result in the vehicle "drifting" sideways
		const yaw      = Math.atan2(targetDirection.x, targetDirection.z);
		const rotation = new CANNON.Quaternion();
		rotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw);
		
		// Apply the position and rotation to the vehicle
			
			cannonVehicle.timeSinceLastTween += (dt * 1000)
			if (cannonVehicle.timeSinceLastTween > cannonVehicle.tweenDuration) {
				cannonVehicle.timeSinceLastTween = 0
			
				// Ensure we have access to the transform component before trying to set the Tween, or we get an error when the vehicle first loads
				const transformPos = Transform.getMutable(cannonVehicle.entityPos);
				
				if (transformPos) {
					// Start Tween on the vehicle parent entity
					Tween.createOrReplace(cannonVehicle.entityPos, {
						mode: Tween.Mode.Move({
							start: transformPos.position,
							end  : cannonBody.position.clone()
						}),
						duration: cannonVehicle.tweenDuration,
						easingFunction: EasingFunction.EF_LINEAR,
					})
				}
				
				const transformRot = Transform.getMutable(cannonVehicle.entityRot);
				if (transformRot) {
					
					// Start a separate tween on the Child to rotate it
					Tween.createOrReplace(cannonVehicle.entityRot, {
						mode: Tween.Mode.Rotate({
							start: transformRot.rotation,
							end  : rotation
						}),
						duration: cannonVehicle.tweenDuration,
						easingFunction: EasingFunction.EF_LINEAR,
					})	
					
					//transform.position = cannonBody.position
					//transform.rotation = rotation 
				}			
			
			
		}
	});
}

// Simple function to return a forward vector based on the given yaw value in degrees
// Takes the current camera yaw value
function getForwardDirection(yRot: number): CANNON.Vec3 {
	// Convert to rads
	yRot = yRot * (Math.PI / 180)
	
	// Workout forwards
    const forward = new CANNON.Vec3(Math.sin(yRot), 0, Math.cos(yRot));
    forward.normalize();
	return forward
}
