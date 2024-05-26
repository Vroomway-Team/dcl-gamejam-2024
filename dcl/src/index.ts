import { ColliderLayer, engine, 
		 GltfContainer, Transform 
} 								from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 	from '@dcl/sdk/math'
import { GltfObject } 			from './classes/class.GltfObject'

import { setupUi } 				from './ui/setupUI'
import { setupCannonWorld } 	from './arena/setupCannonWorld'
import { setupGltfShapes } 		from './arena/setupGltfShapes'
import { setupScoreboards } 	from './arena/setupScoreboards'
import { setupVehicleManager, VEHICLE_MANAGER } 	from './arena/setupVehicleManager'
import * as utils from '@dcl-sdk/utils'
import { ScoreDisplay } from './classes/class.ScoreDisplay'
import { Networking } from './networking'
import { GameManager } from './arena/game-manager'
import { TicketSpawnManager } from './arena/ticket-spawner'
import { LobbyPlayer } from './classes/class.LobbyPlayer'
import { Room } from 'colyseus.js'

export function main() {
	//turn on trigger debug mode (draws )
	utils.triggers.enableDebugDraw(true);

	// Draw UI
	setupUi()
	
	// Setup Cannon World - adds the world, ground, arena colliders
	setupCannonWorld()
	
	// Setup the vehicle manager, which in turn spawns all the vehicles
	// Also add input listener system and controls vehicle movement
	setupVehicleManager()
	
	// Setup the scoreboards
	setupScoreboards()
	 
	// Setup the various gltf shapes
	setupGltfShapes()

	//position scoreboard
	Transform.getMutable(ScoreDisplay.ScoreBoardParent).position = {x:35, y:2, z:32},
	ScoreDisplay.UpdateDisplays();

	//set up player (server connection)
	PlayerSetup();
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
	Networking.InitializeClientConnection(Networking.CONNECTION_TYPE.LOCAL);
  
	//attempt to access a room on server
	console.log("joining room..."); 
	await Networking.GetClientConnection().joinOrCreate("my_room", { 
	  userData: { id:Networking.GetUserID(), displayName:Networking.GetUserName() } 
	}).then((room: Room) => {

	  //set room instance
	  console.log("player joined room: ", room);
	  Networking.ClientRoom = room;

	  //hook up message callbacks 
	  //  syncing for entire lobby (for when a new player joins to make sure everything is in-session)
	  room.onMessage("lobby-sync", (data:any) => {
		console.log("server call: lobby-sync");
		//set game state
		GameManager.SetGameState(data.state);  
		//register all players
		LobbyPlayer.DestroyAll();
		for(var i:number=0; i<data.players.length; i++) {
		  LobbyPlayer.Create({ID:data.players[i].id, DisplayName:data.players[i].name, Vehicle:data.players[i].vehicle, Score:data.players[i].score});
		} 
		//tickets
		TicketSpawnManager.ClearAll();
		for(var i:number=0; i<data.tickets.length; i++) {
		  TicketSpawnManager.Spawn(data.id, data.position);
		}
	  });   
	  //  syncing for lobby state 
	  room.onMessage("game-state-sync", (data:any) => {
		console.log("server call: game-state-sync")
		//set new game state 
		GameManager.SetGameState(data.state);    
	  });
	  //  syncing for game countdown
	  room.onMessage("game-countdown-sync", (data:any) => {
		console.log("server call: game-countdown-sync")
		//set new game state 
		GameManager.StartLobbyCountdown(data.length);    
	  });
	  //  player join
	  room.onMessage("player-join", (data:any) => {
		console.log("server call: player-join")
		//add player to game
		const player = LobbyPlayer.Create({ID:data.id, DisplayName:data.name, Vehicle:data.vehicle, Score:0});
		//claim vehicle
		VEHICLE_MANAGER.userClaimVehicle(player.Vehicle, player.ID, player.DisplayName);
		//update scores
		ScoreDisplay.UpdateDisplays();
	  });    
	  //  player leave  
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
	  });  
	  //  syncing for vehicle states
	  room.onMessage("vehicle-state-sync", (data:any) => {
		console.log("server call: vehicle-state-sync")
		//update vehilce states
		//VEHICLE_MANAGER.UpdateVehicleStates(data.states); 
	  });
	  //  syncing for ticket placement (when server spawns a ticket) 
	  room.onMessage("ticket-spawn", (data:any) => { 
		TicketSpawnManager.Spawn(data.id, data.position)
	  }); 
	  //  syncing for ticket remove (when server sees a ticket is picked up)
	  room.onMessage("ticket-pickup", (data:any) => { 
		//provide score to player
		LobbyPlayer.PlayerScoreAdd(data.playerID);
		//remove ticket
		TicketSpawnManager.Clear(data.ticketID); 
		//update scores display
		ScoreDisplay.UpdateDisplays();
	  }); 
   
	}).catch((e) => {
	  console.log("error entering room: ", e);
	});
  } 