import { 
	engine, EasingFunction, Entity, 
	GltfContainer, Transform, 
	TransformType, Tween, 
	ColliderLayer
} 										from '@dcl/sdk/ecs'
import { getPlayer } 					from '@dcl/sdk/src/players'
import { Quaternion, RAD2DEG, Vector3 } from '@dcl/sdk/math'
import * as utils 						from '@dcl-sdk/utils'
import * as CANNON 						from 'cannon-es'
	
import { LobbyLabel } 					from './class.LobbyLabel'
import { VehicleManager } 				from './class.VehicleManager'
import { VehicleState } 				from '../interfaces/interface.VehicleState'
import { getEntityPosition, getForwardDirectionFromRotation } 			from '../utilities/func.entityData'
import { Vec3ToVector3, Vector3ToVec3 } from '../utilities/func.Vectors'
import { CustomIndexComponent, FunctionCallbackIndex } from '../utilities/escentials'
import { GameManager } from '../arena/game-manager'
import { Networking } from '../networking'
import { NPCManager } from '../arena/npc-manager'
import { UI_MANAGER } from './class.UIManager'
import { PARTICLE_MANAGER } from '../arena/setupParticleManager'
import { AudioManager } from '../arena/audio-manager'
import { VEHICLE_MANAGER } from '../arena/setupVehicleManager'

