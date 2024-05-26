export interface Vector3State {
    x: number;
    y: number;
    z: number;
  }
  export interface Quaternion3State {
    x: number;
    y: number;
    z: number;
    w: number;
  }
  
  export interface ClockState {
    serverTime: number;
  }
  export interface PlayerButtonState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    shoot: boolean;
  }
  
  export interface PlayerRaceDataState extends ClockState {
    worldPosition: Vector3State;
    
    currentSpeed: number;
    worldMoveDirection: Quaternion3State; //world moving direction
    velocity: Vector3State
    force: Vector3State
    mass: number
    shootDirection: Quaternion3State; //car forward direction
    cameraDirection: Quaternion3State; //turn angle
    endTime: number; //move this as wont change till the end
    carModelId: string; //move this as wont change much if at all?
    
    racePosition: number;
  
    lastKnownServerTime: number;
    lastKnownClientTime: number;
  
    //isDrifting: boolean
    //currentSpeed : number
  }
  
  
  // export type EventStatus = "unknown" | "open" | 'starting' | "started" | "closed";
  // export type RaceStatus = "unknown" | "not-started" | "starting" | "started" | "ended";
  export type PlayerConnectionStatus = "unknown" | "connected" | "reconnecting" | "disconnected" | "lost connection";
  
  export type SceneId = 'gamejam' | 'all'

  //for announce and maintence sending
  export interface SendMsgData {
    msg: string
    duration?: number
    color?:string
    fontSize?:number
    sceneId:SceneId
  }

  export interface PlayerState {
    id: string;
    sessionId: string;
    name: string
  
    connStatus: PlayerConnectionStatus;
    //type: string;
  
    //userData: PlayerUserDataState;
    racingData: PlayerRaceDataState;
    //healthData: PlayerHealthDataState;
    buttons: PlayerButtonState;
    //statsData: PlayerStatsDataState;
  }
  
  export interface PlayerUserDataState {
    name: string;
    userId: string;
    ///snapshotFace128:string snapshots deprecated use AvatarTexture
  }
  
  export interface RacingRoomState {
    players: Map<any, PlayerState>;
    //raceData: RaceState;
    //enrollment: EnrollmentState;
    //levelData: LevelDataState;
  }