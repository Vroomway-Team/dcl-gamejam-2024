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
	
	
	// Animated arrows
	const arrows1 = new GltfObject("assets/gltf/arena.entrance.arrows.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)
	
	const arrows2 = new GltfObject("assets/gltf/arena.entrance.arrows.gltf", {
		position: Vector3.create(64, 0, 64),
		rotation: Quaternion.fromEulerDegrees(0, 0, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS) 
	

	// Light bars
	const lightBar1 = new GltfObject("assets/gltf/sign.lightbar.gltf", {
		position: Vector3.create(60.95, 0.025, 35.95),
		rotation: Quaternion.fromEulerDegrees(0, -60, 0),
		scale   : Vector3.create(1.25,1,1)
	})
	const lightBar2 = new GltfObject("assets/gltf/sign.lightbar.gltf", {
		position: Vector3.create(3, 0.025, 28),
		rotation: Quaternion.fromEulerDegrees(0, 120, 0),
		scale   : Vector3.create(1.25,1,1)
	})

	
	// How to play frames
	const howtoFrame1 = new GltfObject("assets/gltf/howto.frame.gltf", {
		position: Vector3.create(31.07, 3, 32),
		rotation: Quaternion.fromEulerDegrees(0, -90, 0),
		scale   : Vector3.create(1.25,1.25,1.25)
	})
	
	const howtoFrame2 = new GltfObject("assets/gltf/howto.frame.gltf", {
		position: Vector3.create(32.93, 3, 32),
		rotation: Quaternion.fromEulerDegrees(0, 90, 0),
		scale   : Vector3.create(1.25,1.25,1.25)
	})
}
