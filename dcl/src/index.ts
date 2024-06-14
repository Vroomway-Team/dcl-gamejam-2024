import { CONFIG } 								from './_config'

import "./polyfill/delcares";

import * as utils 								from '@dcl-sdk/utils'
import { Transform } 							from '@dcl/sdk/ecs'
import { Quaternion } 							from '@dcl/sdk/math'

import { setupUi } 								from './ui/setupUI'
import { setupCannonWorld } 					from './arena/setupCannonWorld'
import { setupGltfShapes } 						from './arena/setupGltfShapes'
import { setupNPCAvatars } 						from './arena/setupNPCAvatars'
import { setupImagePosters } 					from './arena/setupImagePosters'
import { setupVehicleManager, VEHICLE_MANAGER } from './arena/setupVehicleManager'
import { setupUiManager, UI_MANAGER } 			from './classes/class.UIManager'
import { SCOREBOARD_MANAGER, setupScoreboards } from './arena/setupScoreboards'
import { PARTICLE_MANAGER } 					from './arena/setupParticleManager'

import { Room } 								from 'colyseus.js'
import { Networking } 							from './networking'
import { GameManager } 							from './arena/game-manager'
import { initSendPlayerInputToServerSystem } 	from './systems/playerPositionSystem'
import { GameState } 							from './game-state'
import { ScoreboardEntry } 						from './interfaces/interface.Scoreboard'
import { TicketEntity } 						from './arena/ticket-entity'
import * as serverStateSpec 					from './rooms/spec/server-state-spec'
import * as clientStateSpec 					from './rooms/spec/client-state-spec'
import { VehicleState } from './interfaces/interface.VehicleState'
import * as CANNON from 'cannon'
import { updateScores } from './utilities/game-play-utils'
import { NPCManager } from './arena/npc-manager'
import { getAndSetRealmDataIfNull, getAndSetUserDataIfNull, getRealmDataFromLocal, getUserDataFromLocal } from './userData'
import { doLoginFlow, registerLoginFlowListener } from './connect/login-flow'
 
// Config options for colyseus and debug features are in _config.ts

export function main() {
	//turn on trigger debug mode (draws )
	utils.triggers.enableDebugDraw(CONFIG.SHOW_DEBUG_TRIGGERS);

	/* /ticket creation test
	const t0 = TicketEntity.Create({ id:0, transform:{ position:{x:24,y:2,z:30} } });
	const t1 = TicketEntity.Create({ id:1, transform:{ position:{x:24,y:2,z:32} } });
	const t2 = TicketEntity.Create({ id:2, transform:{ position:{x:24,y:2,z:34} } });
	console.log("test 0: id="+JSON.stringify(Transform.getMutable(t0.EntityModel).position));
	console.log("test 1: id="+JSON.stringify(Transform.getMutable(t1.EntityModel).position));
	console.log("test 2: id="+JSON.stringify(Transform.getMutable(t2.EntityModel).position)); */

	//call it so can cache it sooner
	getAndSetRealmDataIfNull()
	getAndSetUserDataIfNull()
	 
	registerLoginFlowListener()
	
	setupUiManager()
	// Draw UI
	setupUi()
	//ReactEcsRenderer.setUiRenderer(ui.render)
	

	
	// Setup Cannon World - adds the world, ground, arena colliders
	setupCannonWorld()
	
	// Setup the vehicle manager, which in turn spawns all the vehicles
	// Also add input listener system and controls vehicle movement
	setupVehicleManager()
	
	// Setup the scoreboards
	setupScoreboards()
	 
	// Setup the various gltf shapes
	setupGltfShapes()

	// Setup NPC Avatars
	setupNPCAvatars()

	// Setup Image Posters
	setupImagePosters()

	//position scoreboard
	//Transform.getMutable(ScoreDisplay.ScoreBoardParent).position = {x:35, y:2, z:32},
	//ScoreDisplay.UpdateDisplays();

	const startGameFN = () => {
		//fetch leaderboards
		//initGamePlay() 

		//set up player (server connection)
		PlayerSetup();

		initSendPlayerInputToServerSystem()
	}

	doLoginFlow(
		{  
			onSuccess:()=>{
				console.log("login success","connect to server")
				
				startGameFN()
			},
			onFailure:()=>{
				//FIXME!!!
				console.log("login FAILED","still connecting server")
				
				startGameFN()
			}
		}
	)

}

