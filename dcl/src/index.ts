import { Client, Room } from "colyseus.js";
import { Networking } from "./utilities/networking";
import { VehicleManager } from "./vehicle-manager";
import { GameManager } from "./game-manager";
import { TicketSpawnManager } from "./ticket-spawner";
import * as utils from '@dcl-sdk/utils'
import { Transform } from "@dcl/sdk/ecs";
import { ScoreDisplay } from "./score-display";
import { LobbyPlayer } from "./lobby-player";

export function main() {
  //turn on trigger debug mode
  utils.triggers.enableDebugDraw(true);

  //position scoreboard
  Transform.getMutable(ScoreDisplay.ScoreBoardParent).position = {x:5, y:2, z:12},
  ScoreDisplay.UpdateDisplays();

  PlayerSetup();
}

/** handles the the initial player setup, getting their DCL details and connecting to the colyseus server */
async function PlayerSetup() {
  //get DCL details
  console.log("getting player details...");
  await Networking.LoadPlayerData();
  console.log("got player details!");

  //initialize connection to colyseus server
  console.log("joining room..."); 
  await Networking.CLIENT_CONNECTION.joinOrCreate("my_room", { 
    userData: { id:Networking.GetUserID(), displayName:Networking.GetUserName() } 
  }).then((room: Room) => {
    console.log("player joined room: ", room);
    //set room instance
    Networking.ServerRoom = room; 
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
    //  player join
    room.onMessage("player-join", (data:any) => {
      console.log("server call: player-join")
      //add player to game
      LobbyPlayer.Create({ID:data.id, DisplayName:data.name, Vehicle:data.vehicle, Score:0});
      //update scores
      ScoreDisplay.UpdateDisplays();
    }); 
    //  player leave  
    room.onMessage("player-leave", (data:any) => {
      console.log("server call: player-leave")
      const player = LobbyPlayer.GetPlayerDataByID(data.id);
      if(player == undefined) return;
      //remove player 
      LobbyPlayer.Destroy(data.id);
      //update scores
      ScoreDisplay.UpdateDisplays();
    });  
    //  syncing for vehicle states
    room.onMessage("vehicle-state-sync", (data:any) => {
      console.log("server call: vehicle-state-sync")
      //update vehilce states
      VehicleManager.UpdateVehicleStates(data.states); 
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