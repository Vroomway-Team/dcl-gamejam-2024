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
    export function GetGameStateString() { return GAME_STATE_STRINGS[CurGameState]; }

    //### GAME STATE ###
    /** current game state */
    export var CurGameState:number;
}