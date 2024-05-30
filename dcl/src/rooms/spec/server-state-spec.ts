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
    angularVelocity: Vector3State
    force: Vector3State
    mass: number
    shootDirection: Quaternion3State; //car forward direction
    cameraDirection: Quaternion3State; //turn angle
    endTime: number; //move this as wont change till the end
    carModelId: number; //move this as wont change much if at all?
    
    racePosition: number;
    score: number
  
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

  /** represents a player in the lobby */
  export interface PlayerState {
    sessionID: string;
    playerID: string;
    playerName: string;
    score: number;
    vehicleID: number;

    connStatus: PlayerConnectionStatus;
  
    racingData: PlayerRaceDataState;
  }

  /** represents a vehicle in the game */
  export interface VehicleState {
    vehicleID: number;
    ownerID: string;
  }

  /** represents a ticket in the game */
  export interface TicketState {
    ticketID:number;
    PositionCurrent:Vector3State;
  }
  
  /** represents a game lobby room */
  export interface RacingRoomState {
    /** current game state of this room */
    GameState:number;

    /** countdown between players joining a lobby and the match starting */
    GameStartTimer:number;
    /** countdown from the game's start to end */
    GameRoundTimer:number;

    /** all player in the lobby (playing the game) */
    lobbyPlayersByID:Map<any, PlayerState>;
    /** all player in the lobby (playing the game) */
    lobbyVehicles:Map<any, VehicleState>;

    /** state of all active tickets in the game */
    gameTickets:Map<any, TicketState>;
  }