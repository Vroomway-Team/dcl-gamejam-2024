import { Vector3 } from "@dcl/sdk/math";
import { GameState } from "./game-state";
import { AudioManager } from "../utilities/audio-manager";
import { TicketEntity } from "./ticket-entity";
import { TicketSpawnManager } from "./ticket-spawner";

/*      BUMPER CARS - GAME MANAGER
    acts as the main controller for the game of bumper cars: handling
    states 
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
    
    /** resets the game, pushing the player back into the lobby state */
    export function GameReset() {
        addLog("game resetting...");

        //set gamestate to lobby
        GameState.SetGameState(GameState.GAME_STATE_TYPES.LOBBY_IDLE);
        
        //halt ticket spawning
        TicketSpawnManager.SetSpawnState(false);
        //disable all tickets
        TicketEntity.DisableAll();

        //play background music
        AudioManager.PlayBackgroundMusic(AudioManager.BACKGROUND_MUSIC.SCENE_IDLE);
        
        addLog("game reset!");
    }

    /** starts the game, initializing all systems and setting the game stage to a neutral state */
    export function GameStart() {
        addLog("game starting...");

        //set gamestate to intermission 
        GameState.SetGameState(GameState.GAME_STATE_TYPES.PLAYING_COUNTDOWN);

        //start ticket spawning
        TicketSpawnManager.SetSpawnState(true);

        //play background music
        AudioManager.PlayBackgroundMusic(AudioManager.BACKGROUND_MUSIC.SCENE_IDLE);

        addLog("game started!");
    }

    /** ends the game, display game stats and removing enemies (keeps towers to view stats) */
    export function GameEnd() {
        addLog("game ending...");
        
        //halt ticket spawning
        TicketSpawnManager.SetSpawnState(false);
        //disable all tickets
        TicketEntity.DisableAll();
        
        addLog("game ended!");
    }
}