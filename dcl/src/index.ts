import { ColliderLayer, engine, 
		 GltfContainer, Transform 
} 								from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math'
import { GltfObject } 			from './classes/class.GltfObject'

import { setupUi } 				from './ui/setupUI'
import { setupCannonWorld } 	from './arena/setupCannonWorld'
import { setupGltfShapes } 		from './arena/setupGltfShapes'
import { setupScoreboards } 	from './arena/setupScoreboards'
import { setupVehicleManager } 	from './arena/setupVehicleManager'

export function main() {
	
	// Draw UI
	setupUi()
	
	// Setup Cannon World - adds the world, ground, arena colliders
	setupCannonWorld()
	
	// Setup the vehicle manager, which in turn spawns all the vehicles
	// Also add input listener system and controls vehicle movement
	setupVehicleManager()
	
	// Setup the scoreboards
	setupScoreboards()
	
	// Setup the various gltf shapes
	setupGltfShapes()
	
}
 