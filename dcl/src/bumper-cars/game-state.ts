import { DisplayVariableDelegate, DisplayVariableDelegateCallback } from "../utilities/escentials";

/*      BUMPER CARS - GAME STATES
    contains all overhead states required for the bumper car game

*/
export module GameState {

    /** all possible game states */
    export enum GAME_STATE_TYPES {
        LOBBY_IDLE, //no players registered
        LOBBY_COUNTDOWN, //countdown before players are placed into the arena
        PLAYING_COUNTDOWN, //countdown before players can move
        PLAYING_IN_SESSION, //game is in session
        GAME_OVER //game has ended
    }

    /** display strings for all game states */
    export const GAME_STATE_STRINGS:string[] = [
        "Idle",
        "Lobby Countdown",
        "Start Countdown",
        "Playing",
        "Game Over",
    ];
    export function GetGameStateString() { return GAME_STATE_STRINGS[CurGameState.GetValue()]; }

    //### GAME STATE ###
    /** current game state */
    var CurGameState:DisplayVariableDelegate<number> = new DisplayVariableDelegate<number>(0);
    /** returns the current game state */
    export function GetGameState():GAME_STATE_TYPES { return CurGameState.GetValue(); }
    /** sets the current game state */
    export function SetGameState(value:GAME_STATE_TYPES) { CurGameState.SetValue(value as number); }
    /** registers a given update callback */
    export function RegisterUpdateCallback_GameState(callback:DisplayVariableDelegateCallback<number>) {
        CurGameState.RegisterCallback(callback);
    }
}