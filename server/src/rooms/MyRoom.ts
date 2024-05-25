import { Room, Client } from "colyseus";
import { Block, MyRoomState, Player } from "./MyRoomState";
import { LobbyManager } from "../lobby-management/lobby-manager";
import { LobbyPlayer } from "../lobby-management/lobby-player";
import { TicketSpawnManager } from "../lobby-management/ticket-spawner";

const ROUND_DURATION = 60 * 3;

export class MyRoom extends Room<MyRoomState> {
  public static Instance:MyRoom;

  private currentHeight: number = 0;
  private isFinished: boolean = false;

  onCreate (options: any) {
    //set instance
    MyRoom.Instance = this;

    //assert new room state
    this.setState(new MyRoomState());

    //# LOBBY MANAGER
    //game state change callback
    LobbyManager.SyncGameStateCallback = function() { 
      console.log("syncing game state, "+LobbyManager.GetGameState());
      MyRoom.Instance.broadcast("game-state-sync", { state:LobbyManager.GetGameState() as number }); 
    }
    //vehicle state redraw callback
    LobbyManager.SyncVehicleStatesCallback = function() { 
      MyRoom.Instance.broadcast("vehicle-state-sync", { states:LobbyPlayer.VehicleStates() }); 
    }
    //player join attempt
    this.onMessage("lobby-join", (client:Client, data:any) => {
      console.log("lobby-join called: client="+JSON.stringify(client)+", data="+JSON.stringify(data));
      //attempt to add player to lobby
      LobbyManager.AddPlayerToLobby(data.id, data.displayName, data.vehicle)
    });  
    //player join acceptance
    LobbyManager.PlayerJoinCallback = function(id:string, name:string, vehicle:number) {
      MyRoom.Instance.broadcast("player-join", { id:id, name:name, vehicle:vehicle }); 
    } 
    //player leave attempt
    this.onMessage("lobby-leave", (client:Client, data:any) => {
      console.log("lobby-leave called: "+JSON.stringify(data));
      //attempt to add player to lobby
      LobbyManager.RemovePlayerFromLobby(data.id);
    });
    //player leave acceptance
    LobbyManager.PlayerLeaveCallback = function(id:string) {
      MyRoom.Instance.broadcast("player-leave", { id:id }); 
    }
    //start game 
    this.onMessage("game-start", (client:Client, data:any) => {
      console.log("starting game!");
      LobbyManager.StartGame();
    });
    //end game
    this.onMessage("game-end", (client:Client, data:any) => {
      console.log("ending game!");
      LobbyManager.EndGame();
    });

    //# TICKET MANAGER
    //ticket spawning callback
    TicketSpawnManager.SpawnTicketCallback = function(id, position) { MyRoom.Instance.broadcast("ticket-spawn", { id:id, position }); }
    //pickup a ticket
    this.onMessage("ticket-interact", (client:Client, data:any) => {
      console.log("interacting with ticket: { playerID:"+data.playerID+", ticketID:"+data.ticketID+" }");
      //halt if no ticket on spawner
      if(!TicketSpawnManager.IsSpawnerOccupied(data.ticketID)) return;
      //halt if player is not in game
      if(LobbyPlayer.GetPlayerDataByID(data.playerID) == undefined) return;
      //add score to players
      LobbyPlayer.PlayerScoreAdd(data.playerID);
      // 
      this.broadcast("ticket-pickup", { playerID:data.playerID, ticketID:data.ticketID });
    }); 
  }

  onJoin(client:Client, options:any) {
    //register new player
    const newPlayer = new Player().assign({
      name: options.userData.id || "Anonymous",
      ranking: 0,
    });
    //assign session id
    this.state.players.set(client.sessionId, newPlayer);

    //send player the current lobby details (claimed vehicles & scores) 
    client.send("lobby-sync", {
      state:LobbyManager.GetGameState(),
      players:LobbyPlayer.GetPlayers(),
      tickets:TicketSpawnManager.GetTickets(),
    });

    console.log(newPlayer.name, "joined! => ", options.userData);
  } 

  onLeave(client:Client, consented:boolean) {
    //get player's session id
    const player = this.state.players.get(client.sessionId);
    console.log(player.name, "left!");

    //attempt to remove player from lobby
    LobbyManager.RemovePlayerFromLobby(player.name);

    //remove player's data
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("Disposing room...");
  }
}