// Setup the physics material used for the vehicles
const vehiclePhysicsMaterial: CANNON.Material = new CANNON.Material('vehicleMaterial')
vehiclePhysicsMaterial.friction    = 0.5
vehiclePhysicsMaterial.restitution = 0.9

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
	
	//NOTE: server will assert npc fill now (vehicles are no longer just auto-filled with npcs)
	ownerID              : string  = ""  // UUID of the owner. Left at "" if not owned.
	ownerName            : string  = ""  // Name of the owner. Left at "" if not owned.
	isClaimed            : boolean = false  //
	isLocalPlayer        : boolean = false  // Denote if this vehicle is being controlled by a local player
	
	entityPos            : Entity 			// Root Entity used to set object position
	entityRot            : Entity 			// Child Entity used to set object rotation
	entityCrown          : Entity 			// Entity used to attach the current crown model to
	lobbyLabel           : LobbyLabel       // LobbyLabel instance, used for claiming a vehicle
	cannonBody           : CANNON.Body 		// Cannon physics body
	entityOffset         : Vector3 = Vector3.create(0, -0.05, 0)  // Vector offset for vehicle gltf component
	playerMaxDistance    : number  = 3      // Max distance away a player should be before we tp them back to their vehicle
	
	isActive             : boolean = false	// Is the vehicle currently being controlled by the player?
	isAccelerating       : boolean = false  // Toggled by user pressing/releasing W. Referenced by VehicleInputSystem
	currentSpeed         : number  = 0  	// This gets lerped between 0 and maxSpeed depending on if W is pressed
	maxSpeed             : number  = 12     // Max speed for vehicle
	maxTurn              : number  = 180    // Max turn rate for vehicle in degrees per second
	acceleration         : number  = 12     // Acceleration for vehicle
	
	tweenPosDuration     : number  = 250 	// In ms, eg 1 second = 1000
	tweenRotDuration     : number  = 200 	// In ms, eg 1 second = 1000
	timeSinceLastTweenPos: number  = 0		// Timer for last position tween
	timeSinceLastTweenRot: number  = 0		// Timer for last rotation tween
	timeToNextTweenPos   : number  = 0		// Timer for last position tween
	timeToNextTweenRot   : number  = 0		// Timer for last rotation tween
	
	arenaTransform       : TransformType 	// Store the intitial arena spawn transform
	lobbyTransform       : TransformType 	// Store the lobby transform
	targetHeading        : number  = 0
	currentHeading       : number  = 0
	
	score                : number  = 0
	rank                 : number  = 0
	
	private bumpTimeStamp:number = 0;
	private dropTimeStamp:number = 0;
		
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
			src: modelSrc,
			visibleMeshesCollisionMask  : ColliderLayer.CL_NONE,
			invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
			
		})
		
		// Add the crown entity
		this.entityCrown  = engine.addEntity()
		Transform.create(this.entityCrown, {
			parent: this.entityPos
		})
		utils.perpetualMotions.smoothRotation(this.entityCrown, 3000)
		
		// Add the lobby Label
		this.lobbyLabel = new LobbyLabel(vehicleID, this.lobbyTransform, this.modelName)

		//trigger for ticket collection
		utils.triggers.addTrigger(
			this.entityPos,
			utils.LAYER_7,
			utils.LAYER_8,
			[{  
				type: 'sphere',	
				position: { x:0, y:0.5, z:0 },
				radius: 2
			}],
			//function(otherEntity) { console.log("vehicle hit entity="+(otherEntity as Entity).toString()) }
		);
		CustomIndexComponent.create(this.entityPos, {Index:vehicleID});
		const comp = CustomIndexComponent.get(this.entityPos);
		console.log("entity id=",this.entityPos.toString(),", comp=",comp.Index);

		
		// Set up the cannon body used for physics sims to represent the vehicle
		// Note we're not using a RigidVehicle or RaycastVehicle, just a regular Body with a Sphere shape
		// This should be good enough for our purposes, as long as vehicle stay cylindrical
		this.cannonBody = new CANNON.Body({ 
			mass          : 1,
			position      : new CANNON.Vec3(arenaTransform.position.x, arenaTransform.position.y, arenaTransform.position.z),
			quaternion    : new CANNON.Quaternion(),
			shape         : new CANNON.Sphere(1.25),
			material      : vehiclePhysicsMaterial,
			linearDamping : 0.8,
			angularDamping: 0.4
		})
		this.cannonBody.fixedRotation = true
		
		// Add the collision event listener
		this.cannonBody.collisionFilterGroup = 2; // We'll use 2 for vehicles
		this.cannonBody.collisionFilterMask = 1 | 2;
		
		const collideEventListener = (event: any) => {
			this.onCollideWithBody(event)
		};		
		this.cannonBody.addEventListener("collide", collideEventListener);
		
		// Suspend the cannonBody
		this.cannonBody.sleep()
		
		// Add it to the world
		world.addBody(this.cannonBody)
	}
	
	onCollideWithBody(event: any) {
		if (event.body.collisionFilterGroup == 2) {
			// Work out the dot products of the ways the vehicles are facing, and how they are positioned
			const yourPos = this.cannonBody.position.clone()
			const theirPos = event.body.position.clone()
			
			const theirRot = new CANNON.Vec3()
			event.body.quaternion.toEuler(theirRot)
			
			// Get the vectors representing the directions both bodies are facing, and the direction between them
			const dirToThem = Vector3.subtract(theirPos, yourPos)
			Vector3.normalize(dirToThem)
			
			const dirYoureFacing = getForwardDirectionFromRotation(this.currentHeading)
			const dirTheyreFacing = getForwardDirectionFromRotation(theirRot.y * RAD2DEG)
			const dirTheyreFacing2 = Vector3.create(event.body.velocity.x, 0, event.body.velocity.z)
			Vector3.normalize(dirTheyreFacing2)
			
			const dot1 = Vector3.dot(dirYoureFacing, Vector3.normalize(dirToThem))
			const dot2 = Vector3.dot(dirYoureFacing, dirTheyreFacing)
			
			const midPoint = Vector3.lerp(yourPos, theirPos, 0.5)
			
			// Check if the dot products meet the required criteria, see here for logic: https://i.imgur.com/CtrEKVR.png
			if (dot1 > 0.707 && dot2 > 0.707) { 
				// We hit them in the rear
				// TRIGGER: they should drop tickets
				console.log("vehicle.class: onCollideWithBody(): We HIT someone!", event.body.id)
				PARTICLE_MANAGER.triggerParticleAtPosition("ticket", midPoint)
				
			} else if (dot1 < -0.707 && dot2 > 0.707) {
				// They hit us in the rear
				// TRIGGER: we should drop tickets
				console.log("vehicle.class: onCollideWithBody(): We GOT HIT!", event.body.id)
				//drop cooldown
				if(this.dropTimeStamp >= Date.now()) return;
				this.dropTimeStamp = Date.now()+500;
				//play back-bump fx
				PARTICLE_MANAGER.triggerParticleAtPosition("ticket", midPoint)
				AudioManager.PlaySoundEffect(AudioManager.AUDIO_SFX.INTERACTION_TICKET_DROP)
				//halt if vehicle is not owned by local player or a delegated ai controller
				if(this.ownerID != Networking.GetUserID() && !NPCManager.NPC_DELEGATE_REG.containsKey(this.ownerID)) {
					console.log("vehicle collision ignored");
					return;
				} 
				//if vehicle is owned by the local player, drop tickets
				if(this.ownerID == Networking.GetUserID()) {
					//clear it
					UI_MANAGER.hitNotify.text = ''
					//IF KNOWN - put
					//UI_MANAGER.hitNotify.text = 'PERSON WHO HIT YOUR '
					UI_MANAGER.hitNotify.show()
					//GameManager.PlayerVehicleCollisionCallback();
				  	GameManager.PlayerVehicleCollisionCallback(this.ownerID);
				}
			} else {
				//bump cooldown
				if(this.bumpTimeStamp >= Date.now()) return;
				this.bumpTimeStamp = Date.now()+1000;
				//play bump fx
				PARTICLE_MANAGER.triggerParticleAtPosition("bump", midPoint)
				AudioManager.PlaySoundEffect(AudioManager.AUDIO_SFX.INTERACTION_CART_BUMP)
			}
		}
	}
	
	// Enable the vehicle - checked by CannonMovementSystem
	enable(): void {
		this.isActive = true
		this.cannonBody.wakeUp()
	}
	
	// Disable the vehicle
	disable(): void {
		this.isActive = false
		this.decelerate()
		this.cannonBody.sleep()
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

	/** returns true if vehicle is occupied (has a user or npc registered) */
	hasOwner(): boolean {
		if(this.ownerID == "") return false;
		return true;
	}
	
	// Remove the owner for this vehicle, is triggered by VehicleManager, which in turn is
	// triggered locally by the LobbyLabel, or by the COLYSEUS server
	clearOwner(): void {
		this.ownerID       = ""
		this.ownerName     = ""
		this.isClaimed     = false
		this.isLocalPlayer = false
		
		this.updateLobbyLabel()
	}
	
	updateLobbyLabel(): void {
		this.lobbyLabel.updateState(this.isClaimed, this.ownerID, this.ownerName, this.isLocalPlayer, this.modelName)
	}
	
	getVehicleState(): VehicleState {
		
		const currentPosition = Transform.getMutable(this.entityPos).position;
		
		const data: VehicleState = {
			isClaimed      : this.isClaimed,
			ownerID        : this.ownerID,
			ownerName      : this.ownerName,
			position       : currentPosition,
			heading        : this.currentHeading,
			velocity       : this.cannonBody.velocity,
			angularVelocity: this.cannonBody.angularVelocity,
			score          : this.score,
			rank           : this.rank
		}
		
		return data
	}
	
	setRank(
		value:number
	): void { 
		if(this.score == 0) this.rank = 4;
		else this.rank = value;

		this.updateCrown(this.rank)
	}

	setVehicleState(
		state: VehicleState
	): void {
		// If the vehicle is being controlled by the local player then should likely use our own cannonBody
		// as the source of truth properties
		const pos = new CANNON.Vec3(state.position.x,state.position.y,state.position.z);
		this.cannonBody.position.copy(pos)
		this.cannonBody.velocity.copy(state.velocity)
		this.targetHeading = state.heading
		this.cannonBody.quaternion.setFromEuler(0, state.heading, 0)
	
		// Update the current vehicle state to sync it with the colyseus server
		this.score = state.score
		this.setRank(state.rank);
	}
	
	getPosition(): Vector3 {
		//const transform = Transform.get(this.entityPos)
		//return transform.position
		
		return this.cannonBody.position
	}
	
	// Triggered when the user presses W to set flag used by this.updateSpeed
	accelerate(): void {
		//console.log("Accelerating")
		
		this.isAccelerating = true
    }

	// Triggered when the user releases W to set flag used by this.updateSpeed
    decelerate(): void {
		//console.log("Decelerating")
		
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
		//console.log("addCrown:", rank)
		
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
		
		//console.log("class:Vehicle: currentSpeed =", this.currentSpeed)
	}
	
	applyMoveForce() {
		// Velocity direction
		// Apply a force to the cannon body in the direction the vehicle is currently facing
		const targetDirection = getForwardDirectionFromRotation(this.currentHeading)
		const targetVelocity  = targetDirection.scale(this.currentSpeed)
		
		this.cannonBody.applyForce(targetVelocity, this.cannonBody.position)
		
		// Clamp the velocity to the max speed		
		if (Vector3.lengthSquared(this.cannonBody.velocity) > (this.maxSpeed * this.maxSpeed)) {
			const velocityNorm = this.cannonBody.velocity.clone()
				  velocityNorm.normalize()
				  velocityNorm.scale(this.maxSpeed)
			this.cannonBody.velocity.copy(velocityNorm)
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
		this.targetHeading = Quaternion.toEulerAngles(this.arenaTransform.rotation).y
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
	
	// Tweens the vehicle to the new transform, also resets the cannonbody properties
	resetToTransform(
		transform: TransformType, 
		duration : number = 1000
	): void {
		// Get transforms
		const transformPos = Transform.getMutable(this.entityPos);
		const transformRot = Transform.getMutable(this.entityRot);
		const heading      = Quaternion.toEulerAngles(transform.rotation).y
		// Set pos/rot for the gltf shape
		this.tweenToPosition(transform.position, duration)
		this.tweenToHeading(heading, duration)
		
		// Reset desired speed, and cannonBody velocity and position
		utils.timers.setTimeout(() => {
			//reset cannon object
			this.currentSpeed = 0
			this.resetCannonBodyAtPosition(transform.position)
		}, duration + 1);
	}
	
	resetCannonBodyAtPosition(position: Vector3) {		
		// Reset positions
		this.cannonBody.position.set(position.x, position.y, position.z)
		this.cannonBody.previousPosition.set(position.x, position.y, position.z)
		this.cannonBody.interpolatedPosition.set(position.x, position.y, position.z)
		this.cannonBody.initPosition.set(position.x, position.y, position.z)
		
		// Reset rotations
		this.cannonBody.quaternion.set(0,0,0,1);
		this.cannonBody.initQuaternion.set(0,0,0,1);
		this.cannonBody.interpolatedQuaternion.set(0,0,0,1);
		
		// Reset velocity stuff
		this.cannonBody.velocity.setZero();
		this.cannonBody.initVelocity.setZero();
		this.cannonBody.angularVelocity.setZero();
		this.cannonBody.initAngularVelocity.setZero();
		
		// Reset forces
		this.cannonBody.force.setZero();
		this.cannonBody.torque.setZero();
		
		// Sleep state reset
		this.cannonBody.sleepState = 0;
		this.cannonBody.timeLastSleepy = 0;
	}
	
	// Trigger tween to a new position
	tweenToPosition(
		position: Vector3 = Vec3ToVector3(this.cannonBody.position),
		duration: number  = this.tweenPosDuration
	): void {
		
		// Debugging checkpoint
		if (this.vehicleID == 21) {
			console.log()
		}
		
		// Reset timer
		this.timeSinceLastTweenPos = 0
		this.timeToNextTweenPos    = duration - VEHICLE_MANAGER.getAverageDeltaTime()
		
		// Define the start and end Positions
		const startPos = getEntityPosition(this.entityPos)
		
		const endPos = Vector3.create(
			position.x + this.entityOffset.x, 
			position.y + this.entityOffset.y, 
			position.z + this.entityOffset.z
		)
		
		// Use the built in Tween component
		// Start Tween on the entityPos (parent) to position it
		Tween.createOrReplace(this.entityPos, {
			mode: Tween.Mode.Move({
				start: startPos,
				end  : endPos
			}),
			duration: duration, // Tween component needs times in ms
			easingFunction: EasingFunction.EF_LINEAR,
		})
		
		//console.log(this.vehicleID, this.modelName, "TweenPosY: ", getEntityPosition(this.entityPos), endPos)
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
			this.timeToNextTweenRot    = duration - VEHICLE_MANAGER.getAverageDeltaTime()
			
			// Get the start and end rots (limited by turn rate)
			const startRotation  = transformRot.rotation
			const targetRotation = Quaternion.fromEulerDegrees(0, heading, 0)
			const maxTurn        = (this.maxTurn * (this.tweenRotDuration / 1000))
			const endRotation    = Quaternion.rotateTowards(startRotation, targetRotation, maxTurn)
			
			// Update the current heading, and the cannon body rotation
			this.currentHeading = Quaternion.toEulerAngles(endRotation).y
			this.cannonBody.quaternion.setFromEuler(0, endRotation.y, 0)
			
			// Use the built in Tween component 
			Tween.createOrReplace(this.entityRot, {
				mode: Tween.Mode.Rotate({
					start: startRotation,
					end  : endRotation
				}),
				duration      : duration,  // Tween component needs times in ms
				easingFunction: EasingFunction.EF_LINEAR,
			})
		} 
	}

	PushToWaypoint(target:Vector3, speed:number) {
		//target direction
        const direction = {
			x: target.x -this.getPosition().x,
			y: target.x -this.getPosition().y,
			z: target.x -this.getPosition().z
		}
		//distance to target
		const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
		//ormalize the direction vector
		direction.x /= length;
		direction.y /= length;
		direction.z /= length;
		//
		const vel = new CANNON.Vec3(
			direction.x*speed,
			direction.y*speed,
			direction.z*speed,
		);
        //apply force to cannon body
		this.cannonBody.applyForce(vel, this.cannonBody.position)
	}
}
