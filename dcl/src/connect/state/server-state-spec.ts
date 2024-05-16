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
  //move this to player race specific data???
  carScenePosition: Vector3State; //car location will scene center since it does not move
  closestProjectedPoint: Vector3State; //is scene relative, but when used with closestSegmentID + track data can compute where
  worldPosition: Vector3State;
  closestSegmentID: number;
  closestPointID: number;

  closestSegmentPercent: number; // relates to closestSegmentID.  what percent of this segement is player at
  closestSegmentDistance: number; //how far player is from center, aka the segement

  currentSpeed: number;
  worldMoveDirection: Quaternion3State; //world moving direction
  velocity: Vector3State
  force: Vector3State
  mass: number
  shootDirection: Quaternion3State; //car forward direction
  cameraDirection: Quaternion3State; //turn angle
  endTime: number; //move this as wont change till the end
  carModelId: string; //move this as wont change much if at all?
  lap: number; //move this as wont change till the end //currently base 1 index   first lap is lap:1
  //lapTimes //TODO ADD DEFINITION HERE!!!
  racePosition: number;

  lastKnownServerTime: number;
  lastKnownClientTime: number;

  //isDrifting: boolean
  //currentSpeed : number
}

export type EventStatus = "unknown" | "open" | "started" | "closed";
export type RaceStatus = "unknown" | "not-started" | "starting" | "started" | "ended";
export type PlayerConnectionStatus = "unknown" | "connected" | "reconnecting" | "disconnected" | "lost connection";

export type SceneId = 'vroomway' | 'grandprix' | 'all'

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

  connStatus: PlayerConnectionStatus;
  type: string;

  userData: PlayerUserDataState;
  racingData: PlayerRaceDataState;
  healthData: PlayerHealthDataState;
  buttons: PlayerButtonState;
  statsData: PlayerStatsDataState;
}

export interface PlayerUserDataState {
  name: string;
  userId: string;
  ///snapshotFace128:string snapshots deprecated use AvatarTexture
}

export interface RaceState extends ClockState {
  id: string;
  name: string;
  status: RaceStatus;
  startTime: number;
  endTime: number;
  maxLaps: number; //move to track data or is max laps race data?
}

//broadcast object instead of linking to state the level details
export interface LevelDataState {
  id: string;
  name: string;
  //status:RaceStatus

  //theme:Theme
  //FIXME cannot declare this
  trackFeatures: Map<any, ITrackFeatureState>; //Map<any,TrackFeatureConstructorArgs>
  localTrackFeatures?: TrackFeatureConstructorArgs[]; //for loading only, not for state sharing

  maxLaps: number; //move to track data or is max laps race data?
  trackPath: Vector3State[];
  //other track info?
}

export type TrackFeatureType = "boost" | "slow-down" | "slow-down-wall" | "inert" | "wall" | "coin-1" | "coin-2";

export type TrackFeatureDef = {
  numSegements?: number; //default 200
  keepStartClear?: number; //default 1
  featureDensity?: number; //default features.length + 5, how likly an item is spawned
  features: TrackFeatureInstDef[];
};

export type TrackFeatureZoneDef = {
  xOffsetRange?: number[]; //default +-2, max offset from center. random between 0-maxXOffset
  segmentRange?: number[][];
};
export type TrackFeatureInstDef = {
  type: TrackFeatureType;
  enabled?: boolean; //defaults true
  spawnAmount?: number; //default 2, when decided to spawn, will spawn between 1-spawnAmount (randomly picked)
  spawnPercentage?: number; //default .5. when decided to spawn (see featureDensity) it is the (0-1 probability to spawn it
  maxXCloseness?: number; //default .3 when spawning more than 1, how close together can they get
  zones?: TrackFeatureZoneDef[];
};

export function getTrackFeatureType(str: string) {
  return str as TrackFeatureType;
}

export interface TrackFeatureConstructorArgs {
  name: string;
  position: ITrackFeaturePosition;
  //triggerSize?:Vector3
  //shape:TrackFeatureShape
  type: TrackFeatureType;
  createdBy?: string; //player who created it is safe for X time?
  activateTime?: number;
  destructable?: boolean;
}
export interface TrackFeatureUpdate extends TrackFeatureConstructorArgs {}

//can we get rid of and replace with 'TrackFeatureConstructorArgs'?

export interface ITrackFeatureState {
  name: string;
  position: ITrackFeaturePosition;
  createdBy?: string; //player who created it is safe for X time?
  //triggerSize?:Vector3
  //shape:TrackFeatureShape
  type: string; //ONLY DIFF???
  activateTime?: number;
}

