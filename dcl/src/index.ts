//polyfill needed
import "./polyfill/delcares";

import { ColliderLayer } 		from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math'

import { GltfObject } 			from './classes/class.GltfObject'
import { setupUi } 				from './ui/setupUI'

import { setupCannonWorld, world } 			from './cannonWorld'
import { CannonVehicle } from './classes/class.CannonVehicle'
import { doLoginFlow, registerLoginFlowListener } from './connect/login-flow'
import { initConnectionSystem } from './connect/connectionSystem'
import { initSendPlayerInputToServerSystem } from './connect/playerPositionSystem'
import { initRegistry } from './registry'
import { initGameState } from './state'
import { getAndSetRealmDataIfNull, getAndSetUserDataIfNull } from './userData'
import { initConfig } from './config'
import { initUIGameHud } from "./connect/ui-game-hud";

export function main() {
	
	// Spawn the arena
	const arena = new GltfObject("assets/gltf/arena.gltf", {
		position: Vector3.create(0, 0, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)
	

	initConfig().then((config)=>{
		
		initRegistry();
		initGameState();
		
		getAndSetRealmDataIfNull()
		getAndSetUserDataIfNull()
		
		registerLoginFlowListener()
		doLoginFlow(
			{  
				onSuccess:()=>{
					//fetch leaderboards
					//initGamePlay() 
				}
			}
		)

		initConnectionSystem()
		initSendPlayerInputToServerSystem()
		//initPlayerTransformSystem()  

		// Draw UI
		setupUi()
		
		// Setup Cannon World - adds the world, ground, arena colliders
		// spawns in a vehicle, adds input listener system and controls vehicle movement
		setupCannonWorld() 
	})

}
 