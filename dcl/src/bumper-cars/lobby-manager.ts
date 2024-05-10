import { Dictionary, List } from "../utilities/escentials";


/*      LOBBY MANAGER
    manages the lobby

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
export module LobbyManager {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("LOBBY MANAGER: "+log); }

    /** all possible participation types for players */
    export enum PLAYER_TYPE {
        //player is not registered & just viewing the game
        SPECTATOR,
        //player is actively playing the game
        PLAYING,
    }

    /** current lobby master, acts as the server/ledger for most important interactions */
    export var LobbyMaster:string;

    /** all players in the scene, unsorted */
    const playerList:List<PlayerDataObject> = new List<PlayerDataObject>();
    /** all players in the scene, key-d access by UID */
    const playerDict:Dictionary<PlayerDataObject> = new Dictionary<PlayerDataObject>();
    /** all players in the scene, sorted by their participation type */
    const playerSorted:Dictionary<List<PlayerDataObject>> = new Dictionary<List<PlayerDataObject>>();

    /** interface for creating a player's data */
    export interface PlayerDataCreationData {
        UID:string;
        DisplayName:string;
        Type?:PLAYER_TYPE;
    }

    /** */
    export class PlayerDataObject {
        /** player's unique id, currently using wallet address */
        public UID:string;

        //general details
        /**  */
        public DisplayName:string;

        //in-game details
        /** player's current type */
        public Type:PLAYER_TYPE;
        /** current score */

        /**  */
        constructor(data:PlayerDataCreationData) {
            this.UID = data.UID;

            this.DisplayName = data.DisplayName;

            this.Type = data.Type ?? PLAYER_TYPE.SPECTATOR;
        }
    }

    /** adds a new player to be managed by the game */
    export function Create(data:PlayerDataCreationData) {
        addLog("creating new player {name="+data.DisplayName+"}...");
        
        //halt if player already exists
        if(playerDict.containsKey(data.UID)) return;

        //create
        const playerData = new PlayerDataObject(data);

        //remove player from collections
        playerList.addItem(playerData);
        playerDict.addItem(data.UID, playerData);

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
        playerDict.removeItem(target);
        
        addLog("removed player: "+target);
    }
}