export interface TrackFeatureStateConstructorArgs extends ITrackFeatureState {}

export type TrackFeaturePositionConstructorArgs = {
  position?: Vector3State; //optional, if set its the exact spot
  rotation?: Quaternion3State; //optional, if set its the exact rotation
  startSegment: number;
  endSegment: number;
  offset?: Vector3State;
  centerOffset?: number; //positive is right, negative is left
};

export function createTrackFeaturePositionConstructorArgs(position: ITrackFeaturePosition) {
  return {
    startSegment: position.startSegment,
    endSegment: position.endSegment,
    offset: position.offset,
    centerOffset: position.centerOffset
  };
}

export interface ITrackFeaturePosition {
  position?: Vector3State; //optional, if set its the exact spot
  rotation?: Quaternion3State; //optional, if set its the exact rotation
  startSegment: number;
  endSegment: number;
  offset?: Vector3State;
  centerOffset?: number;
  //entity:Entity
}
export class TrackFeaturePosition implements ITrackFeaturePosition {
  position?: Vector3State; //optional, if set its the exact spot
  rotation?: Quaternion3State; //optional, if set its the exact rotation
  startSegment: number;
  endSegment: number;
  offset?: Vector3State;
  centerOffset?: number;
  //entity:Entity

  constructor(args: TrackFeaturePositionConstructorArgs) {
    this.startSegment = args.startSegment;
    this.endSegment = args.endSegment;
    this.centerOffset = args.centerOffset;
    this.position = args.position;
    if (args.offset) this.offset = args.offset;
  }
}

//EquippedVehicle should be copied/synced with vehicleOwnership.ts and server-state-spec
export type EquippedVehicle =
  | "diamondVroom"
  | "flamesEnd"
  | "tideBreaker"
  | "viridianQuake"
  | "wonderVroom"
  | "junkerVan"
  | "vroomWing"
  | "divinity"
  | "pleather"
  | "machina"
  | "peafowl"
  | "rattyVroom"
  | "vroomVroom"
  | "modelO"
  | "bronzeSaucer"
  | "silverSaucer"
  | "goldSaucer"
  | "bronzeSaucer2"
  | "silverSaucer2"
  | "goldSaucer2"
  | "speedBoots1"
  | "speedBoots2"
  | "speedBoots3"
  | "hoverBike1"
  | "hoverBike2"
  | "hoverBike3"
  | "hoverCar1"
  | "hoverCar2"
  | "hoverCar3"
  | "brutes1"
  | "brutes2"
  | "brutes3";

export type PriceType = "coins";
export type CostDataState = {
  amount: number;
  type: PriceType;
  id: string;
};
export type PowerUpClassificationType = "health" | "trap" | "projectile" | "multiplier";
export type PowerUpId =
  | "health.plus.50"
  | "health.invincible.time.15s"
  | "projectile.damage.plus.5.time.round"
  | "trap.projectile.time.round"
  | "trap.projectile.consumed.time.round"
  | "multiplier.coins.2x.time.round"
  | "multiplier.xp.2x.time.round";

export type PowerUpLevelModeType = {
  type: "normal" | "tournament";
  //more stuff like branch, level, difficulty...?
};
export type PowerUpLevelType = "circuit" | "derby" | "lobby" | "dragrace" | "solosprint" | "grandprix";

export type PowerUpsDefInst = {
  id: PowerUpId;
  classType: PowerUpClassificationType;
  name: string;
  desc: string;
  usageType: "consumable" | "durable"; //
  /**how fast can use it, -1 no speed limit */
  cooldown: number;
  /**effective time, -1 no time limit */
  duration: number;
  /** max usage per game/round/what ever, can drive allocation */
  usageMax: number;
  /** how many times can it be used per activate. -1 duration means have unlimited time to use X amount  */
  usePerActivate: number;
  /** if activates once aquired */
  autoActivate: boolean;
  /** how many can be applied at a time; <0 means infin; 1 = 1 at time etc. */
  stackableAmount: number;
  cost: CostDataState[];
  valueModifier: {
    numVal: number;
  };
  validFor?: {
    //determine what this is valid for, undefined == any
    mode?: PowerUpLevelModeType[];
    level?: PowerUpLevelType[];
  };
  //consumeAmount:number //how much to consuem
};
export interface PowerUpManagerState {
  powerUps: Map<string, PowerUpsItemPoolState>;
}
export class PowerUpsStatusUpdateResult {
  id!: PowerUpId;
  activated: PowerUpItemState[] = [];
  expired: PowerUpItemState[] = [];
}
//use this for state!
export interface PowerUpsItemPoolState extends ClockState {
  id: PowerUpId;
  items: PowerUpItemState[];
  //available: PowerUpItemState[];//allocated
  //activated: PowerUpItemState[];
  //expired: PowerUpItemState[];
  //client side must methods remove as does not exist. its just a DTO :(
  /*
  hasActivated():boolean
  use():PowerUpItemState
  getAvailableCnt():number
  getActiveCnt():number
  updateStatuses():PowerUpsStatusUpdateResult
  */
  //hasActivated: ()=>boolean
}

