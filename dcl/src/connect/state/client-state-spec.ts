import {
  ColyseusCallbacksArray,
  ColyseusCallbacksCollection,
  ColyseusCallbacksMap,
  ColyseusCallbacksReferences
} from "./client-colyseus-ext";
import * as serverStateSpec from "./server-state-spec";

export interface ClockState{
  serverTime:number
}



export type PlayerMapState = ColyseusCallbacksMap<any, serverStateSpec.PlayerState> &
  Map<any, serverStateSpec.PlayerState> & {};

export type PowerUpItemStateInst = ColyseusCallbacksReferences<serverStateSpec.PlayerState> &
  serverStateSpec.PlayerState & {};

export type PowerUpItemState = ColyseusCallbacksArray<any, serverStateSpec.PowerUpItemState> &
  Array<serverStateSpec.PowerUpItemState> & {};

export type PowerUpsItemPoolStateInst = ColyseusCallbacksReferences<serverStateSpec.PowerUpsItemPoolState> &
  serverStateSpec.PowerUpsItemPoolState & {
    items: PowerUpItemState;
  };

export type PowerUpsItemPoolState = ColyseusCallbacksMap<any, serverStateSpec.PowerUpsItemPoolState> &
  Map<any, PowerUpsItemPoolStateInst> & {}; /* & {
    items: PowerUpsItemPoolItemsState;
  };*/

export type PowerUpManagerState = ColyseusCallbacksReferences<serverStateSpec.PowerUpManagerState> &
  serverStateSpec.PowerUpManagerState & {
    powerUps: PowerUpsItemPoolState; //powerUps: Map<string, PowerUpsItemPoolState>;
  };

export type PlayerState = ColyseusCallbacksReferences<serverStateSpec.PlayerState> &
  serverStateSpec.PlayerState & {
    userData: PlayerUserDataState;
    racingData: PlayerRaceDataState;
    healthData: PlayerHealthDataState;
    buttons: PlayerButtonState;
    statsData: PlayerStatsDataState;
    powerUpMgr: PowerUpManagerState;
  };
export type PlayerRaceDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerRaceDataState> &
  serverStateSpec.PlayerRaceDataState & {};

export type PlayerHealthDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerHealthDataState> &
  serverStateSpec.PlayerHealthDataState & {};

export type PlayerStatsKillDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerStatsKillDataState> &
  serverStateSpec.PlayerStatsKillDataState & {};

export type PlayerStatsDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerStatsDataState> &
  serverStateSpec.PlayerStatsDataState & {
    kills: ColyseusCallbacksArray<any, serverStateSpec.PlayerStatsKillDataState> &
      Array<serverStateSpec.PlayerStatsKillDataState>;
  };

export type PlayerButtonState = ColyseusCallbacksReferences<serverStateSpec.PlayerButtonState> &
  serverStateSpec.PlayerButtonState & {};
export type RaceState = ColyseusCallbacksReferences<serverStateSpec.RaceState> & serverStateSpec.RaceState & {};

export type EnrollmentSlot = ColyseusCallbacksReferences<serverStateSpec.EnrollmentSlot> &
  serverStateSpec.EnrollmentSlot & {};

export type EnrollmentState = ColyseusCallbacksReferences<serverStateSpec.EnrollmentState> &
  serverStateSpec.EnrollmentState & {
    slots: ColyseusCallbacksArray<any, serverStateSpec.EnrollmentSlot> & Array<serverStateSpec.EnrollmentSlot>;
  };

export type PlayerUserDataState = ColyseusCallbacksReferences<serverStateSpec.PlayerUserDataState> &
  serverStateSpec.PlayerUserDataState & {};

  

export interface Vector3State{
  x:number
  y:number
  z:number
}
export interface Quaternion3State{
  x:number
  y:number
  z:number
  w:number
}


  
export type ITrackFeatureState = ColyseusCallbacksReferences<serverStateSpec.ITrackFeatureState> &
  serverStateSpec.ITrackFeatureState & {};

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

export interface PlayerTransformState extends ClockState{
  position:Vector3State//optional, if set its the exact spot
  rotation?:Quaternion3State//optional, if set its the exact rotation
}
