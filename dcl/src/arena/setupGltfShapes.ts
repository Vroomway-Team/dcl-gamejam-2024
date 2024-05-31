import { ColliderLayer } 		from "@dcl/sdk/ecs";
import { Vector3, Quaternion }	from "@dcl/sdk/math";
import { GltfObject } 			from "../classes/class.GltfObject";

export function setupGltfShapes() {
	
	// Spawn the arena
	const arena0 = new GltfObject("assets/gltf/arena.base.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_POINTER)

	const arena1 = new GltfObject("assets/gltf/arena.top.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_POINTER)
	
	
	// Animated arrows
	const arrows1 = new GltfObject("assets/gltf/arena.entrance.arrows.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_POINTER)
	
	const arrows2 = new GltfObject("assets/gltf/arena.entrance.arrows.gltf", {
		position: Vector3.create(64, 0, 64),
		rotation: Quaternion.fromEulerDegrees(0, 0, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_POINTER) 
	

	// Light bars
	const lightBar1 = new GltfObject("assets/gltf/sign.thisTallToRide.gltf", {
		position: Vector3.create(61.2, 0.025, 36.5),
		rotation: Quaternion.fromEulerDegrees(0, -60, 0),
		scale   : Vector3.create(1.25,1,1)
	})
	const lightBar2 = new GltfObject("assets/gltf/sign.thisTallToRide.gltf", {
		position: Vector3.create(2.75, 0.025, 27.5),
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

	//Blue Spotlights
	const spotlightBlue = new GltfObject("assets/gltf/spotlight.blue.gltf", {
		position: Vector3.create(25, 7, 30.75),
		rotation: Quaternion.fromEulerDegrees(-175, 90, 0),
		scale   : Vector3.create(1,1,1)
	})
	const spotlightBlue2 = new GltfObject("assets/gltf/spotlight.blue.gltf", {
		position: Vector3.create(25, 7, 33.25),
		rotation: Quaternion.fromEulerDegrees(-175, 90, 0),
		scale   : Vector3.create(1,1,1)
	})
	const spotlightBlue3 = new GltfObject("assets/gltf/spotlight.blue.gltf", {
		position: Vector3.create(39, 7, 30.75),
		rotation: Quaternion.fromEulerDegrees(-175, -90, 0),
		scale   : Vector3.create(1,1,1)
	})
	const spotlightBlue4 = new GltfObject("assets/gltf/spotlight.blue.gltf", {
		position: Vector3.create(39, 7, 33.25),
		rotation: Quaternion.fromEulerDegrees(-175, -90, 0),
		scale   : Vector3.create(1,1,1)
	})

	//Yellow Spotlights
	const spotlightYellow = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(60, 6, 36),
		rotation: Quaternion.fromEulerDegrees(-45, 0, -90),
		scale   : Vector3.create(1,1,1)
	})
	//Blue Spotlights
	const spotlightYellow2 = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(60, 6, 28),
		rotation: Quaternion.fromEulerDegrees(-135, 0, -90),
		scale   : Vector3.create(1,1,1)
	})
	//Blue Spotlights
	const spotlightYellow3 = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(4, 6, 28),
		rotation: Quaternion.fromEulerDegrees(-135, 0, 90),
		scale   : Vector3.create(1,1,1)
	})
	//Yellow Spotlights
	const spotlightYellow4 = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(4, 6, 36),
		rotation: Quaternion.fromEulerDegrees(-45, 0, 90),
		scale   : Vector3.create(1,1,1)
	})
}
