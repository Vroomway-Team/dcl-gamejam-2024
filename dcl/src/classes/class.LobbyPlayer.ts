import { VEHICLE_MANAGER } from "../arena/setupVehicleManager";
import { Networking } from "../networking";
import { Dictionary, List } from "../utilities/escentials";
import { UI_MANAGER } from "./class.UIManager";

/*      LOBBY PLAYER DATA
    management system for all registered players (in this context, that means any players that are in the lobby)
*/
export module LobbyPlayer {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("LOBBY PLAYER: "+log); }

    export interface PlayerScore { id:string, score:number };

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
        const player = playerDict.getItem(key);
        //return undefined if player data does not exist
        if(!player) return;
        //add score
        player.Score += 1;
        //if local, update ui manager
        if(Networking.GetUserID() == key) UI_MANAGER.setScoreValue(player.Score);
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
        if(playerDict.containsKey(data.ID)) Destroy(data.ID);

        //create
        const playerData = new PlayerDataObject(data);

        //remove player from collections
        playerList.addItem(playerData);
        playerDict.addItem(data.ID, playerData);
        //update claimed vehicle state
        VEHICLE_MANAGER.userClaimVehicle(playerData.Vehicle, playerData.ID, playerData.DisplayName);

        addLog("created new player {name="+data.DisplayName+"}!");

        //provide object reference
        return playerData;
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
        //update claimed vehicle state
        VEHICLE_MANAGER.userUnclaimVehicle(playerData.Vehicle);
        
        addLog("removed player: "+target);
    }

    /** destroys all registered player data */
    export function DestroyAll() {
        while(playerList.size() > 0) {
            Destroy(playerList.getItem(0).ID);
        }
    }
}