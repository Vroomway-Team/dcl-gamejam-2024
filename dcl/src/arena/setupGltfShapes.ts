import { ColliderLayer } 		from "@dcl/sdk/ecs";
import { Vector3, Quaternion }	from "@dcl/sdk/math";
import { GltfObject } 			from "../classes/class.GltfObject";

export function setupGltfShapes() {
	
	// Spawn the arena
	const arena0 = new GltfObject("assets/gltf/arena.base.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)

	const arena1 = new GltfObject("assets/gltf/arena.top.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)

	const arena2 = new GltfObject("assets/gltf/arena.roof.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)
	
}