import { 
	engine, inputSystem, 
	EasingFunction, Entity, GltfContainer, InputAction, 
	PlayerIdentityData, 
	PointerEventType, Transform, TransformType, 
	Tween, tweenSystem 
} 										from '@dcl/sdk/ecs'
import { getPlayer } 					from '@dcl/sdk/src/players'
import { Quaternion, Vector3 } 			from '@dcl/sdk/math'
import * as utils 						from '@dcl-sdk/utils'
import * as CANNON 						from 'cannon'
	
import { getEntityPosition } 			from '../utilities/func.entityData'
import { Vec3ToVector3, Vector3ToVec3 } from '../utilities/func.Vectors'
import { VehicleManager } 				from './class.VehicleManager'
import { VehicleState } from '../interfaces/interface.VehicleState'


const playerData = getPlayer()

// Setup the physics material used for the vehicles
const vehiclePhysicsMaterial: CANNON.Material = new CANNON.Material('vehicleMaterial')
	vehiclePhysicsMaterial.friction    = 0.01
	vehiclePhysicsMaterial.restitution = 0.5
	
// Define the Vehicle class
export class Vehicle {
	/* 
	The Vehicle is made up of two DCL engine entities (entityPos, and entityRot) and a CannonBody
	The cannonBody is a cannonjs physics body used to dictate the vehicle transform.
	The parent entity (entityPos) is used for setting the vehicle position
	The child entity (entityRot) is used for setting the vehicle rotation
	The GltfObject is attached to the child, entityRot.
		
	It has some basic properties: max speed, acceleration	
	The currentSpeed is lerped up to max speed while isAccelerating, and down to zero otherwise	
	The cannonBody.velocity property is governed by the currentSpeed + camera rotation and
	is updated by the updateSpeed method
	
	The Vehicle is not active until a player enters the trigger zone attached to it.
	*/
	
	manager              : VehicleManager   // Instance of the VehicleManager which controls this Vehicle 
	vehicleID            : number			// ID of the instance in the vehicle manager 
	
	ownerID              : string  = "npc"  // UUID of the owner. Left at "npc" if not owned.
	ownerName            : string  = "npc"  // Name of the owner. Left at "npc" if not owned.
	isLocalPlayer        : boolean = false  // Denote if this vehicle is being controlled by a local player
	
	entityPos            : Entity 			// Root Entity used to set object position
	entityRot            : Entity 			// Child Entity used to set object rotation
	entityPreview        : Entity 			// Preview Entity used in the selection area/podium
	entityCrown          : Entity 			// Entity used to attach the current crown model to
	cannonBody           : CANNON.Body 		// Cannon physics body
	entityYOffset        : number  = -1.25  // Vertical offset for vehicle gltf component
	
	isActive             : boolean = false	// Is the vehicle currently being controlled by the player?
	isAccelerating       : boolean = false  // Toggled by user pressing/releasing W. Referenced by VehicleInputSystem
	currentSpeed         : number  = 0  	// This gets lerped between 0 and maxSpeed depending on if W is pressed
	
	tweenPosDuration     : number  = 200 	// In ms, eg 1 second = 1000
	tweenRotDuration     : number  = 132 	// In ms, eg 1 second = 1000
	timeSinceLastTweenPos: number  = 0		// Timer for last position tween
	timeSinceLastTweenRot: number  = 0		// Timer for last rotation tween
	
	arenaTransform       : TransformType 	// Store the intitial arena spawn transform
	lobbyTransform       : TransformType 	// Store the lobby transform
	targetHeading        : number  = 0
	
	score                : number  = 0
	rank                 : number  = 0
	