export interface PowerUpItemUseResult extends ClockState {
  success: boolean;
  newlyActivated: boolean;
  id: PowerUpId;
  msg: string;
  itm: PowerUpItemState;
}

export type PowerUpItemStateStatus = "not-init" | "available" | "activated" | "used";

//use this for state!
export interface PowerUpItemState extends ClockState {
  id: PowerUpId;
  //instId: string //instance id so can tell them apart
  status: PowerUpItemStateStatus;
  activateTime: number;
  expireTime: number;
  usesLeft: number;
}

export interface PowerUpsGameSettingsItm {
  id: PowerUpId;
  //instIds[]: string //distinct Id
  total: number; //total they have
  available: number; //available/allocated to this race; allocated <= total
  //active:number //how many applied; applied <= allocated
  //expired:number //how many used.  used <= applied
}

export interface PowerUpSelection {
  items: PowerUpsGameSettingsItm[];
}
export interface PlayerInGameSettings {
  equippedVehicle?: EquippedVehicle;
  //TODO convert to type once actually user server side
  //for now sending just incase we need it
  equippedAccessories?: string;
  powerUps?: PowerUpSelection;
  //vehicleType: string;
}

export interface RaceDataOptions {
  levelId: string;
  name?: string;
  maxLaps?: number;
  maxPlayers?: number;
  roadWidth?: number;
  ///numberOfTrackSegments?: number; //use featureDefinition.numSegements
  customRoomId?: string;
  featureDefinition?: TrackFeatureDef;
  secondsPerFloorDrop?: number; //TODO make derby specific one?
  mode?: { type: "normal" | "tournament" }; //matches LevelModeType type
  sceneId?:SceneId
}
export interface EnrollmentSlot {
  number: number;
  enrollTime: number;
  playerId?: string;
}
export interface EnrollmentState extends ClockState {
  open: boolean;
  eventStatus: EventStatus
  startTime: number;
  endTime: number;
  maxPlayers: number;
  minPlayers: number;

  //could we just do session hash? - pretty good no?
  //would be bettern than scanning for open slot from 0?
  //enroll slot, will be player join order unless you get join and unjoin
  //the point of this is to provide a stable player "placement" assuming rank is not important
  //for place when starting game
  //p1 join = 1
  //p2 join = 2
  //p1 leave, clear slot
  //p3 join = 2 //p2 slot remains 2 for stability
  slots: EnrollmentSlot[];
}

export interface RacingRoomState {
  players: Map<any, PlayerState>;
  raceData: RaceState;
  enrollment: EnrollmentState;
  levelData: LevelDataState;
}

export interface PlayerGiveDamageDataState {
  playerIdTo: string;
  playerIdFrom: string;
  damageTime: number;
  damageDesc: string;
  damageAmount: number;
}

//to collect server side a log of all damange given (maybe share it in stage but seems exessive)
//and you can build a list saving the changes that flow through PlayerHealthDataState
export interface PlayerDamageLogState extends ClockState {
  current: number;
  max: number;
  playerIdTo: string;
  playerIdFrom: string;
  damageTime: number;
  damageDesc: string;
  damageAmount: number;
}

export interface PlayerHealthDataState extends ClockState {
  current: number;
  max: number;
  invincible: boolean;
  //track what gave u last damange (was it LAVA!?)
  lastDamageTime: number;
  lastDamageDesc: string;
  lastDamageFrom: string;
  lastDamageAmount: number;
}

export interface PlayerStatsKillDataState {
  playerIdKilled: string;
  playerIdCredited: string;
  time: number;
  type: "direct" | "indirect";
}
export interface PlayerStatsDataState {
  kills: PlayerStatsKillDataState[];
  shotsFired: number; //how many times fired
  damageGiven: number; //how much damange given out
}

export interface ProjectileShotData {
  pos: Vector3State;
  dir: Vector3State;
  force: number;
  teamColor: string;
  id: string;
  type: "normal" | "yellow";
  playerIdFrom: string;
}
