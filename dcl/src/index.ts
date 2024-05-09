import { ColliderLayer } 		from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math'

import { GltfObject } 			from './classes/class.GltfObject'
import { setupUi } 				from './ui/setupUI'

export function main() {
	
	// Spawn the arena
	const arena = new GltfObject("assets/gltf/arena.gltf", {
		position: Vector3.create(0, -36, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)
	
	// Draw UI
	setupUi()
}
