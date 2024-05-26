import { DisplayVariableDelegate } from "./utilities/escentials";

/*      BUMPER CARS - GAME STATES
    contains all overhead states required for the bumper car game

*/
export module GameState {

    /** all possible game states */
    export enum GAME_STATE_TYPES {
        LOBBY_IDLE, //no players registered
        LOBBY_COUNTDOWN, //countdown before players are placed into the arena
        PLAYING_COUNTDOWN, //countdown before players can move (this is a pause period while players move up to stadium)
        PLAYING_IN_SESSION, //game is in session
        GAME_OVER //game has ended
    }
    /** callback interface for function which takes a gamestate */
    export interface GameStateCallback { (state:GAME_STATE_TYPES):void }

    /** display strings for all game states */
    export const GAME_STATE_STRINGS:string[] = [
        "Idle",
        "Lobby Countdown",
        "Start Countdown",
        "Playing",
        "Game Over",
    ];
    export function GetGameStateString() { return GAME_STATE_STRINGS[CurGameState.GetValue()]; }
    
    /** current game state */
    export const CurGameState:DisplayVariableDelegate<GAME_STATE_TYPES> = new DisplayVariableDelegate<GAME_STATE_TYPES>(GAME_STATE_TYPES.LOBBY_IDLE);

    /** countdown till lobby start */
    export const LobbyStartCountdown:DisplayVariableDelegate<number> = new DisplayVariableDelegate<GAME_STATE_TYPES>(0);
}