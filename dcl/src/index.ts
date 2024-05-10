import { ColliderLayer } from '@dcl/sdk/ecs';
import { Quaternion, Vector3 }	from '@dcl/sdk/math';
import { GltfObject } from './classes/class.GltfObject';
import { setupUi } from './ui/setupUI';
import { GameManager } from './bumper-cars/game-manager';
import { TicketSpawnManager } from './bumper-cars/ticket-spawner';
import * as utils from '@dcl-sdk/utils';
import { movePlayerTo } from '~system/RestrictedActions';
import { GameStage } from './bumper-cars/game-stage';

export function main() {
	//enable debugging meshes for triggers
    utils.triggers.enableDebugDraw(true);
	
	// Spawn the arena
	const arena = new GltfObject("assets/gltf/arena.gltf", {
		position: Vector3.create(0, -36, 0),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, ColliderLayer.CL_PHYSICS, ColliderLayer.CL_PHYSICS)
	
	// Draw UI
	setupUi();

    //prepare phys engine
    GameStage.MoveVehicle({ x:42, y:16, z:32 });
    //prepare game manager
    GameManager.Initialize();
    //start spawning tickets
    TicketSpawnManager.SetSpawnState(true);

    //teleport player to map start
    movePlayerTo({
        newRelativePosition: {x:32, y:12, z:16},
        cameraTarget: {x:32, y:3, z:32},
    });
	
}
