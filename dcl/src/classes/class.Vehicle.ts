import { 
	engine, EasingFunction, Entity, 
	GltfContainer, Transform, 
	TransformType, Tween 
} 										from '@dcl/sdk/ecs'
import { getPlayer } 					from '@dcl/sdk/src/players'
import { Quaternion, Vector3 } 			from '@dcl/sdk/math'
import * as utils 						from '@dcl-sdk/utils'
import * as CANNON 						from 'cannon'
	
import { LobbyLabel } 					from './class.LobbyLabel'
import { VehicleManager } 				from './class.VehicleManager'
import { VehicleState } 				from '../interfaces/interface.VehicleState'
import { getEntityPosition } 			from '../utilities/func.entityData'
import { Vec3ToVector3, Vector3ToVec3 } from '../utilities/func.Vectors'

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
	modelName            : string  = "car"  // Name of the vehicle.
	
	ownerID              : string  = "npc"  // UUID of the owner. Left at "npc" if not owned.
	ownerName            : string  = "npc"  // Name of the owner. Left at "npc" if not owned.
	isClaimed            : boolean = false  //
	isLocalPlayer        : boolean = false  // Denote if this vehicle is being controlled by a local player
	
	entityPos            : Entity 			// Root Entity used to set object position
	entityRot            : Entity 			// Child Entity used to set object rotation
	entityCrown          : Entity 			// Entity used to attach the current crown model to
	lobbyLabel           : LobbyLabel       // LobbyLabel instance, used for claiming a vehicle
	cannonBody           : CANNON.Body 		// Cannon physics body
	entityOffset         : Vector3 = Vector3.create(0, -1.25, 0)  // Vector offset for vehicle gltf component
	
	isActive             : boolean = false	// Is the vehicle currently being controlled by the player?
	isAccelerating       : boolean = false  // Toggled by user pressing/releasing W. Referenced by VehicleInputSystem
	currentSpeed         : number  = 0  	// This gets lerped between 0 and maxSpeed depending on if W is pressed
	maxSpeed             : number  = 20     // Max speed for vehicle
	maxTurn              : number  = 180    // Max turn rate for vehicle in degrees per second
	acceleration         : number  = 12     // Acceleration for vehicle
	
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
		manager       : VehicleManager,
		vehicleID     : number,
		world         : CANNON.World,
		arenaTransform: TransformType,
		lobbyTransform: TransformType,
		modelSrc      : string,
		modelName     : string,
		maxSpeed      : number = 20,  // Maxmimum speed the vehicle can reach
		maxTurn       : number = 180, // Maximum rate of turn in degrees per second TODO: implement this
		acceleration  : number = 12
	) {
		
		// Store a rerence to the VehicleManager instance which spawned this vehicle
		this.manager      = manager
		this.vehicleID    = vehicleID
		this.modelName    = modelName
		
		// Store the various vehicle attributes
		this.maxSpeed     = maxSpeed
		this.maxTurn      = maxTurn
		this.acceleration = acceleration
		
		// Store the original transform so we can return the vehicle to its starting point
		this.arenaTransform = arenaTransform
		this.lobbyTransform = lobbyTransform
		
		// Set up root entity, used for adjusting position
		this.entityPos = engine.addEntity()
		Transform.create(this.entityPos, {
			position: this.lobbyTransform.position
		})
		
		// Setup child entity, used for rotating the vehicle
		this.entityRot = engine.addEntity()
		Transform.create(this.entityRot, {
			rotation: lobbyTransform.rotation,
			parent  : this.entityPos,
		})
		
		// Add the gltf shape to the child 
		GltfContainer.create(this.entityRot, {
			src: modelSrc
		})
		
		// Add the crown entity
		this.entityCrown  = engine.addEntity()
		Transform.create(this.entityCrown, {
			parent: this.entityPos
		})
		utils.perpetualMotions.smoothRotation(this.entityCrown, 3000)
		
		// Add the lobby Label
		this.lobbyLabel = new LobbyLabel(vehicleID, this.lobbyTransform, this.modelName)
		
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
			position      : new CANNON.Vec3(lobbyTransform.position.x, lobbyTransform.position.y, lobbyTransform.position.z),
			quaternion    : new CANNON.Quaternion(),
			shape         : new CANNON.Sphere(1.25),
			material      : vehiclePhysicsMaterial,
			linearDamping : 0.2,
			angularDamping: 0.4
		})
		
		world.addBody(this.cannonBody)
	}
	
	
	// Triggered when an entity enters the vehicle trigger box, enables control
	// These are disabled in favour of the VehicleManager controlling ownership.
	onEnterTrigger(): void {		
		/* const playerData = getPlayer()
		if (playerData) {
			// Attempt to claim the vehicle for the player via the VehicleManager instance
			this.manager.userClaimVehicle(this.vehicleID, playerData.userId, playerData.name, true)
		} */
	}
	
	onExitTrigger(): void {		
		// Attempt to claim the vehicle for the player via the VehicleManager instance
		/* this.manager.userUnclaimVehicle(this.vehicleID) */
	}
	
	// Enable the vehicle - checked by CannonMovementSystem
	enable(): void {
		this.isActive = true
	}
	
	// Disable the vehicle
	disable(): void {
		this.isActive = false
		this.decelerate()
	}
	
	// Probably not needed