/** handles the the initial player setup, getting their DCL details and connecting to the colyseus server */
async function PlayerSetup() {
	//get DCL details
	console.log("getting player details...");
	await Networking.LoadPlayerData();
	 
	console.log("got player details!");
 
	//initialize game manager (ensures all sub-modules are ready)
	GameManager.Initialize();

	//initialize client's connection to server
	Networking.InitializeClientConnection(CONFIG.COLYSEUS_SERVER);
  
	//attempt to access a room on server
	console.log("joining room..."); 

	Networking.connectedState = {status:"connecting",msg:"connecting to " + "my_room"};
 
	let localUserDataCopy:any = {...getUserDataFromLocal()}
    delete localUserDataCopy.avatar
    delete localUserDataCopy.wearables
    delete localUserDataCopy.emotes

	await Networking.GetClientConnection().joinOrCreate("my_room", { 
		userData: { ...localUserDataCopy, id:Networking.GetUserID(), displayName:Networking.GetUserName() },
		clientSDK: "7.x.x",
		//used for matching rooms
		//for px prefixing with "px-scene:"
		playerId: localUserDataCopy?.userId,

		realmInfo: getRealmDataFromLocal(),
		//still passed for room filterby
		realm: getRealmDataFromLocal()?.realmName,

		playFabData: Networking.getPlayerPlayFabData()
	}).then((room: Room) => {
		//set room instance
		console.log("local player joined server room: ", room, room.state);
		Networking.ClientRoom = room; 
		Networking.connectedState = {status:"connected",msg:"connected to " + room.name + ";" + room.sessionId};

		//called whenever an error occurs
		room.onError((code, message) => {
			Networking.connectedState = {status:"error",msg:code + ":"+ message};
		});
		//called when the player disconnects from the room
		room.onLeave((code) => {
			Networking.connectedState = {status:"disconnected",msg:code + ":"};
		});
	   
		/* /  syncing for lobby state (depreciated)
		room.onMessage("game-state-sync", (data:any) => {
			console.log("server call: game-state-sync")
			//set new game state 
			GameManager.SetGameState(data.state);    
		}); */
		/* /  syncing for game countdown (depreciated)
		room.onMessage("game-countdown-sync", (data:any) => {
			console.log("server call: game-countdown-sync")
			//set new game state 
			GameManager.StartLobbyCountdown(data.length);    
		});  */
		/* /  player join (depreciated)
		room.onMessage("player-join", (data:any) => { 
			console.log("server call: player-join",data)
			//add player to game
			const player = LobbyPlayer.Create({ID:data.id, DisplayName:data.name, Vehicle:data.vehicle, Score:0});
			//claim vehicle
			VEHICLE_MANAGER.userClaimVehicle(player.Vehicle, player.ID, player.DisplayName);
			//update scores
			ScoreDisplay.UpdateDisplays();
		}); */   
		/* /  player leave (depreciated)
		room.onMessage("player-leave", (data:any) => {
			console.log("server call: player-leave")
			const player = LobbyPlayer.GetPlayerDataByID(data.id);
			if(player == undefined) return;
			//unclaim vehicle
			VEHICLE_MANAGER.userUnclaimVehicle(player.Vehicle);
			//remove player 
			LobbyPlayer.Destroy(player.ID);
			//update scores
			ScoreDisplay.UpdateDisplays(); 
		});*/
		/* /  syncing for ticket placement (when server spawns a ticket) (depreciated)
		room.onMessage("ticket-spawn", (data:any) => { 
		}); */ 
		/* /  syncing for ticket remove (when server sees a ticket is picked up)  (depreciated)
		room.onMessage("ticket-pickup", (data:any) => { 
			//provide score to player
			LobbyPlayer.PlayerScoreAdd(data.playerID);
			//remove ticket
			TicketSpawnManager.Clear(data.ticketID); 
			//update scores display
			ScoreDisplay.UpdateDisplays();
		});*/

		//#		GAME STATE DETAILS
		//called when game state changes
		room.state.listen("GameState", (currentValue:number, previousValue:number) => {
			console.log(`GameState is now ${currentValue}, previous value was: ${previousValue}`);
			//set game state
			const currentState = GameState.CurGameState.GetValue()
			// if(currentState != currentValue){
			// 	if(currentState)
			// }
			
			GameManager.SetGameState(currentValue);

			//make scoreboard update
			if(currentValue == GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION){
				updateScores(room);
			}
		});
		//called when game state changes
		room.state.listen("GameStartTimer", (currentValue:number, previousValue:number) => {
			//console.log(`GameStartTimer is now ${currentValue}, previous value was: ${previousValue}`);
			//update timer
			GameState.GameStartCountdown.SetValue(currentValue);
		});
		//called when game state changes
		room.state.listen("GameRoundTimer", (currentValue:number, previousValue:number) => {
			//console.log(`GameRoundTimer is now ${currentValue}, previous value was: ${previousValue}`);
			//update timer
			GameState.GameEndCountdown.SetValue(currentValue);
			UI_MANAGER.setTimerValue(currentValue);
		});
 
		//#		PLAYER DETAILS
		//called when a player joins the lobby
		room.state.lobbyPlayersByID.onAdd(
			function (player: clientStateSpec.PlayerState, sessionId: string) {
				console.log("server call: player added to lobby, "+JSON.stringify(player));

				//claim vehicle
				VEHICLE_MANAGER.userClaimVehicle(player.vehicleID, player.playerID, player.playerName);

				//add a listener to the new player's racing data (automates race updates)
				player.listen("score", (score:number) => {
					//if player is local
					if(player.playerID == Networking.GetUserID()) {
						UI_MANAGER.setScoreValue(score);
					}
					const gameState = GameState.CurGameState.GetValue();
					//need to update when player leaves to remove their name from scoreboard
					//BUT it also erases the results from the last round :(
					if(gameState == GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION){
						updateScores(room);
					}
				});
 
				//add a listener to the new player's racing data (automates race updates)
				player.listen("racingData", (raceData: clientStateSpec.VehicleStateSyncData) => {
					if(raceData == undefined) return;

					//halt if game is not in session
					if(GameState.CurGameState.GetValue() != GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION) return;
					//get vehicle from manager
					const vehicle = VEHICLE_MANAGER.getVehicle(player.vehicleID);
					if(vehicle == undefined) {
						console.log("server call: player.racingData.update","could not find vehicle!!!",raceData)
						return;
					}

					//dont halt here, vehicle internally knowns and will ignore if needed (<- not anymore >_>)
					//pre-push for local players (ik, it is messy)
					vehicle.score = player.score;
					vehicle.setRank(raceData.rank);
					//halt if vehicle owner is operated by local player (client has authority)
					if(player.playerID == Networking.GetUserID()) return;
					//halt if vehicle is an npc operated by local player (delegated operator has authority)
					if(NPCManager.NPC_DELEGATE_REG.containsKey(player.playerID)) return;
					//console.log("updating vehicle: "+player.vehicleID+", "+JSON.stringify(raceData));
 
					//pass patched data to vehicle controller
					const velocity = new CANNON.Vec3(raceData.velocity.x,raceData.velocity.y,raceData.velocity.z);
					const angularVelocity = new CANNON.Vec3(raceData.angularVelocity.x,raceData.angularVelocity.y,raceData.angularVelocity.z);
					//Networking.lastKnownServerTime = raceData.serverTime
					const vehicleState:VehicleState = {
						//state
						isClaimed:true,
						//player
						ownerID:player.playerID,
						ownerName:player.playerName,
						score:player.score,
						rank:raceData.rank,
						//vehicle (taken from cannonBody, applied to cannonBody)
						position:{ x:raceData.position.x, y:raceData.position.y, z:raceData.position.z },
						heading:raceData.heading,
						velocity:velocity,
						angularVelocity:angularVelocity,
					};
					vehicle.setVehicleState(vehicleState);
				}); 
	  	});

		//called when a player leaves the lobby
		room.state.lobbyPlayersByID.onRemove(
			function (player: clientStateSpec.PlayerState, sessionId: string) {
				console.log("server call: player removed from lobby, "+JSON.stringify(player));
				//get vehicle from manager
				const vehicle = VEHICLE_MANAGER.getVehicle(player.vehicleID);
				if(vehicle != undefined) {
					vehicle.disable();
					vehicle.moveToLobby();
				}
				//release vehicle
				VEHICLE_MANAGER.userUnclaimVehicle(player.vehicleID);
				//FIXME
				//only when game is live
				const gameState = GameState.CurGameState.GetValue();
				//need to update when player leaves to remove their name from scoreboard
				//BUT it also erases the results from the last round :(
				if(gameState == GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION){
					updateScores(room);
				}
		});

		//# 	NPC DETAILS
		//called when an NPC control delegate is added to the game
		room.state.lobbyNPCs.onAdd(
		function (npcController: clientStateSpec.NPCControllerState, sessionId: string) {
			console.log("server call: npc added to lobby, "+JSON.stringify(npcController));

			//halt if npc owner is not local player
			if(npcController.ownerID != Networking.GetUserID()) return;

			//create new npc controller
			console.log("creating npc controller for local player to manage npc");
			NPCManager.Create(npcController.npcID);
		});
		room.state.lobbyNPCs.onRemove(
		function (npcController: clientStateSpec.NPCControllerState, sessionId: string) {
			console.log("server call: npc removed from lobby, "+JSON.stringify(npcController));
 
			//halt if npc owner is not local player
			if(npcController.ownerID != Networking.GetUserID()) return;

			//remove npc controller
			console.log("removing npc controller");
			NPCManager.Destroy(npcController.npcID);
		}); 

		//#		TICKET DETAILS
		//called when a ticket is added to the game
		room.state.gameTickets.onAdd(
		function (ticket: clientStateSpec.TicketState, sessionId: string) {
			//console.log("server call: ticket added to lobby, "+JSON.stringify(ticket));

			//spawn ticket
            TicketEntity.Create({ id:ticket.ticketID, transform:{ position:ticket.PositionCurrent } });
		});
		//called when a ticket is removed from the game
		room.state.gameTickets.onRemove(
		function (ticket: clientStateSpec.TicketState, sessionId: string) {
			console.log("server call: ticket removed from lobby, "+JSON.stringify(ticket));

			//remove ticket
			const tmp = TicketEntity.GetByKey(ticket.ticketID.toString());
			if(tmp != undefined) TicketEntity.Disable(tmp);
 
			//send update to npc manager
			NPCManager.TicketClaimed(ticket.ticketID);
		}); 

	}).catch((e) => {
	  console.log("error entering room: ", e);
	}); 
}

function quaternionCreate(worldMoveDirection: serverStateSpec.Quaternion3State): Quaternion.MutableQuaternion {
	return worldMoveDirection ? Quaternion.create(worldMoveDirection.x, worldMoveDirection.y, worldMoveDirection.z, worldMoveDirection.w) : Quaternion.Zero()
}
