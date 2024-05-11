
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
	
	entity        : Entity
	cannonBody    : CANNON.Body
	
	currentSpeed  : number = 0  // This gets lerped between 0 and maxSpeed depending on if W is pressed
	isAccelerating: boolean = false // Toggled by user pressing/releasing W. Referenced by CannonVehicleInputSystem
	
	constructor(
		world              : CANNON.World,
		transform          : TransformType,
		modelSrc           : string,
		public maxSpeed    : number = 20,
		public acceleration: number = 12
	) {
		
		// Set up gltf shape
		this.entity = engine.addEntity()
		Transform.create(this.entity, transform)
		GltfContainer.create(this.entity, {src: modelSrc})
		
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

// Player input system to respond to forward input, and to move vehicle accordingly
export function CannonVehicleInputSystem(dt: number): void {
	
	// Loop through each of the vehicles in the map and handle their inputs and movements
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
		const cameraEulerRot  = Quaternion.toEulerAngles(getCameraRotation())
		const targetDirection = getForwardDirection(cameraEulerRot.y)
		const targetVelocity  = targetDirection.scale(cannonVehicle.currentSpeed)
		
		cannonBody.velocity.lerp(targetVelocity, 0.1, cannonBody.velocity)		

		// Calculate the vehicle yaw (rotation around the y-axis) based on the velocity vector
		const yaw      = Math.atan2(targetDirection.x, targetDirection.z);
		const rotation = new CANNON.Quaternion();
		rotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw);
		
		// Apply the position and rotation to the vehicle
		const transform = Transform.getMutable(cannonVehicle.entity);		
		if (transform) {

 			Tween.createOrReplace(cannonVehicle.entity, {
				mode: Tween.Mode.Move({
					start: transform.position,
					end  : cannonBody.position.clone()
				}),
				duration: 10,
				easingFunction: EasingFunction.EF_LINEAR,
			})
			
			/* Tween.createOrReplace(cannonVehicle.entity, {
				mode: Tween.Mode.Rotate({
					start: transform.rotation,
					end  : rotation
				}),
				duration: 10,
				easingFunction: EasingFunction.EF_LINEAR,
			})
 			*/
			
			//transform.position = cannonBody.position
			transform.rotation = rotation 
		}
	});
}