/* 	destroy(): void {
		engine.removeEntity(this.entityPos)
		engine.removeEntity(this.entityRot)
	} */
	
	// Set the owner info for this vehicle, is triggered by VehicleManager, which in turn is
	// triggered locally by the LobbyLabel, or by the COLYSEUS server
	setOwner(
		uuid         : string,
		name         : string,
		isLocalPlayer: boolean,
	): void {
		this.ownerID       = uuid
		this.ownerName     = name
		this.isClaimed     = true
		this.isLocalPlayer = isLocalPlayer
		
		this.updateLobbyLabel() 
	}
	
	// Remove the owner for this vehicle, is triggered by VehicleManager, which in turn is
	// triggered locally by the LobbyLabel, or by the COLYSEUS server
	clearOwner(): void {
		this.ownerID       = "npc"
		this.ownerName     = "npc"
		this.isClaimed     = false
		this.isLocalPlayer = false
		
		this.updateLobbyLabel()
	}
	
	updateLobbyLabel(): void {
		this.lobbyLabel.updateState(this.isClaimed, this.ownerID, this.ownerName, this.isLocalPlayer, this.modelName)
	}
	
	getVehicleState(): VehicleState {
		
		const currentPosition = Transform.getMutable(this.entityPos).position;
		const currentRotation = Transform.getMutable(this.entityRot).rotation;
		
		const data: VehicleState = {
			isClaimed      : this.isClaimed,
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
	
	setVehicleState(
		state: VehicleState
	): void {
		
		// If the vehicle is being controlled by the local player then should likely use our own cannonBody
		// as the source of truth properties
		// TODO: add some kind of flag or check ot ignore this for locally controlled vehicles
		this.cannonBody.position.copy(Vector3ToVec3(state.position))
		this.cannonBody.quaternion.setFromEuler(state.rotation.x, state.rotation.y, state.rotation.z)
		this.cannonBody.velocity.copy(state.velocity)	
	
		// Update the current vehicle state to sync it with the colyseus server
		this.score = state.score
		this.rank  = state.rank
		
		this.updateCrown(this.rank)
	}
	
	getPosition(): Vector3 {
		const transform = Transform.get(this.entityPos)
		return transform.position
	}
	
	// Triggered when the user presses W to set flag used by this.updateSpeed
	accelerate(): void {
		console.log("Accelerating")
		
		this.isAccelerating = true
    }

	// Triggered when the user releases W to set flag used by this.updateSpeed
    decelerate(): void {
		console.log("Decelerating")
		
		this.isAccelerating = false
    }
	
	// Sets the desired target heading, which the CannonMovementSystem will use when Tweening the rotation
	setTargetHeading(
		heading: number
	): void {
		this.targetHeading = heading
	}
	
	// Adds a suitable crown depending on the player rank. Removes a crown if not required.
	updateCrown(
		rank: number
	): void {
		console.log("addCrown:", rank)
		
		// Ignore ranks other than 1, 2 3
		if (rank > 3 || rank < 1) { 
			GltfContainer.deleteFrom(this.entityCrown)
			return
		}
		
		// Pick the appropriate crown for the rank
		const src = rank === 1 ? "crown.1.gold"  
				  : rank === 2 ? "crown.2.silver" 
				  : "crown.3.bronze" 
		GltfContainer.createOrReplace(this.entityCrown, {
			src: "assets/gltf/" + src + ".gltf"
		})
	}

	
	// Update the currentSpeed, depending on this.isAccelerating flag
	// currentSpeed is used to govern the cannonBody.velocity 
	
	// BUG?: this approach could potentially be a source of jitter? Possibly the desired speed is changing significantly between system updates,
	// and because the Tweens are liner interpolation this might be result in sudden changes to speed from one Tween to the next? I don't think so, but maybe.
	updateSpeed(
		dt: number
	): void {
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
	
	// Move the vehicle to the arena starting point
	moveToArena(
		duration: number = 1000
	): void {
		this.resetToTransform({
			position: this.arenaTransform.position,
			rotation: this.arenaTransform.rotation,
			scale   : Vector3.One()
		}, duration)
	}
	
	// Move the vehicle back to it's original lobby
	moveToLobby(
		duration: number = 1000
	): void {
		// Adjust the target lobby position by the yOffset that's used when aligning to the CannonBody
		const targetPosition = Vector3.subtract(this.lobbyTransform.position, this.entityOffset)
		
		this.resetToTransform({
			position: targetPosition,
			rotation: this.lobbyTransform.rotation,
			scale   : Vector3.One()
		}, duration)
	}
	
	// Triggers 
	resetToTransform(
		transform: TransformType, 
		duration : number = 1000
	): void {
		// Get transforms
		const transformPos = Transform.getMutable(this.entityPos);
		const transformRot = Transform.getMutable(this.entityRot);
		
		// Set pos/rot for the gltf shape
		this.tweenToPosition(transform.position, duration)
		this.tweenToHeading(transform.rotation.y, duration)
		
		// Reset desired speed, and cannonBody velocity and position
		utils.timers.setTimeout(() => {
			this.currentSpeed        = 0
			this.cannonBody.velocity = CANNON.Vec3.ZERO
			this.cannonBody.position = new CANNON.Vec3(transform.position.x, transform.position.y, transform.position.z)
		}, duration + 1)
		
	}
	
	// Trigger tween to a new position
	tweenToPosition(
		position: Vector3 = Vec3ToVector3(this.cannonBody.position),
		duration: number  = this.tweenPosDuration
	): void {
		
		// Reset timer
		this.timeSinceLastTweenPos = 0
		
		// Define the target
		const targetPos = Vector3.add(position, this.entityOffset)
		
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
	
	
	tweenToHeading(
		heading : number = this.targetHeading,
		duration: number = this.tweenRotDuration
	): void {
		// Start Tween on the entityRot (child) to correctly rotate it
		const transformRot = Transform.getMutable(this.entityRot);
		if (transformRot) {
			
			// Reset timer
			this.timeSinceLastTweenRot = 0	
			
			// Get the start and end rots (limited by turn rate)
			const startRotation  = transformRot.rotation
			const targetRotation = Quaternion.fromEulerDegrees(0, heading, 0)
			
			const maxTurn        = (this.maxTurn * (this.tweenRotDuration / 1000))			
			//const targetRotation = rotateTowardsHeading(startRotation, heading, maxTurn)
			
			// Use the built in Tween component 
			Tween.createOrReplace(this.entityRot, {
				mode: Tween.Mode.Rotate({
					start: startRotation,
					end  : Quaternion.rotateTowards(startRotation, targetRotation, maxTurn)
				}),
				duration: duration,  // Tween component needs times in ms
				easingFunction: EasingFunction.EF_LINEAR,
			})
		}
	}
	
}
