import { getPlayer } 		from "@dcl/sdk/src/players"
import { tweenSystem } 		from "@dcl/sdk/ecs"
import { VEHICLE_MANAGER } 	from "../arena/setupVehicleManager"



	

// Get a reference to the vehicle being controlled by the player

/**
 * Vehicle movements system responsible for updating positions of all vehicle in the scene
 * @param dt deltaTime where 1 = 1 seconds
 * @returns void
 */
export function VehicleMovementSystem(dt: number): void {
	// Ensure the round is in progress
	if (!VEHICLE_MANAGER.roundInProgress) { return }
	
	// Ensure we have access to the player data and vehicle manager before we proceed
	const playerData = getPlayer()
	if (!playerData || !VEHICLE_MANAGER) { 
		return 
	}
	
	// Log the delta time
	VEHICLE_MANAGER.recordDeltaTimeHistory(dt)
	
	// Loop thorugh all of the vehicles and check if their tweens have completed. If so, trigger a new tween
	VEHICLE_MANAGER.getVehicles().forEach((vehicle, index) => {
		
		if (vehicle.isActive) {
			
			// Increase Tween TimeSince
			vehicle.timeSinceLastTweenPos += (dt * 1000)
			vehicle.timeSinceLastTweenRot += (dt * 1000) 
			
			// Handle POS tweens
			// Check if the position Tween has completed
			// Or if the timesincelasttween is more than double the desired tween duration
			const posTweenCompleted = tweenSystem.tweenCompleted(vehicle.entityPos)
			if (posTweenCompleted || (vehicle.timeSinceLastTweenPos > vehicle.tweenPosDuration * 2)) {
				
				console.log("posTweenCompleted after", vehicle.timeSinceLastTweenPos, "starting new tween")	
				
				vehicle.tweenToPosition()
			}	
			
			// Handle ROT tweens
			// Check if the rotation Tween has completed
			// Or if the timesincelasttween is more than double the desired tween duration
			const rotTweenCompleted = tweenSystem.tweenCompleted(vehicle.entityRot)
			if (rotTweenCompleted || (vehicle.timeSinceLastTweenRot > vehicle.tweenRotDuration * 2)) {
					
				console.log("rotTweenCompleted after", vehicle.timeSinceLastTweenRot, "starting new tween")	
				
				// Start a separate tween on the entityRot (Child) to rotate it
				vehicle.tweenToHeading()
			}
			
		}
	})
		

}