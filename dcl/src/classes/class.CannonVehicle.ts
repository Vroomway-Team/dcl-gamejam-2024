
import * as CANNON from 'cannon'
import * as utils from '@dcl-sdk/utils'

import { EasingFunction, Entity, GltfContainer, InputAction, 
		 PointerEventType, Transform, TransformType, 
		 Tween, 
		 engine, inputSystem }	from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math';
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
	The CannonVehicle is made up of two DCL engine entities and a CannonBody
	The cannonBody is a cannonjs physics body used to dictate the vehicle transform.
	The parent entity (entityPos) is used for setting the vehicle position. 
	The child entity (entityRot) is used for setting the vehicle rotation
	The GltfObject is attached to the child, entityRot.
		
	It has some basic properties: max speed, acceleration	
	The currentSpeed is lerped up to max speed while the user holds FORWARD, and down to zero otherwise.	
	The cannonBody.velocity property is governed by the currentSpeed property and the camera rotation.
	
	The CannonVehicle is not active until a player enters the trigger zone attached to it.
	*/	
	
	entityPos            : Entity 			// Root Entity used to set object position
	entityRot            : Entity 			// Child Entity used to set object rotation
	cannonBody           : CANNON.Body 		// Cannon physics body
	
	isActive             : boolean  = false	// Is the vehicle currently being controlled by the player?
	isAccelerating       : boolean  = false // Toggled by user pressing/releasing W. Referenced by CannonVehicleInputSystem
	currentSpeed         : number   = 0  	// This gets lerped between 0 and maxSpeed depending on if W is pressed
	
	tweenPosDuration     : number   = 250 	// In ms, eg 1 second = 1000
	tweenRotDuration     : number   = 132 	// In ms, eg 1 second = 1000
	timeSinceLastTweenPos: number   = 0		// Timer for last position tween
	timeSinceLastTweenRot: number   = 0		// Timer for last rotation tween
	
	deltaTimeHistory     : number[] = []    // DEBUG: Empty array for crude delta time logging
	deltaTimeHistorySize : number   = 60	// DEBUG: max history size
	deltaTimeAverage     : number   = 0		// DEBUG: track the avergae dt over time
	
	originalTransform    : TransformType 	// Store the intitial spawn transform
	
	constructor(
		world              : CANNON.World,
		transform          : TransformType,
		modelSrc           : string,
		public maxSpeed    : number = 20,
		public acceleration: number = 12
	) {
		
		// Store the original transform so we can return the vehicle to its starting point
		this.originalTransform = transform
		
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
		
		// Add the trigger to toggle player authority
		utils.triggers.addTrigger(
			this.entityPos,
			utils.NO_LAYERS,
			utils.LAYER_1,
			[{ 
				type    : 'box',	
				position: { x: 0, y: 1, z: 0.5 },
				scale   : { x: 2, y: 3, z: 2 },
				
			}],
			(otherEntity) => { this.enable()  }, //OnEnterTrigger
			(otherEntity) => { this.disable() }, //OnExitTrigger
		)
		//utils.triggers.enableDebugDraw(true)
		
		// Set up the cannon body used for physics sims to represent the vehicle
		// Note we're not using a RigidVehicle or RaycastVehicle, just a regular Body with a Sphere shape
		// This should be good enough for our purposes, as long as vehicle stay cylindrical
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
	
	// Triggered when player enters the vehicle, enables control
	enable() {
		this.isActive = true
	}
	
	disable() {
		this.isActive = false
		this.decelerate()
	}
	
	// Triggered when the user presses W to set flag used by this.updateSpeed
	accelerate() {
		console.log("Accelerating")
		this.isAccelerating = true
    }

	// Triggered when the user releases W to set flag used by this.updateSpeed
    decelerate() {
		console.log("Decelerating")
		this.isAccelerating = false
    }
	
	// Update the currentSpeed, depending on this.isAccelerating flag
	// currentSpeed is used to govern the cannonBody.velocity 
	
	// BUG?: this approach could potentially be a source of jitter? Possibly the desired speed is changing significantly between system updates,
	// and because the Tweens are liner interpolation this might be result in sudden changes to speed from one Tween to the next? I don't think so, but maybe.
	updateSpeed(dt: number) {
		// Adjust the current speed, depending on if we're accelerating or braking
		if (this.isAccelerating) {
			// Accel - increase speed to max
			if (this.currentSpeed < this.maxSpeed) {
            	this.currentSpeed += (this.acceleration * dt);
				
				this.currentSpeed = Math.min(this.currentSpeed, this.maxSpeed)
        	}
		} else {
			// Decel - decrease speed to zero
			if (this.currentSpeed > 0) {
				this.currentSpeed -= (this.acceleration * dt);
				this.currentSpeed = Math.max(this.currentSpeed, 0)
			}			
		}
	}
	
	// Move the vehicle back to it's original spawn point. Used by debug UI at present
	resetTransform() {
		// Get transforms
		const transformPos = Transform.getMutable(this.entityPos);
		const transformRot = Transform.getMutable(this.entityRot);
		
		// Reset desired speed, and cannonBody velocity and position
		this.currentSpeed = 0
		this.cannonBody.velocity = CANNON.Vec3.ZERO
		this.cannonBody.position = new CANNON.Vec3(transformPos.position.x, transformPos.position.y, transformPos.position.z)
		
		// Set pos/rot for the gltf shape
		transformRot.rotation = this.originalTransform.rotation
		transformPos.position = this.originalTransform.position		
	}
	
	// Crude function to record a history of system delta times, used for debugging.
	recordDeltaTimeHistory(dt: number) {
		this.deltaTimeHistory.push(dt)
		if (this.deltaTimeHistory.length > this.deltaTimeHistorySize) {
			this.deltaTimeHistory.shift()
		}
		this.deltaTimeAverage = this.deltaTimeHistory.reduce((total, dt) => total + dt, 0) / this.deltaTimeHistory.length;
		
		console.log("dt avergae: ", this.deltaTimeAverage * 1000 + "ms")
	}
}


