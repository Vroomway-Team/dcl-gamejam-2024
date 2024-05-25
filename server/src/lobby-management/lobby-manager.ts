import { LobbyPlayer } from "./lobby-player";
import { TicketSpawnManager } from "./ticket-spawner";

/*      LOBBY MANAGER (SERVER)
    used to manage a lobby containing players

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
export module LobbyManager {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("LOBBY MANAGER: "+log); }

    /**  */
    var ProcessID_TicketSpawning:undefined|NodeJS.Timeout;

    /**  */
    export type SyncGameStateCallbackType = () => void;
    export var SyncGameStateCallback:undefined|SyncGameStateCallbackType;
    
    /**  */
    export type SyncVehicleStatesCallbackType = () => void;
    export var SyncVehicleStatesCallback:undefined|SyncGameStateCallbackType;
    
    /**  */
    export type PlayerJoinCallbackType = (id:string, name:string, vehicle:number) => void;
    export var PlayerJoinCallback:undefined|PlayerJoinCallbackType;
    
    /**  */
    export type PlayerLeaveCallbackType = (id:string) => void;
    export var PlayerLeaveCallback:undefined|PlayerLeaveCallbackType;

    /** all possible game states */
    export enum GAME_STATE {
        LOBBY_IDLE, //no players registered
        LOBBY_COUNTDOWN, //countdown before players are placed into the arena
        PLAYING_COUNTDOWN, //countdown before players can move
        PLAYING_IN_SESSION, //game is in session
        GAME_OVER //game has ended
    }

    /** current game state of the lobby */
    var gameState:GAME_STATE = GAME_STATE.LOBBY_IDLE;
    export function GetGameState():GAME_STATE { 
        return gameState;
    } 
    export function SetGameState(state:GAME_STATE) {
        //halt if same game state
        if(gameState == state) return;
        //set new game state
        gameState = state;
        //sync new game state & vehicle states
        if(SyncGameStateCallback) SyncGameStateCallback();
    }

    /** locks the lobby and begins the game */
    export function StartGame() {
        addLog("starting game...");
        //halt if session is not idle
        if(GetGameState() != GAME_STATE.LOBBY_IDLE) {
            addLog("failed - lobby is not idle");
            return;
        }
        //ensure at least one player is registered
        if(LobbyPlayer.GetPlayerCount() <= 0) {
            addLog("failed - no players in lobby");
            return;
        }

        //set new game state
        SetGameState(GAME_STATE.PLAYING_IN_SESSION);

        //start spawning tickets
        if(ProcessID_TicketSpawning == undefined) {
            ProcessID_TicketSpawning = setInterval(TicketSpawnManager.SpawnTicket, TicketSpawnManager.TICKET_SPAWN_LENGTH);
            addLog("started ticket spawning, timeoutID="+ProcessID_TicketSpawning);
        }

        addLog("game started!");
    }

    /** ends the current game, resetting the lobby */
    export function EndGame() {
        addLog("game ending...");
        //unregister all players
        LobbyPlayer.DestroyAll();
        
        //halt ticket spawning
        if(ProcessID_TicketSpawning != undefined) {
            clearInterval(ProcessID_TicketSpawning);
            ProcessID_TicketSpawning = undefined;
        }

        //set new game state
        SetGameState(GAME_STATE.LOBBY_IDLE);
        //sync new vehicle states
        SyncVehicleStatesCallback();
        
        addLog("game ended!");
    }

    /** attempts to add the given player to the lobby */
    export function AddPlayerToLobby(id:string, name:string, vehicle:number) {
        addLog("adding player {id="+id+", vehicle="+vehicle+"}...");
        //halt if session is not idle
        if(GetGameState() != GAME_STATE.LOBBY_IDLE) {
            addLog("failed - lobby is not idle");
            return;
        }
        //halt if vehicle is reserved
        if(LobbyPlayer.IsVehicleOccupied(vehicle)) {
            addLog("failed to add player - vehicle already occupied");
            return;
        }

        //attempt to get player
        const player = LobbyPlayer.GetPlayerDataByID(id);

        //if player does not exist, create a new player
        if(player == undefined){
            //add player to lobby
            LobbyPlayer.Create({ID:id, DisplayName:name, Vehicle:vehicle, Score:0});
        } 
        //if player is already exists, attempt a vehicle swap
        else {
            //attempt swap
            LobbyPlayer.SwapVehicles(player.Vehicle, vehicle);
        }
        
        //sync new vehicle states
        if(PlayerJoinCallback) PlayerJoinCallback(id, name, vehicle);

        addLog("added player {id="+id+", vehicle="+vehicle+"}!");
    }

    /** attempts to remove the given player from the lobby */
    export function RemovePlayerFromLobby(id:string):boolean {
        addLog("removing player {id="+id+"}...");
        //attempt to get player
        const player = LobbyPlayer.GetPlayerDataByID(id);
        
        //halt if session is not idle
        if(GetGameState() != GAME_STATE.LOBBY_IDLE) {
            addLog("failed - lobby is not idle");
            return;
        }
        //halt if player is not in lobby
        if(player == undefined) {
            addLog("player did not exist in lobby")
            return;
        }

        //remove player from lobby
        LobbyPlayer.Destroy(id);

        //if game is playing & no players left, reset the lobby
        if(GetGameState() == GAME_STATE.PLAYING_IN_SESSION && LobbyPlayer.GetPlayerCount() <= 0) {
            addLog("failed - no players in lobby");

        }

        //sync new vehicle states
        if(PlayerJoinCallback) PlayerLeaveCallback(id);
        
        addLog("removed player {id="+id+"}!");
    }

    /**  */
    export function AddScoreToPlayer() {
        //halt if player is not registered to lobby


        //increase score on player


        //resync score to clients

    }
}