	constructor(
		manager            : VehicleManager,
		vehicleID          : number,
		world              : CANNON.World,
		arenaTransform     : TransformType,
		lobbyTransform     : TransformType,
		modelSrc           : string,
		public maxSpeed    : number = 20,  // Maxmimum speed the vehicle can reach
		public maxTurn     : number = 180, // Maximum rate of turn in degrees per second TODO: implement this
		public acceleration: number = 12
	) {
		
		// Store a rerence to the VehicleManager instance which spawned this vehicle
		this.manager = manager
		
		this.vehicleID = vehicleID
		
		// Store the original transform so we can return the vehicle to its starting point
		this.arenaTransform = arenaTransform
		
		// Set up root entity, used for adjusting position
		this.entityPos = engine.addEntity()
		Transform.create(this.entityPos, lobbyTransform)
		
		// Setup child entity, used for rotating the vehicle
		this.entityRot = engine.addEntity()
		Transform.create(this.entityRot, {
			position: Vector3.create(0, 0, 0),
			parent  : this.entityPos,
		})
		
		// Add the gltf shape to the child 
		GltfContainer.create(this.entityRot, {
			src: modelSrc
		})
		
		
		// Setup the preview entity
		this.entityPreview  = engine.addEntity()
		this.lobbyTransform = lobbyTransform
		Transform.create(this.entityPreview, this.lobbyTransform)
		GltfContainer.create(this.entityPreview, {src: modelSrc}) 
		
		// Add the crown entity
		this.entityCrown  = engine.addEntity()
		Transform.create(this.entityCrown, {})
		
		// Add the trigger to toggle player authority
		utils.triggers.addTrigger(
			this.entityPos,
			utils.NO_LAYERS,
			utils.PLAYER_LAYER_ID,
			[{ 
				type    : 'box',	
				position: { x: 0, y: 1, z: 0.5 },
				scale   : { x: 2, y: 3, z: 2 },
				
			}],
			(otherEntity) => { this.onEnterTrigger()  }, //OnEnterTrigger
			(otherEntity) => { this.onExitTrigger() }, //OnExitTrigger
		)
		//utils.triggers.enableDebugDraw(true)
		
		// Set up the cannon body used for physics sims to represent the vehicle
		// Note we're not using a RigidVehicle or RaycastVehicle, just a regular Body with a Sphere shape
		// This should be good enough for our purposes, as long as vehicle stay cylindrical
		this.cannonBody = new CANNON.Body({ 
			mass          : 1.0,
			position      : new CANNON.Vec3(arenaTransform.position.x, arenaTransform.position.y, arenaTransform.position.z),
			quaternion    : new CANNON.Quaternion(),
			shape         : new CANNON.Sphere(1.25),
			material      : vehiclePhysicsMaterial,
			linearDamping : 0.2,
			angularDamping: 0.4
		})
		
		world.addBody(this.cannonBody)
		
		this.resetTransform()
	}
	
	
	// Triggered when an entity enters the vehicle trigger box, enables control
	onEnterTrigger() {		
		// Attempt to claim the vehicle for the player via the VehicleManager instance
		this.manager.userClaimVehicle(this.vehicleID)
		
	}
	
	onExitTrigger() {		
		// Attempt to claim the vehicle for the player via the VehicleManager instance
		this.manager.userUnclaimVehicle(this.vehicleID)
	}
	
	
	enable() {
		this.isActive = true
	}
	
	disable() {
		this.isActive = false
		this.decelerate()
	}
	
	destroy() {
		engine.removeEntity(this.entityPos)
		engine.removeEntity(this.entityRot)
		engine.removeEntity(this.entityPreview)
	}
	
	setOwner(
		uuid: string,
		name: string
	) {
		this.ownerID   = uuid
		this.ownerName = name
	}
	
	clearOwner() {
		this.ownerID = "npc"
		this.ownerName = "npc"
	}
	
	getVehicleState() {
		
		const currentPosition = Transform.getMutable(this.entityPos).position;
		const currentRotation = Transform.getMutable(this.entityRot).rotation;
		
		const data: VehicleState = {
			ownerID        : this.ownerID,
			ownerName      : this.ownerName,
			position       : currentPosition,
			rotation       : currentRotation,
			velocity       : this.cannonBody.velocity,
			angularVelocity: this.cannonBody.angularVelocity,
			score          : this.score,
			rank           : this.rank
		}
		
		return data
	}
	
