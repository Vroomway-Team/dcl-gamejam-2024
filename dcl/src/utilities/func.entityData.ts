import { engine, Entity, Transform } 	from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } 			from "@dcl/sdk/math";



// Simple func to return a Vector3 of the entities position
export function getEntityPosition(entity: Entity): Vector3 {
	const t = Transform.get(entity)
	const v = Vector3.create(t.position.x, t.position.y, t.position.z)
	return v
}

// Utility functions to get the player position and camera rotation, used when constructing a new projectile
export function getPlayerPositionWithVerticalOffset(offset: number = 0.8) {
	// This is messy. There's a better way to do it for sure, but it works for now. 
	if (Transform.has(engine.PlayerEntity)) {
		const playerPosition = Transform.getMutable(engine.PlayerEntity).position;
		const position = Vector3.create(playerPosition.x, playerPosition.y + offset, playerPosition.z);
		return position
	} else {
		return Vector3.Zero()
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

export function getCameraRotation(): Quaternion {
	if (Transform.has(engine.CameraEntity)) {
		return Transform.get(engine.CameraEntity).rotation	
	} else {
		return Quaternion.Zero()
	}
}

// Simple function to return a forward vector based on the given yaw value in degrees
// Typically takes the current camera yaw value
export function getForwardDirectionFromRotation(yRot: number): CANNON.Vec3 {
	// Convert to rads
	yRot = yRot * (Math.PI / 180)
	
	// Workout forwards
    const forward = new CANNON.Vec3(Math.sin(yRot), 0, Math.cos(yRot));
    forward.normalize();
	return forward
}