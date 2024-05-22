import { ColliderLayer, engine, 
		 GltfContainer, Transform 
} 								from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math'
import { GltfObject } 			from './classes/class.GltfObject'

import { setupUi } 				from './ui/setupUI'
import { setupCannonWorld } 	from './vehicles/setupCannonWorld'
import { setupVehicleManager } 	from './vehicles/setupVehicleManager'

export function main() {
	
	// Spawn the arena
	/* const arena = new GltfObject("assets/gltf/arena.002.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS) */
	
	// Draw UI
	setupUi()
	
	// Setup Cannon World - adds the world, ground, arena colliders
	setupCannonWorld()
	
	// Setup the vehicle manager, which in turn spawns all the vehicles
	// Also add input listener system and controls vehicle movement
	setupVehicleManager()
	
}
 