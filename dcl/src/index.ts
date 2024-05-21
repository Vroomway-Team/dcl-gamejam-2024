import { AvatarShape, ColliderLayer, PBAvatarBase, Transform, engine } 		from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math'

import { GltfObject } 			from './classes/class.GltfObject'
import { setupUi } 				from './ui/setupUI'

import { getPlayer } from '@dcl/sdk/src/players'

import { setupCannonWorld, world } 			from './cannonWorld'
import { CannonVehicle } from './classes/class.CannonVehicle'
import { triggerSceneEmote } from '~system/RestrictedActions'

import * as utils from '@dcl-sdk/utils'

export function main() {

	//Testing avatar animation
	utils.addTestCube({ position: Vector3.create(32, 7, 32) }, () => {
		triggerSceneEmote({ src: 'assets/animations/avatar_sit_react.glb', loop: true })
	})
	utils.addTestCube({ position: Vector3.create(32, 7, 31)})
	utils.addTestCube({ position: Vector3.create(33, 7, 33)})
	//Testing avatarShape

	let userData = getPlayer()
	console.log(userData)

	if (!userData || !userData.wearables) return
	const myAvatar = engine.addEntity()
	AvatarShape.create(myAvatar, {
	id: 'Avatar1',
	name: userData.name,
	emotes: userData.emotes,
	wearables: userData.wearables,
	expressionTriggerId: 'walk',
	})

	Transform.create(myAvatar, {
	position: Vector3.create(30, 7, 30),
	})

	// Spawn the arena
	const arena = new GltfObject("assets/gltf/arena.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)
	
	// Draw UI
	setupUi()
	
	// Setup Cannon World - adds the world, ground, arena colliders
	// spawns in a vehicle, adds input listener system and controls vehicle movement
	setupCannonWorld()
}
 