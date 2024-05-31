import { Billboard, Entity, InputAction, PointerEventType, TextShape, Transform, engine, inputSystem } from "@dcl/sdk/ecs";
import { TicketEntity } from "./ticket-entity";
import { Networking } from "../networking";
import { DynamicButton_Simple } from "../utilities/escentials";
import { GameState } from "../game-state";
import { LobbyLabel, PlayerUnclaimCallbackType } from "../classes/class.LobbyLabel";
import { AudioManager } from "./audio-manager";
import { VEHICLE_MANAGER } from "./setupVehicleManager";
import { UI_MANAGER } from "../classes/class.UIManager";
import { CONFIG } from "../_config";

/*      BUMPER CARS - GAME MANAGER
    acts as the main controller for the game of bumper cars

    this is has been gutted to fit the server and needs to be redone >_>
*/  
export module GameManager {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("GAME MANAGER: "+log); }
    
    export type PlayerVehicleCollisionCallbackType = (playerID:string) => void;
    export var PlayerVehicleCollisionCallback:PlayerVehicleCollisionCallbackType;

    /** initializes the game manager, setting the default entry state */
    export function Initialize() {
        addLog("initializing...");

        //create game logic
        //  player attempts to claim a vehicle  
        LobbyLabel.PlayerClaimCallback = function(vehicle:number) {
            //halt if player is not part of a room
            if(Networking.ClientRoom == undefined) return;
            //send claim request  
            Networking.ClientRoom.send("player-join-request", {id:Networking.GetUserID(), displayName:Networking.GetUserName(), vehicle:vehicle});
        }
        //  player attempts to unclaim a vehicle
        LobbyLabel.PlayerUnclaimCallback = function() {
            //halt if player is not part of a room
            if(Networking.ClientRoom == undefined) return;
            //send claim request
            Networking.ClientRoom.send("player-leave-request", {id:Networking.GetUserID()});
        } 
        //  player's vehicle getting hit by another (can be called by a delegated NPC)
        PlayerVehicleCollisionCallback = function(playerID:string) {
            console.log("dropping tickets");
            //halt if player is not part of a room
            if(Networking.ClientRoom == undefined) return;
            //if local player notify player of hit
            if(playerID == Networking.GetUserID()) UI_MANAGER.hitNotify.show();
            //send claim request 
            Networking.ClientRoom.send("ticket-drop", { playerID:playerID });
        } 
        //  ticket collides with ticket (pickup logic) (can be called by a delegated NPC)
        TicketEntity.CallbackTicketCollision = function(ticketID:number, playerID:string) {
            console.log("player=",playerID," collided with ticket id="+ticketID);
            //halt if player is not part of a room
            if(Networking.ClientRoom == undefined) return;
            //send interaction request
            Networking.ClientRoom.send("ticket-interact", { playerID:playerID, ticketID:ticketID });
        };
 
        addLog("initialized!");
    }
    export function isPlayerInAreana(playerId:string) {
        
        //race condition so fall back to player pos
        let inAreana = VEHICLE_MANAGER.getPlayerVehicle(playerId) != undefined;

        //fall back to 
        const playerPos = Transform.getOrNull(engine.PlayerEntity)
        //hoping lower level of areana is higher than any point of the lobby
        if(playerPos && playerPos.position.y > 4){
            inAreana = true;
        }

        return inAreana
    }
    /** sets the current game state (called by server, so client has no right to refusal) */
    export function SetGameState(state:GameState.GAME_STATE_TYPES) {
        addLog("setting game state: old="+GameState.CurGameState.GetValue()+", new="+state);
        console.log('SetGameState',"setting game state: old="+GameState.CurGameState.GetValue()+", new="+state);
        //if game is avtively starting
        if(GameState.CurGameState.GetValue() == GameState.GAME_STATE_TYPES.LOBBY_COUNTDOWN && state == GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION) {
            UI_MANAGER.matchStarted.show();
            VEHICLE_MANAGER.onRoundStart(false);
        } 
        //if game is actively ending
        if(GameState.CurGameState.GetValue() == GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION && state == GameState.GAME_STATE_TYPES.LOBBY_IDLE) {
            //NOT THE RIGHT PLACE FOR THIS ANNOUNCMENT, NEED TO GET PLAYER SCORE somewhere
            const vehicle = VEHICLE_MANAGER.getPlayerVehicle(Networking.GetUserID())

            console.log('SetGameState',"setting game state: old="+GameState.CurGameState.GetValue()+", new="+state);

            if( !GameManager.isPlayerInAreana(Networking.GetUserID()) ){
                UI_MANAGER.matchFinished.show();
            }else if(vehicle){
                //determine players score and show display
                const rank = vehicle.rank
                switch(rank){
                    case 1:
                        UI_MANAGER.winner.show();
                        break;
                    case 2:
                        UI_MANAGER.sooClose.show();
                    default:
                        //TODO show looser somehow
                        UI_MANAGER.sooClose.show();
                        //UI_MANAGER.winner.show();
                }
            }else{
                console.log("GAMME OVER, NOT SURE WHAT TO SHOW?")
                UI_MANAGER.matchFinished.show();
            }
            
            VEHICLE_MANAGER.onRoundEnd();
        } 
 
        //set new game state
        GameState.CurGameState.SetValue(state);
        
        //process change 
        switch(GameState.CurGameState.GetValue()) {
            case GameState.GAME_STATE_TYPES.LOBBY_IDLE:
                //set music to idle
                AudioManager.PlayBackgroundMusic(AudioManager.BACKGROUND_MUSIC.SCENE_IDLE);
            break;
            case GameState.GAME_STATE_TYPES.LOBBY_COUNTDOWN:
                //UI_MANAGER.matchAboutToStart.show();
            break;
            case GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION:
                //set music to playing
                AudioManager.PlayBackgroundMusic(AudioManager.BACKGROUND_MUSIC.SCENE_PLAYING);
                //move player to stadium
                //movePlayerTo({ newRelativePosition: {x:32, y:10, z:28}, cameraTarget: {x:32, y:10, z:40} });
            break;
        }
    }

    //gamestate display
    //  create display for displaying gamestate
    /*const entityGameState:Entity = engine.addEntity();
    Transform.create(entityGameState, {position:{x:32,y:2.4,z:32}});
    TextShape.create(entityGameState, {text:"<GAME_STATE>",fontSize:4});
    Billboard.create(entityGameState);
    //  hook up callback to display game state changes
    GameState.CurGameState.RegisterCallback(
        function(state:GameState.GAME_STATE_TYPES) {
            TextShape.getMutable(entityGameState).text = GameState.GetGameStateString();
        }
    );

    //lobby start countdown
    //  create display for countdown
    const entityCountdown:Entity = engine.addEntity();
    Transform.create(entityCountdown, {position:{x:32,y:2.8,z:32}});
    TextShape.create(entityCountdown, {text:"<88>",fontSize:4});
    Billboard.create(entityCountdown);
    //  add demo log to lobby countdown value
    GameState.GameStartCountdown.RegisterCallback( 
        function(value:number) {
            //console.log("lobby countdown changed: "+value);
            if(value >= 0) TextShape.getMutable(entityCountdown).text = Math.floor(value+1).toString();
            else TextShape.getMutable(entityCountdown).text = "";
        }
    );*/

    //debugging controllers
    /** sends game start command to server */ 
    if(CONFIG.SHOW_DEBUG_3D_BUTTONS){
        const buttonGameStart = new DynamicButton_Simple(0, {x:32,y:1.5,z:32}, "FORCE: START");
        /** sends game end command to server */ 
        const buttonGameEnd = new DynamicButton_Simple(1, {x:32,y:9.5,z:32}, "FORCE: END");
    
    
        /** processes all buttons, executing interactions */
        function processInteractions() {
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, buttonGameStart.FrameEntity)) {
                if(Networking.ClientRoom == undefined) return;
                Networking.ClientRoom.send("game-start", {});
            }
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, buttonGameEnd.FrameEntity)) {
                if(Networking.ClientRoom == undefined) return;
                Networking.ClientRoom.send("game-end", {});
            } 
        }
        //add system to engine
        engine.addSystem(processInteractions);
        
    }
}