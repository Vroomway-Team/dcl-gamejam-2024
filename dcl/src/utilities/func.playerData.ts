import { Transform, engine } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

// Utility functions to get the player position and camera rotation, used when constructing a new projectile
export function getPlayerPosition() {
	// This is messy. There's a better way to do it for sure, but it works for now. 
	if (Transform.has(engine.PlayerEntity)) {
		const verticalOffset = 0.8
		const playerPosition = Transform.getMutable(engine.PlayerEntity).position;
		const position = Vector3.create(playerPosition.x, playerPosition.y + verticalOffset, playerPosition.z);
		return position
	} else {
		return Vector3.Zero()
	}
}

export function getCameraRotation(): Quaternion {
	if (Transform.has(engine.CameraEntity)) {
		return Transform.get(engine.CameraEntity).rotation	
	} else {
		return Quaternion.Zero()
	}
}

export function getPlayerRotation(): Quaternion {
	if (Transform.has(engine.PlayerEntity)) {
		const verticalOffset = 0.8
		return Transform.get(engine.PlayerEntity).rotation;
	} else {
		return Quaternion.Zero()
	}
}