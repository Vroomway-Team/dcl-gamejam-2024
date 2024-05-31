import { CONFIG } 								from './_config'

import * as utils 								from '@dcl-sdk/utils'
import { Transform } 							from '@dcl/sdk/ecs'
import { Quaternion } 							from '@dcl/sdk/math'

import { setupUi } 								from '../ui/setupUI'
import { setupCannonWorld } 					from '../arena/setupCannonWorld'
import { setupGltfShapes } 						from '../arena/setupGltfShapes'
import { setupNPCAvatars } 						from '../arena/setupNPCAvatars'
import { setupImagePosters } 					from '../arena/setupImagePosters'
import { setupVehicleManager, VEHICLE_MANAGER } from '../arena/setupVehicleManager'
import { setupUiManager, UI_MANAGER } 			from '../classes/class.UIManager'
import { SCOREBOARD_MANAGER, setupScoreboards } from '../arena/setupScoreboards'

import { Room } 								from 'colyseus.js'
import { Networking } 							from '../networking'
import { GameManager } 							from '../arena/game-manager'
import { initSendPlayerInputToServerSystem } 	from '../systems/playerPositionSystem'
import { GameState } 							from '../game-state'
import { ScoreboardEntry } 						from '../interfaces/interface.Scoreboard'
import { TicketEntity } 						from '../arena/ticket-entity'
import * as serverStateSpec 					from '../rooms/spec/server-state-spec'
import * as clientStateSpec 					from '../rooms/spec/client-state-spec'
import { VehicleState } from '../interfaces/interface.VehicleState'
import * as CANNON from 'cannon'


export function updateScores(room:Room){
	//get all scores
	var scores:ScoreboardEntry[] = [];
	room.state.lobbyPlayersByID.forEach((value:clientStateSpec.PlayerState, key:string) => {
		scores.push({userName:value.playerName, score:value.score});
	});
	//sort scores
	scores.sort((a:ScoreboardEntry, b:ScoreboardEntry) =>  a.score - b.score );
	//update scores
	SCOREBOARD_MANAGER.updateState({ scores:scores });
	console.log("updated scoreboard: ",JSON.stringify(scores));
}