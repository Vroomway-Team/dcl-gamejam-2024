import { List, Dictionary } from "./escentials";


/*      LOBBY PLAYER DATA
    management system for all registered players (in this context, that means any players that are in the lobby)
*/
export module LobbyPlayer {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("LOBBY PLAYER: "+log); }

    export interface PlayerScore { id:string, score:number };
    export interface PlayerPacket { id:string, name:string, vehicle:number, score:number };

    /** all players in the scene, unsorted */
    const playerList:List<PlayerDataObject> = new List<PlayerDataObject>();
    /**  */
    export function GetPlayer(index:number) {
        return playerList.getItem(index);
    }
    /**  */
    export function GetPlayerCount() {
        return playerList.size();
    }
    /** sorts player scores */
    export function SortPlayerScores() {
        var i:number = 0;
        while(i < playerList.size()-1) { 
            if(playerList.getItem(i).Score >= playerList.getItem(i+1).Score) {
                i++;
            } else {
                const temp = playerList.getItem(i);
                playerList.removeItem(temp);
                playerList.addItem(temp);
            }
        }
    }
    /** returns scoring data of the demanded length */
    export function GetPlayerScores(length:number):PlayerScore[] {
        const scores:PlayerScore[] = [];
        for(var i:number=0; i<length; i++) {
            const player = playerList.getItem(i);
            
            scores.push({ id:player.ID, score:player.Score });
        }
        return scores;
    }
    /** all players in the scene, key-d access by ID */
    const playerDict:Dictionary<PlayerDataObject> = new Dictionary<PlayerDataObject>();
    /** attempts to get a player's data */
    export function GetPlayerDataByID(key:string):undefined|PlayerDataObject {
        //return undefined if player data does not exist
        if(!playerDict.containsKey(key)) return undefined;
        //return player's data
        return playerDict.getItem(key);
    }
    /** */
    export function PlayerScoreAdd(key:string) {
        //return undefined if player data does not exist
        if(!playerDict.containsKey(key)) return;
        //add score
        playerDict.getItem(key).Score += 1;
        //update score board

    }
    
    /** all players in the scene, key-d access by vehicle ID */
    const vehicleDict:Dictionary<PlayerDataObject> = new Dictionary<PlayerDataObject>();
    /** returns whether a vehicle is occupied or not */
    export function IsVehicleOccupied(key:number):boolean {
        return vehicleDict.containsKey(key.toString());
    }
    /** returns an array of all occupied vehicles */
    export function VehicleStates():string[] {
        return vehicleDict.getKeys();
    }
    /** attempts to get a player's data */
    export function GetPlayerDataByVehicle(key:number):undefined|PlayerDataObject {
        //return undefined if player data does not exist
        if(!vehicleDict.containsKey(key.toString())) return undefined;
        //return player's data
        return vehicleDict.getItem(key.toString());
    }
    /** changes the vehicle currently selected by a player (player must already own a vehicle/exist in the lobby) */
    export function SwapVehicles(oldID:number, newID:number) {
        //attempt to get player
        const player = GetPlayerDataByVehicle(oldID);

        //halt if player does not own vehicle
        if(player == undefined) return;
        //halt if targeted vehicle is already occupied
        if(IsVehicleOccupied(newID)) return;

        //conduct swap
        player.Vehicle = newID;
        vehicleDict.removeItem(oldID.toString());
        vehicleDict.addItem(newID.toString(), player);

        addLog("player swapped vehicles: old="+oldID+", new="+newID);
    }

    /** object used to define a player's data */
    export interface PlayerDataDefinition {
        //player's id
        ID:string;
        //display name
        DisplayName:string;
        //targeted vehicle
        Vehicle:number;
        //current score
        Score:number;
    }

    /** represents a player's in-scene details */
    export class PlayerDataObject {
        /** player's unique id */
        public ID:string;
        /** player's display name */
        public DisplayName:string;
        /** current vehicle */
        public Vehicle:number;
        /** current score */
        public Score:number;

        //initialization
        constructor(data:PlayerDataDefinition) {
            this.ID = data.ID;
            this.DisplayName = data.DisplayName;
            this.Vehicle = data.Vehicle;
            this.Score = data.Score;
        }
    }

    /** adds a new player to be managed by the game */
    export function Create(data:PlayerDataDefinition) {
        addLog("creating new player {name="+data.DisplayName+"}...");
        
        //halt if player already exists
        if(playerDict.containsKey(data.ID)) return;

        //create
        const playerData = new PlayerDataObject(data);

        //remove player from collections
        playerList.addItem(playerData);
        playerDict.addItem(data.ID, playerData);
        vehicleDict.addItem(data.Vehicle.toString(), playerData);

        addLog("created new player {name="+data.DisplayName+"}!");

        //provide object reference
        return playerData;
    }

    export function GetPlayers():PlayerPacket[] {
        const players:PlayerPacket[] = [];
        for(var i:number=0; i<playerList.size(); i++) {
            const player = playerList.getItem(i);
            players.push({id:player.ID, name:player.DisplayName, vehicle:player.Vehicle, score:player.Score});
        }
        return players;
    }

    /** destroys the targeted player data */
    export function Destroy(target:string) {
        addLog("removing player: "+target);

        //halt if target does not exist 
        if(!playerDict.containsKey(target)) return;
        const playerData = playerDict.getItem(target);

        //remove player from collections
        playerList.removeItem(playerData);
        playerDict.removeItem(playerData.ID);
        vehicleDict.removeItem(playerData.Vehicle.toString());
        
        addLog("removed player: "+target);
    }

    /** destroys all registered player data */
    export function DestroyAll() {
        while(playerList.size() > 0) {
            Destroy(playerList.getItem(0).ID);
        }
    }
}