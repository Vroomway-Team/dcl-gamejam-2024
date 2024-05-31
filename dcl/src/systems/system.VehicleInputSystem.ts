import { InputAction, PointerEventType, 
		 Transform, 
		 engine, 
		 inputSystem, tweenSystem 
} 								from "@dcl/sdk/ecs"
import { getCameraRotation, 
	getForwardDirectionFromRotation 
} 								from "../utilities/func.entityData"
import { getPlayer } 			from "@dcl/sdk/src/players"
import { DEG2RAD, Quaternion, Vector3 } 	from "@dcl/sdk/math"
import * as CANNON 				from 'cannon'

import { VEHICLE_MANAGER } 		from "../arena/setupVehicleManager"
import { UI_MANAGER } 			from "../classes/class.UIManager"
import { Vector3ToVec3 } from "../utilities/func.Vectors"


const playerData = getPlayer()

// Player input system to respond to forward input, and to update vehicle velocity accordingly
// Note this is ONLY run for the one, locally controlled vehicle
export function VehicleInputSystem(dt: number): void {
	
	// Ensure the round is in progress
	if (!VEHICLE_MANAGER.roundInProgress) { return }
	
	// Ensure we have access to the player data before we proceed
	const playerData = getPlayer()
	if (!playerData) { return }
	
	// Get a reference to the vehicle being controlled by the player
	const vehicle = VEHICLE_MANAGER.getPlayerVehicle(playerData.userId)
	if (!vehicle) { 
		return
	}
	
	// Checks the vehicle is active, and owned by this player
	if (vehicle.isActive) {
		
		// Handle acceleration/deceleration inputs
		if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
			vehicle.accelerate()
		} 
		
		if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
			vehicle.decelerate()
		}
		
		vehicle.applyMoveForce()

		// Set target heading based on camera		
		const cameraEulerRot  = Quaternion.toEulerAngles(getCameraRotation())
		vehicle.setTargetHeading(cameraEulerRot.y)
		
		// Check player distance - if they're too far from the vehicle, move them back to it
		const playerPos = Transform.get(engine.PlayerEntity).position
		const distance = Vector3.distanceSquared(playerPos, vehicle.cannonBody.position)
		if (distance > (vehicle.playerMaxDistance * vehicle.playerMaxDistance)) {
			console.log("system.VehicleInputSystem: vehicle.playerMaxDistance exceeded")
			VEHICLE_MANAGER.movePlayerToVehicle()
		}
		
		// Update the UI with the speed
		UI_MANAGER.setSpeedValue(Vector3.length(vehicle.cannonBody.velocity)) 
	}
	
	// Update the vehicle speed
	vehicle.updateSpeed(dt)
}
