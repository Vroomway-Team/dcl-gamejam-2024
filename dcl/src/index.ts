import { Transform } from '@dcl/sdk/ecs'
import { setupUi } from './ui/setupUI'
import { setupCannonWorld } from './arena/setupCannonWorld'
import { setupGltfShapes } from './arena/setupGltfShapes'
import { setupScoreboards } from './arena/setupScoreboards'
import { setupVehicleManager, VEHICLE_MANAGER } from './arena/setupVehicleManager'
import * as utils from '@dcl-sdk/utils'
import { ScoreDisplay } from './classes/class.ScoreDisplay'
import { Networking } from './networking'
import { GameManager } from './arena/game-manager'
import { TicketSpawnManager } from './arena/ticket-spawner'
import { LobbyPlayer } from './classes/class.LobbyPlayer'
import { Room } from 'colyseus.js'
import { initSendPlayerInputToServerSystem } from './systems/playerPositionSystem'
import * as serverStateSpec from './rooms/spec/server-state-spec'
import * as clientStateSpec from './rooms/spec/client-state-spec'
import { Quaternion } from '@dcl/sdk/math'

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

	initSendPlayerInputToServerSystem()
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
	  console.log("player joined room: ", room,room.state);
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
		console.log("server call: player-join",data)
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
	  //	updates for vehicle controller
	  room.onMessage("player-vehicle-controller-update", (data:any) => {
		console.log("server call: player-vehicle-controller-update");
		//get vehicle
		const vehicle = VEHICLE_MANAGER.getVehicle(data.vehicleID);
		if(vehicle == undefined) return;
		//halt if call is targeting vehicle owned by this player (we use local authority so dont care about echo-corrections)
		if(vehicle.ownerID == Networking.GetUserID()) return;
		//update vehicle position
		//vehicle.UpdateVehicleController(data);

		//COMMENTING OUT FOR NOW USING SCENE STATE below
		//search for 'player.listen("racingData"' to see it

		
		// const player = LobbyPlayer.GetPlayerDataByID(vehicle.ownerID)
		// //replace with?
		// vehicle.setVehicleState({
		// 	isClaimed   : true,//   : boolean,      // taken from Vehicle instance
		// 	ownerID        : vehicle.ownerID,       // taken from PlayerData
		// 	ownerName      : player ? player.DisplayName : 'Unknown',       // taken from PlayerData
		// 	position       : data.worldPosition,      // taken from DCL entity, applied to cannonBody
		// 	heading   : Quaternion.toEulerAngles(quaternionCreate(data.moveDirection)).y,//     : number,      // taken from DCL entity, applied to DCL entity
		// 	velocity       : data.moveVelocity ? new CANNON.Vec3(data.moveVelocity.x,data.moveVelocity.y,data.moveVelocity.z) : undefined as any,  // taken from cannonBody, applied to cannonBody
		// 	angularVelocity: data.angularVelocity ? new CANNON.Vec3(data.angularVelocity.x,data.angularVelocity.y,data.angularVelocity.z) : undefined as any,  // taken from cannonBody, applied to cannonBody
		// 	score  : player ? player.Score : -1,//         : number,       // player score, num tickets/tokens, etc
		// 	rank   : undefined as any,//        : number        // current ranking for this vehicle. lower is better, starts at 1
		// });

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

	  room.onStateChange((state) => {
		console.log("server call:",room.name, "has new state:", state);
	  });

	  room.state.players.onAdd(
		function (player: clientStateSpec.PlayerState, sessionId: string){
			console.log("server call:","room.state.players.onAdd", player);

			//const playerLocal = LobbyPlayer.GetPlayerDataByID(player.id)

			player.listen("racingData", (raceData: clientStateSpec.PlayerRaceDataState) => {
				console.log("server call: player.racingData.update",raceData)
				VEHICLE_MANAGER.getVehicle(raceData.carModelId).setVehicleState({
					isClaimed   : true,//   : boolean,      // taken from Vehicle instance
					ownerID        : player.id,       // taken from PlayerData
					ownerName      : player.name,       // taken from PlayerData
					position       : raceData.worldPosition,      // taken from DCL entity, applied to cannonBody
					heading   : Quaternion.toEulerAngles(quaternionCreate(raceData.worldMoveDirection)).y,//     : number,      // taken from DCL entity, applied to DCL entity
					velocity       : raceData.velocity ? new CANNON.Vec3(raceData.velocity.x,raceData.velocity.y,raceData.velocity.z) : undefined as any,  // taken from cannonBody, applied to cannonBody
					angularVelocity: raceData.angularVelocity ? new CANNON.Vec3(raceData.angularVelocity.x,raceData.angularVelocity.y,raceData.angularVelocity.z) : undefined as any,  // taken from cannonBody, applied to cannonBody
					score  : raceData ? raceData.score : -1,//         : number,       // player score, num tickets/tokens, etc
					rank   : raceData.racePosition,//        : number        // current ranking for this vehicle. lower is better, starts at 1
				});
			});
		}
	  );	

	}).catch((e) => {
	  console.log("error entering room: ", e);
	});
  } 

function quaternionCreate(worldMoveDirection: serverStateSpec.Quaternion3State): Quaternion.MutableQuaternion {
	return worldMoveDirection ? Quaternion.create(worldMoveDirection.x, worldMoveDirection.y, worldMoveDirection.z, worldMoveDirection.w) : Quaternion.Zero()
}