// Player input system to respond to forward input, and to move vehicle accordingly
export function CannonVehicleInputSystem(dt: number): void {
		
	// Loop through each of the vehicles in the map and handle their inputs and movements
	// This loop gives us:
	// 		cannonBody: a reference to the CANNON.Body used by the Class instance,
	// 		cannonVehicle: a reference to the Class instance itself (which contains .entityPos, .entityRot, and .cannonBody)
	cannonVehicleEntityMap.forEach((cannonBody, cannonVehicle) => {
		
		// Log the delta time
		cannonVehicle.recordDeltaTimeHistory(dt)
		
		// Handle acceleration/deceleration inputs
		// Checks the vehicle is active
		if (cannonVehicle.isActive) {
			if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
				cannonVehicle.accelerate()
			} 
			
			if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
				cannonVehicle.decelerate()
			}
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
		const targetRotation = new CANNON.Quaternion();
		targetRotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), yaw);
		
		// Handle POS tweens		
		cannonVehicle.timeSinceLastTweenPos += (dt * 1000)
		if (cannonVehicle.timeSinceLastTweenPos >= (cannonVehicle.tweenPosDuration)) {	
						
			// Start Tween on the entityPos (parent) to position it
			const transformPos = Transform.getMutable(cannonVehicle.entityPos);
			if (transformPos) {		
				
				// Reset timer
				cannonVehicle.timeSinceLastTweenPos = 0
				
				// Use the sdk-utils Tween					
				/* 
				const startPos  = Vector3.create(transformPos.position.x, transformPos.position.y, transformPos.position.z)
				const targetPos = Vector3.create(cannonBody.position.x, cannonBody.position.y, cannonBody.position.z)
				utils.tweens.stopTranslation(cannonVehicle.entityPos)
				utils.tweens.startTranslation(
					cannonVehicle.entityPos, 
					startPos, 
					targetPos, 
					cannonVehicle.tweenPosDuration / 1000,
					cannonVehicle.isAccelerating ? utils.InterpolationType.EASEOUTQUAD : utils.InterpolationType.EASEINQUAD
				) */
				
				// Use the built in Tween component
				Tween.createOrReplace(cannonVehicle.entityPos, {
					mode: Tween.Mode.Move({
						start: transformPos.position,
						end  : cannonBody.position
					}),
					duration: cannonVehicle.deltaTimeAverage * 1000 * 8, // Tween component needs times in ms
					easingFunction: EasingFunction.EF_LINEAR,
				})
				
				// No tween, just set the value straight to the transform
				//transformPos.position = cannonBody.position
			}
			
		}
		
		// Handle ROT tweens
		cannonVehicle.timeSinceLastTweenRot += (dt * 1000)
		if (cannonVehicle.timeSinceLastTweenRot >= (cannonVehicle.tweenRotDuration)) {
			
			// Start a separate tween on the entityRot (Child) to rotate it
			const transformRot = Transform.getMutable(cannonVehicle.entityRot);
			if (transformRot) {
				
				// Reset timer
				cannonVehicle.timeSinceLastTweenRot = 0	
				
				
				// Use the sdk-utils Tween
				const startRot = Quaternion.create(transformRot.rotation.x, transformRot.rotation.y, transformRot.rotation.z, transformRot.rotation.w)
				utils.tweens.stopRotation(cannonVehicle.entityRot)
				utils.tweens.startRotation(
					cannonVehicle.entityRot, 
					startRot,
					targetRotation, 
					cannonVehicle.tweenRotDuration / 1000, //utils.tweens needs times in seconds
					utils.InterpolationType.EASESINE
				)
				
				// Use the built in Tween component
				/* Tween.createOrReplace(cannonVehicle.entityRot, {
					mode: Tween.Mode.Rotate({
						start: transformRot.rotation,
						end  : targetRotation
					}),
					duration: cannonVehicle.tweenRotDuration,  // Tween component needs times in ms
					easingFunction: EasingFunction.EF_LINEAR,
				}) */
				
				// No tween, just set the value straight to the transform
				//transformRot.rotation = rotation 
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