	setVehicleState(state: VehicleState) {
		
		// If the vehicle is being controlled by the local player then should likely use our own cannonBody
		// as the source of truth properties
		if (!this.isLocalPlayer) {
			this.cannonBody.position.copy(Vector3ToVec3(state.position))
			this.cannonBody.quaternion.setFromEuler(state.rotation.x, state.rotation.y, state.rotation.z)
			this.cannonBody.velocity.copy(state.velocity)	
		}
	
		// Update the current vehicle state to sync it with the colyseus server
		this.score = state.score
		this.rank  = state.rank
		
		if (this.rank < 4) {
			this.addCrown(this.rank)
		} else {
			this.clearCrown()
		}
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
	
	setTargetHeading(heading: number) {
		this.targetHeading = heading
	}
	
	// Adds a suitable crown
	addCrown(rank: number) {
		rank = Math.min(Math.max(1, rank), 3)
		
		const src = rank === 1 ? "crown.1.gold" 
				  : rank === 2 ? "crown.2.silver" 
				  : "crown.3.bronze" 
		GltfContainer.createOrReplace(this.entityCrown, {
			src: "assets/gltf/" + src
		})
	}
	
	clearCrown() {
		GltfContainer.deleteFrom(this.entityCrown)
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
		transformRot.rotation = this.arenaTransform.rotation
		transformPos.position = this.arenaTransform.position
	}
	
	// Trigger tween to a new position
	tweenToPosition(
		position: Vector3 = Vec3ToVector3(this.cannonBody.position),
		duration: number  = this.tweenPosDuration
	) {
		
		// Reset timer
		this.timeSinceLastTweenPos = 0
		
		// Define the target
		const targetPos = Vector3.create(position.x, position.y + this.entityYOffset, position.z)
		
		// Use the built in Tween component
		// Start Tween on the entityPos (parent) to position it
		Tween.createOrReplace(this.entityPos, {
			mode: Tween.Mode.Move({
				start: getEntityPosition(this.entityPos),
				end  : targetPos
			}),
			duration: duration, // Tween component needs times in ms
			easingFunction: EasingFunction.EF_LINEAR,
		})
		
		console.log("Started new TweenPos: ", getEntityPosition(this.entityPos), targetPos)
	}
	
	
	tweenToHeading(heading: number = this.targetHeading) {
		// Start Tween on the entityRot (child) to correctly rotate it
		const transformRot = Transform.getMutable(this.entityRot);
		if (transformRot) {
			
			// Reset timer
			this.timeSinceLastTweenRot = 0	
			
			// Get the start and end rots (limited by turn rate)
			const startRotation  = transformRot.rotation
			
			const maxTurn        = (this.maxTurn / (this.tweenRotDuration / 1000))			
			const targetRotation = rotateTowardsHeading(startRotation, this.targetHeading, maxTurn)
			
			/* const targetRotation  = new CANNON.Quaternion();
			targetRotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.targetHeading); */
			
			// Use the built in Tween component
			Tween.createOrReplace(this.entityRot, {
				mode: Tween.Mode.Rotate({
					start: startRotation,
					end  : targetRotation
				}),
				duration: this.tweenRotDuration,  // Tween component needs times in ms
				easingFunction: EasingFunction.EF_LINEAR,
			})
		}
	}
	
}

function rotateTowardsHeading(
	current    : Quaternion, 
	heading    : number, 
	maxRotation: number
): Quaternion {

	// Extract the euler angles from quaternions
	const currentEuler = Quaternion.toEulerAngles(current);
	const targetEuler  = Vector3.create(0, heading, 0);
	
	let yDiff = targetEuler.y - currentEuler.y;
	yDiff     = Math.max(-maxRotation, Math.min(maxRotation, yDiff));
	
	const result = Quaternion.fromEulerDegrees(currentEuler.x, currentEuler.y + yDiff, currentEuler.z);
	return result
}
