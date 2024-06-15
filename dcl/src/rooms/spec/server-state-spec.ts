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
  /** player world position */
  playerWorldPosition:Vector3State;
  /** player look direction */
  playerCameraDirection:Quaternion3State; //turn angle
  
  /** vehicle's current move speed */
  moveSpeed:number;
  /** vehicle's current move direction */
  moveDirection:Quaternion3State;
  /** vehicle's current velocity */
  velocity:Vector3State
  /** move angular velocity */
  angularVelocity:Vector3State
  /** move force */
  force:Vector3State
  /** mass */
  mass:number;
  /** vehicle's forward */
  shootDirection:Quaternion3State;
  /** move this as wont change till the end */
  endTime:number;

  lastKnownServerTime:number;
  lastKnownClientTime:number;
}

/** interface for data in-transit, allows for info-gaps */
export interface PlayerRaceUpdateData {
  //player
  /** player world position */
  playerWorldPosition?:Vector3State;
  /** player look direction */
  playerCameraDirection?:Quaternion3State; //turn angle
  
  //vehicle
  /** vehicle's current move speed */
  moveSpeed?:number;
  /** vehicle's current move direction */
  moveDirection?:Quaternion3State;
  /** vehicle's forward */
  shootDirection?:Quaternion3State;
  /** vehicle's current velocity */
  velocity?:Vector3State
  /** move angular velocity */
  angularVelocity?:Vector3State
  /** move force */
  force?:Vector3State
  /** mass */
  mass?:number;
  
  //meta
  endTime?:number;
  lastKnownServerTime?:number;
  lastKnownClientTime?:number;
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

  racingData: VehicleStateSyncData;
}

/** represents a player in the lobby */
export interface PlayerPlayfabData {
  id: string;
  sessionTicket: string;
  titleId: string;
}

/** represents a vehicle in the game */
export interface VehicleState {
  vehicleID: number;
  ownerID: string;
}

/** sync data passed from client to server */
export interface VehicleStateSyncData {
  heading: number;
  rank: number;
  position: Vector3State;
  velocity: Vector3State;
  angularVelocity: Vector3State;
}

/** represents an pilot in the game */
export interface NPCControllerState {
  /** player calculating npc factors */
  ownerID: string;
  /** npc's player ID */
  npcID: string;
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