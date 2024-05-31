import { ColliderLayer, GltfContainer, Transform, engine } 		from "@dcl/sdk/ecs";
import { Vector3, Quaternion }	from "@dcl/sdk/math";
import { GltfObject } 			from "../classes/class.GltfObject";
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo } from "~system/RestrictedActions";

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
		rotation: Quaternion.fromEulerDegrees(0, 120, 0),
		scale   : Vector3.create(1.25,1,1)
	})
	const lightBar2 = new GltfObject("assets/gltf/sign.thisTallToRide.gltf", {
		position: Vector3.create(2.75, 0.025, 27.5),
		rotation: Quaternion.fromEulerDegrees(0, -60, 0),
		scale   : Vector3.create(1.25,1,1)
	})


	// How to play frames
	const howtoFrame1 = new GltfObject("assets/gltf/howto.frame.gltf", {
		position: Vector3.create(31.95, 4.15, 32),
		rotation: Quaternion.fromEulerDegrees(0, -90, 0),
		scale   : Vector3.create(1.25,1.25,1.25)
	})
	
	const howtoFrame2 = new GltfObject("assets/gltf/howto.frame.gltf", {
		position: Vector3.create(32.05, 4.15, 32),
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
	const spotlightYellow2 = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(60, 6, 28),
		rotation: Quaternion.fromEulerDegrees(-135, 0, -90),
		scale   : Vector3.create(1,1,1)
	})
	const spotlightYellow3 = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(4, 6, 28),
		rotation: Quaternion.fromEulerDegrees(-135, 0, 90),
		scale   : Vector3.create(1,1,1)
	})
	const spotlightYellow4 = new GltfObject("assets/gltf/spotlight.Yellow.gltf", {
		position: Vector3.create(4, 6, 36),
		rotation: Quaternion.fromEulerDegrees(-45, 0, 90),
		scale   : Vector3.create(1,1,1)
	})

	//Pink Spotlights
	const spotlightPink = new GltfObject("assets/gltf/spotlight.Pink.gltf", {
		position: Vector3.create(18, 20, 58),
		rotation: Quaternion.fromEulerDegrees(225, 90, 0),
		scale   : Vector3.create(2,2,2)
	})
	const spotlightPink2 = new GltfObject("assets/gltf/spotlight.Pink.gltf", {
		position: Vector3.create(46, 20, 58),
		rotation: Quaternion.fromEulerDegrees(225, -90, 0),
		scale   : Vector3.create(2,2,2)
	})
	const spotlightPink3 = new GltfObject("assets/gltf/spotlight.Pink.gltf", {
		position: Vector3.create(18, 20, 7),
		rotation: Quaternion.fromEulerDegrees(225, 90, 0),
		scale   : Vector3.create(2,2,2)
	})
	const spotlightPink4 = new GltfObject("assets/gltf/spotlight.Pink.gltf", {
		position: Vector3.create(46, 20, 7),
		rotation: Quaternion.fromEulerDegrees(225, -90, 0),
		scale   : Vector3.create(2,2,2)
	})
	
	
	//Spectator Pods
	const spectatorPod1 = engine.addEntity()
  	Transform.create(spectatorPod1, {
    	position: Vector3.create(34.25, 0.1, 38.9),
    	scale   : Vector3.create(1.6, 1.8, 1.6),
    	rotation: Quaternion.fromEulerDegrees(0,-165,0)
  	})
 	GltfContainer.create(spectatorPod1, {
    	src: 'assets/gltf/spectate.pod.gltf'
  	})
  	utils.triggers.addTrigger(spectatorPod1, utils.NO_LAYERS, utils.PLAYER_LAYER_ID,
    	[{
			type  : 'sphere',
			radius: 1
		}], () => { movePlayerTo({
    	    newRelativePosition: Vector3.create(4, 26, 32),
    	    cameraTarget       : Vector3.create(32, 20, 50),
    	  })
    	}
  	)
	
	const spectatorPod2 = engine.addEntity()
  	Transform.create(spectatorPod2, {
    	position: Vector3.create(32, 22, 6),
    	scale   : Vector3.create(1.6, 1.8, 1.6),
    	rotation: Quaternion.fromEulerDegrees(0, -180, 0)
  	})
 	GltfContainer.create(spectatorPod2, { src: 'assets/gltf/spectate.pod2.gltf' })
  	utils.triggers.addTrigger(spectatorPod2, utils.NO_LAYERS, utils.PLAYER_LAYER_ID,
    	[{
      	  type  : 'sphere',
      	  radius: 1
      	}], () => { movePlayerTo({
    	    newRelativePosition: Vector3.create(38, 5, 32),
    	    cameraTarget       : Vector3.create(32, 5, 32),
		})}
  	)
}
