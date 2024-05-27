import {
    ColyseusCallbacksArray,
    ColyseusCallbacksCollection,
    ColyseusCallbacksMap,
    ColyseusCallbacksReferences
} from "./client-colyseus-ext";
import * as serverStateSpec from "./server-state-spec";

export type Vector3State = ColyseusCallbacksReferences<serverStateSpec.Vector3State> &
    serverStateSpec.Vector3State & {};


type Vector3Type = serverStateSpec.Vector3State & {};
export class Vector3StateSupport implements serverStateSpec.Vector3State {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copyFrom(vec: Vector3Type) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }
}


export type PlayerMapState = ColyseusCallbacksMap<any, serverStateSpec.PlayerState> &
    Map<any, serverStateSpec.PlayerState> & {};

export type PlayerState = ColyseusCallbacksReferences<serverStateSpec.PlayerState> &
    serverStateSpec.PlayerState & {
        //userData: PlayerUserDataState;
        racingData: PlayerRaceDataState;
        //healthData: PlayerHealthDataState;
        buttons: PlayerButtonState;
    };

export type PlayerRaceDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerRaceDataState> &
    serverStateSpec.PlayerRaceDataState & {};


export type PlayerButtonState = ColyseusCallbacksReferences<serverStateSpec.PlayerButtonState> &
    serverStateSpec.PlayerButtonState & {};

/*


export type PlayerUserDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerUserDataState> &
    serverStateSpec.PlayerUserDataState & {};

export type PlayerHealthDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerHealthDataState> &
    serverStateSpec.PlayerHealthDataState & {};

export type PlayerStatsKillDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerStatsKillDataState> &
    serverStateSpec.PlayerStatsKillDataState & {};

export type PlayerStatsDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerStatsDataState> &
    serverStateSpec.PlayerStatsDataState & {
        kills: ColyseusCallbacksArray<any, serverStateSpec.PlayerStatsKillDataState> &
            Array<serverStateSpec.PlayerStatsKillDataState>;
    };

export type RaceState = ColyseusCallbacksReferences<serverStateSpec.RaceState> & serverStateSpec.RaceState & {};
export type EnrollmentState = ColyseusCallbacksReferences<serverStateSpec.EnrollmentState> &
    serverStateSpec.EnrollmentState & {};



export type LevelDataState = ColyseusCallbacksReferences<serverStateSpec.LevelDataState> &
    serverStateSpec.LevelDataState & {
        trackFeatures?: ColyseusCallbacksMap<any, serverStateSpec.ITrackFeatureState> &
            Map<any, serverStateSpec.ITrackFeatureState>;
    };

export type RaceRoomState = ColyseusCallbacksReferences<serverStateSpec.RacingRoomState> &
    serverStateSpec.RacingRoomState & {
        players: PlayerMapState;
        raceData: RaceState;
        enrollment: EnrollmentState;
        levelData: LevelDataState;
    };

*/