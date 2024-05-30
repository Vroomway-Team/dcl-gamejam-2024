import { DisplayVariableDelegate } from "./utilities/escentials";

/*      BUMPER CARS - GAME STATES
    contains all overhead states required for the bumper car game

*/
export module GameState {

    /** all possible game states */
    export enum GAME_STATE_TYPES {
        LOBBY_IDLE, //no players registered
        LOBBY_COUNTDOWN, //countdown before players are placed into the arena
        PLAYING_IN_SESSION, //game is in session
    }
    /** callback interface for function which takes a gamestate */
    export interface GameStateCallback { (state:GAME_STATE_TYPES):void }

    /** display strings for all game states */
    export const GAME_STATE_STRINGS:string[] = [
        "Idle",
        "Lobby Countdown",
        "Playing",
    ];
    export function GetGameStateString() { return GAME_STATE_STRINGS[CurGameState.GetValue()]; }
    
    /** current game state */
    export const CurGameState:DisplayVariableDelegate<GAME_STATE_TYPES> = new DisplayVariableDelegate<GAME_STATE_TYPES>(GAME_STATE_TYPES.LOBBY_IDLE);

    /** countdown till game start */
    export const GameStartCountdown:DisplayVariableDelegate<number> = new DisplayVariableDelegate<GAME_STATE_TYPES>(0);
    /** countdown till game ends */
    export const GameEndCountdown:DisplayVariableDelegate<number> = new DisplayVariableDelegate<GAME_STATE_TYPES>(0);
}