import { getPlayer } from "@dcl/sdk/src/players"
import { VEHICLE_MANAGER } from "../vehicles/setupVehicleManager"
import { InputAction, PointerEventType, inputSystem, tweenSystem } from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"
import { getCameraRotation, getForwardDirectionFromRotation } from "../utilities/func.entityData"


const playerData = getPlayer()

// Player input system to respond to forward input, and to update vehicle velocity accordingly
export function VehicleInputSystem(dt: number): void {
	
	// Ensure we have access to the player data before we proceed
	if (!playerData) { return }
	
	// Get a reference to the vehicle being controlled by the player
	const vehicle = VEHICLE_MANAGER.getPlayerVehicle(playerData.userId)
	if (!vehicle) {
		return
	}
	
	// Checks the vehicle is active
	if (vehicle.isActive) {
		
		// Handle acceleration/deceleration inputs
		if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
			vehicle.accelerate()
		} 
		
		if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
			vehicle.decelerate()
		}
			
		// Velocity direction
		// Lerp the vehicle.velocity toward the (camera direction * current speed)
		// We lerp it rather than set it to avoid being able to change direction instantly
		const cameraEulerRot  = Quaternion.toEulerAngles(getCameraRotation())
		const targetDirection = getForwardDirectionFromRotation(cameraEulerRot.y)
		const targetVelocity  = targetDirection.scale(vehicle.currentSpeed)
		
		// MOVE this to class.vehicle updateSpeed?
		vehicle.cannonBody.velocity.lerp(targetVelocity, 0.5, vehicle.cannonBody.velocity)
		
		// Entity rotation
		// Calculate the target vehicle yaw (rotation around the y-axis) based on the velocity vector
		// This is used to determine which way the vehicle should face
		// Rather than just take the camera angle above, which would result in the vehicle "drifting" sideways		
		const yaw = Math.atan2(targetDirection.x, targetDirection.z);
		vehicle.setTargetHeading(yaw)
	}
	
	// Update the vehicle speed
	vehicle.updateSpeed(dt)
}
