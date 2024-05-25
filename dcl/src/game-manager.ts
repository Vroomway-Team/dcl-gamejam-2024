import { InputAction, PointerEventType, TextShape, engine, inputSystem } from "@dcl/sdk/ecs";
import { Networking } from "./utilities/networking";
import { DynamicButton_Simple } from "./utilities/escentials";
import { TicketSpawnManager } from "./ticket-spawner";
import { TicketEntity } from "./ticket-entity";
import { LobbyPlayer } from "./lobby-player";


/*      BUMPER CARS - GAME MANAGER
    acts as the main controller for the game of bumper cars

    this is has been gutted to fit the server and needs to be redone >_>
*/
export module GameManager {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("GAME MANAGER: "+log); }
    
    /** initializes the game manager, setting the default entry state */
    export function Initialize() {
        addLog("initializing...");

        //reset the game lobby
        GameReset();

        addLog("initialized!");
    }

    /**  */ 
    export function SetGameState(state:number) {
        addLog("updating game state: "+state);

        if(state == 0) UpdateGameState(false);
        else UpdateGameState(true);
    }
    
    /** resets the game, pushing the player back into the lobby state */
    export function GameReset() { 
        addLog("game resetting...");
 
        //set gamestate to lobby
        //GameState.SetGameState(GameState.GAME_STATE_TYPES.LOBBY_IDLE);
        
        //halt ticket spawning
        //TicketSpawnManager.SetSpawnState(false);
        //disable all tickets
        //TicketEntity.DisableAll();

        //play background music
        //AudioManager.PlayBackgroundMusic(AudioManager.BACKGROUND_MUSIC.SCENE_IDLE);
        
        addLog("game reset!");
    }

    /** starts the game, initializing all systems and setting the game stage to a neutral state */
    export function GameStart() {
        addLog("game starting...");

        //set gamestate to intermission 
        //GameState.SetGameState(GameState.GAME_STATE_TYPES.PLAYING_COUNTDOWN);

        //start ticket spawning
        //TicketSpawnManager.SetSpawnState(true);

        //play background music
        //AudioManager.PlayBackgroundMusic(AudioManager.BACKGROUND_MUSIC.SCENE_IDLE);

        addLog("game started!");
    }

    /** ends the game, display game stats and removing enemies (keeps towers to view stats) */
    export function GameEnd() {
        addLog("game ending...");
        
        //halt ticket spawning
        //TicketSpawnManager.SetSpawnState(false);
        //disable all tickets
        //TicketEntity.DisableAll();
        
        addLog("game ended!");
    }

    //change game state
    /**  */
    const ActionButton = new DynamicButton_Simple(1, {x:8,y:2,z:12}, "");
    
    /** updates the view for the lobby */
    export function UpdateGameState(states:boolean) {
        console.log("updating game manager view: "+states);
        ActionButton.SetState(states);
        if(ActionButton.State) {
            TextShape.getMutable(ActionButton.LabelText).text = "Game State: In Session";
            //TicketSpawnManager.SetSpawnState(true);
        } else {
            TextShape.getMutable(ActionButton.LabelText).text = "Game State: Idle";
            //remove players
            //LobbyPlayer.DestroyAll();
            //clean up tickets
            TicketEntity.DisableAll();
        }
    }
  
    /** processes all buttons, executing interactions */
    export function processInteractions() {
        //mouse click
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, ActionButton.FrameEntity)) {
        //halt if player is not part of a room
        if(Networking.ServerRoom == undefined) return;
        //send request based on vehicle claim state
        if(ActionButton.State) Networking.ServerRoom.send("game-end", {});
        else Networking.ServerRoom.send("game-start", {});
        }
    }
    //add system to engine
    engine.addSystem(processInteractions);

    //initial vehicle update
    UpdateGameState(false);
}