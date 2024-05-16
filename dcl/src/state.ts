//import { Realm } from "@decentraland/EnvironmentAPI";
//import { UserData } from "@decentraland/Identity";
import { Room } from "colyseus.js";
import { CONFIG } from "./config";
import {
  GetPlayerCombinedInfoResultPayload,
  LoginResult,
  StatisticValue,
} from "./connect/playfab_sdk/playfab.types";
import { GameLevelData, GameLevelData as GameRoomData } from "./connect/resources";
//import { TESTDATA_USE_SIGNED_FETCH } from './config'


import { RaceData } from './connect/race'
//import { TrackData } from 'src/meta-decentrally/modules/trackPlacement'
import { GetPlayerCombinedInfoResultHelper } from "./connect/playfab-utils/playfabGetPlayerCombinedInfoResultHelper";
import { UserData } from "~system/Players";
import { PBRealmInfo } from "~system/Runtime";
import { ObservableComponentSubscription, log } from "./back-ports/backPorts";
import { onIdleStateChangedObservable } from "./back-ports/onIdleStateChangedObservable";
import { EnvironmentRealm } from "~system/EnvironmentApi";

import * as clientState from "./connect/state/client-state-spec";
import * as serverStateSpec from "./connect/state/server-state-spec";
import { Vector3Type } from "@dcl/sdk/ecs";


export class PlayerState {
  playerCustomID: string | null = null;
  playerDclId: string = "not-set"; //player DCL address
  playerPlayFabId: string = "not-set"; //player playfab address
  dclUserData: UserData | null = null;
  //let userData: UserData
  dclUserRealm: PBRealmInfo | null = null;
  playFabLoginResult: LoginResult | null = null;
  playFabUserInfo: GetPlayerCombinedInfoResultPayload | undefined | null;
  playFabUserInfoHelper: GetPlayerCombinedInfoResultHelper
  // nftDogeHelmetBalance: number = 0; //starts off 0, move to player
  // nftDogeBalance: number = 0;
  loginSuccess: boolean = false; // move to player

  loginFlowState: PlayerLoginState = "undefined";

  playerStateListeners: ObservableComponentSubscription[] = [];

  //latencyAvgMv: MovingAverage;
  latencyAvg: number = 0;
  latencyLast: number =0;
  lastKnowServerTime: number =0;
  lastKnownClientTime: number =0;

  lastKnownWorldPosition: Vector3Type = {x:0,y:0,z:0};
  worldPosition: Vector3Type = {x:0,y:0,z:0};

  sessionId: string = ""; //mere with id??
  name: string = "bobo";
  userId: string = "";

  raceEndTime: number = -1;
  completedRace: boolean = false; //currently using raceEndTime !== undefined
  racePosition: number = -1;
  enrollmentSlotNumber: number = -1; //enrollment slot, should be (1-minToPlay)

  serverState: serverStateSpec.PlayerState | undefined = undefined;

  constructor(){
    this.playFabUserInfoHelper = new GetPlayerCombinedInfoResultHelper();
  }
  requestDoLoginFlow() {
    this.notifyOnChange("requestDoLoginFlow", null, null);
  }
  setPlayerCustomID(val: string | null) {
    const oldVal = this.playerCustomID;
    this.playerCustomID = val;
    this.notifyOnChange("playerCustomID", val, oldVal);
  }
  setLoginFlowState(val: PlayerLoginState) {
    const oldVal = this.loginFlowState;
    this.loginFlowState = val;
    this.notifyOnChange("loginFlowState", val, oldVal);
  }
  setLoginSuccess(val: boolean) {
    const oldVal = this.loginSuccess;
    this.loginSuccess = val;
    this.notifyOnChange("loginSuccess", val, oldVal);
  }
  setPlayFabLoginResult(val: LoginResult | null) {
    const oldVal = this.playFabLoginResult;
    this.playFabLoginResult = val;
    this.notifyOnChange("playFabLoginResult", val, oldVal);
  }
  setNftDogeHelmetBalance(val: number) {
    // const oldVal = this.nftDogeHelmetBalance;
    // this.nftDogeHelmetBalance = val;
    // this.notifyOnChange("nftDogeHelmetBalance", val, oldVal);
  }
  setDclUserData(val: UserData) {
    const oldVal = this.dclUserData;
    this.dclUserData = val;
    this.playerDclId = val.userId; //sideaffect
    this.notifyOnChange("dclUserData", val, oldVal);
  }
  setDclUserRealm(val: PBRealmInfo) {
    const oldVal = this.dclUserRealm;
    this.dclUserRealm = val;
    this.notifyOnChange("dclUserRealm", val, oldVal);
  }

  setPlayFabUserInfoData(
    val: GetPlayerCombinedInfoResultPayload | undefined | null
  ) {
    const oldVal = this.playFabUserInfo;
    //TODO parse it out and detect what changed
    this.playFabUserInfo = val;
    this.playFabUserInfoHelper.update(val)
    this.notifyOnChange("playFabUserInfo", val, oldVal);
  }

  notifyOnChange(key: string, newVal: any, oldVal: any) {
    for (let p in this.playerStateListeners) {
      this.playerStateListeners[p](key, newVal, oldVal);
    }
  }
  addChangeListener(fn: ObservableComponentSubscription) {
    this.playerStateListeners.push(fn);
  }
}

class LeaderboardState {
  leaderBoardStateListeners: ObservableComponentSubscription[] = [];

  levelEpochLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  weeklyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  dailyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  hourlyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  monthlyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;

  levelEpochLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  weeklyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  dailyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  hourlyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  monthlyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  
  setHourlyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.hourlyLeaderboard;

    if (prefix && prefix !== "") {
      this.hourlyLeaderboardRecord[prefix] = val;
    } else {
      this.hourlyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "hourlyLeaderboard", val, oldVal);
  }


  setMonthlyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.hourlyLeaderboard;

    if (prefix && prefix !== "") {
      this.monthlyLeaderboardRecord[prefix] = val;
    } else {
      this.monthlyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "monthlyLeaderboard", val, oldVal);
  }
  
  setLevelEpocLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.levelEpochLeaderboard;
    if (prefix && prefix !== "") {
      this.levelEpochLeaderboardRecord[prefix] = val;
    } else {
      this.levelEpochLeaderboard = val;
    }
    this.notifyOnChange(prefix + "levelEpochLeaderboard", val, oldVal);
  }
  setWeeklyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.weeklyLeaderboard;
    if (prefix && prefix !== "") {
      this.weeklyLeaderboardRecord[prefix] = val;
    } else {
      this.weeklyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "weeklyLeaderboard", val, oldVal);
  }
  setDailyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.dailyLeaderboard;
    if (prefix && prefix !== "") {
      this.dailyLeaderboardRecord[prefix] = val;
    } else {
      this.dailyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "dailyLeaderboard", val, oldVal);
  }
  notifyOnChange(key: string, newVal: any, oldVal: any) {
    for (let p in this.leaderBoardStateListeners) {
      this.leaderBoardStateListeners[p](key, newVal, oldVal);
    }
  }
  addChangeListener(fn: ObservableComponentSubscription) {
    this.leaderBoardStateListeners.push(fn);
  }
}
//export type GameStateType='undefined'|'error'|'started'|'ended'
//export type GameConnectedStateType='undefined'|'disconnected'|'error'|'connected'
//export type PlayerLoginState='undefined'|'error'|'customid-success'|'customid-error'|'playfab-error'|'playfab-success'
//export type GamePlayStateType='undefined'|'started'|'ended'

//| "wallet-success" -> customid-success
//  | "wallet-error" -> customid-error

//export type GameStateType='undefined'|'error'|'started'|'ended'
export type GameConnectedStateType =
  | "undefined"
  | "disconnected"
  | "disconnecting"
  | "error"
  | "connecting"
  | "connected";
export type PlayerLoginState =
  | "undefined"
  | "error"
  | "wallet-success"
  | "wallet-error"
  | "playfab-error"
  | "playfab-success";
//export type GamePlayStateType='undefined'|'started'|'ended'
export interface RaffleInterface {
  cost: number;
  multiplier: number;
  amountWon: number;
  hasEnoughToPlay: boolean;
}
export type GameEndResultType = {
  gcStarted: number;
  gcEnded: number;
  gcTotal: number;
  gcCollected: number;
  gcBonusEarned: number;
  coinMultiplier: number;
  gcCollectedToMC: number;
  guestCoinCollected: number;
  guestCoinName: string;
  mcCollected: number;
  mcAdjustAmount: number;
  mcCollectedAdjusted: number;
  mcTotalEarnedToday: number;

  rock1Collected: number,
  rock2Collected: number,
  rock3Collected: number,
  petroCollected: number,
  nitroCollected: number,
  bronzeCollected: number,

  bronzeShoeCollected: number
  
  material1Collected: number;
  material2Collected: number;
  material3Collected: number;

  statRaffleCoinBag: number
  ticketRaffleCoinBag: number
  redeemRaffleCoinBag: number

  autoCloseEnabled: boolean;
  autoCloseTimeoutMS: number

  walletTotal: number;
  gameTimeTaken: number;
  raffleResult: RaffleInterface;
};


export class GameState {
  
  
  gameEnabled: boolean = false;
  gameStarted: boolean = false; // if game started
  gameConnected: GameConnectedStateType = "undefined"; // if game connected
  gameErrorMsg: string = "";
  gameStateListeners: ObservableComponentSubscription[] = [];

  raceData!: RaceData;
  //trackData: ITrackData;
  

  gameRoomTarget: string = CONFIG.GAME_LOBBY_ROOM_NAME//game room we want to be playing
  //https://docs.colyseus.io/colyseus/server/room/#table-of-websocket-close-codes
  gameConnectedCode: number = -1; //if game connected
  //gameConnectedMsg:string //if game connected

  //max auto connect retries, prevent error always visible, paired with GAME_CONNECT_RETRY_MAX=3
  connectRetryCount: number = 0;
  screenBlockLoading: boolean = false;

  playerState: PlayerState = new PlayerState();
  leaderboardState: LeaderboardState = new LeaderboardState();

  gameRoom!: Room | null;
  gameRoomInstId: number = new Date().getTime();
  gameRoomData!: GameLevelData;
  
  isIdle: boolean = false

  gameEndResult?: GameEndResultType;
  
  //work around to be able to save the results after left the room
  refreshGameResultOnOpen: boolean = true;

  gameTime: number = -1;

  serverTime?: number;
  playFabTime?: number;

  countDownTimerValue: number = 0;
  gameHudActive: boolean = false;


  setLoginSuccess(val: boolean) {
    this.playerState.setLoginSuccess(val);
  }
  getRaceServerStartTime() {
    //TAG:server-client-time-drift
    //TODO consider using startTimeOnServer instead but then need to solve local time and lap time
     //this.raceData.startTime is not what we want but fall back if need be
    return (this.raceData.startTimeOnServer  && this.raceData.startTimeOnServer > 0) ? this.raceData.startTimeOnServer : this.raceData.startTime
  }
  // (scene.ts) PlayerBase.updateLatency effectivly keeps player.lastKnowServerTime insync
  setGameTimeFromServerClock(serverClock: { serverTime: number }) {
    if (serverClock.serverTime < -1) {
      log("WARNING setGameTimeFromServerClock switching to local time");
      this.gameTime = -1; //set to dont use ,,maybe we have a reset option?
    } else if (serverClock.serverTime > this.gameTime) {
      //only take most forward time
      this.gameTime = serverClock.serverTime;
    }
    //maybe allow setting it if > 0 and > that current value?  OR we need a dedicated
    //game clock seperate from player.lastKnowServerTime
    //not assigning till know side affects of 2 methods setting this
    //player.lastKnowServerTime = serverClock.serverTime
  }
  //also check references for setGameTimeFromServerClock
  setGameTime(serverTime: number) {
    if (serverTime < -1) {
      log("WARNING setGameTime switching to local time");
      this.gameTime = -1; //set to dont use
    } else if (serverTime > this.gameTime) {
      //only take most forward time
      this.gameTime = serverTime;
    }
    //maybe allow setting it if > 0 and > that current value?  OR we need a dedicated
    //game clock seperate from player.lastKnowServerTime
    //not assigning till know side affects of 2 methods setting this
    //player.lastKnowServerTime = serverClock.serverTime
  }
  getGameTime() {
    //TODO use player.lastKnowServerTime ??? NEED to sync this and reset when logged out
    // if (
    //   Constants.SCENE_MGR.lastRaceType == "circuit" ||
    //   Constants.SCENE_MGR.lastRaceType == "dragrace" ||
    //   Constants.SCENE_MGR.lastRaceType == "derby"
    // ) {
      if (this.gameTime > 0) {
        return this.gameTime;
      } else {
        //debugger //bad!!??
        log("getGameTime()", "WARNING", "using local time");
        return Date.now();
      }
    // } else {
    //   return Date.now();
    // }
  }
  //store full game object results here, using flags above to track changing them
  //wrap this in an additional observer pattern
  //playerCombinedInfoResult:GetPlayerCombinedInfoResult
  // getRaceRoom(): Room<clientSpec.RaceRoomState> {
  //   if (
  //     this.gameRoom &&
  //     (this.gameRoom.name == CONFIG.GAME_RACE_ROOM_NAME ||
  //       this.gameRoom.name == CONFIG.GAME_LOBBY_ROOM_NAME)
  //   ) {
  //     return this.gameRoom as Room<clientSpec.RaceRoomState>;
  //   }
  //   return undefined;
  // }
  getGameRoom<T>() {
    return this.gameRoom;
  }

  setGameEndResult(val: GameEndResultType) {
    const oldVal = this.gameEndResult;
    this.gameEndResult = val;
    this.notifyOnChange("gameEndResult", val, oldVal);
  }

  setGameRoom(val: Room | null) {
    const oldVal = this.gameRoom;
    this.gameRoom = val;
    this.notifyOnChange("gameRoom", val, oldVal);
  }
  setGameRoomData(val: GameLevelData) {
    const oldVal = this.gameRoomData;
    this.gameRoomData = val;
    this.notifyOnChange("gameRoomData", val, oldVal);
  }

  setGameConnectedCode(val: number) {
    const oldVal = this.gameConnectedCode;
    this.gameConnectedCode = val;
    this.notifyOnChange("gameConnectedCode", val, oldVal);
  }

  setScreenBlockLoading(val: boolean) {
    const oldVal = this.screenBlockLoading;
    this.screenBlockLoading = val;
    this.notifyOnChange("screenBlockLoading", val, oldVal);
  } 

  setGameStarted(val: boolean) {
    const oldVal = this.gameStarted;
    this.gameStarted = val;
    this.notifyOnChange("gameStarted", val, oldVal);
  }

  setGameHudActive(val: boolean) {
    const oldVal = this.gameHudActive;
    this.gameHudActive = val;
    this.notifyOnChange("gameHudActive", val, oldVal);
  }
  
  setGameConnected(val: GameConnectedStateType, calledBy?: string) {
    log("setGameConnected", "ENTRY", "newVal", val, "old", this.gameConnected, "calledBy", calledBy);
    const oldVal = this.gameConnected;
    this.gameConnected = val;
    this.notifyOnChange("gameConnected", val, oldVal);
  }
  setGameErrorMsg(val: string) {
    const oldVal = this.gameErrorMsg;
    this.gameErrorMsg = val;
    this.notifyOnChange("gameErrorMsg", val, oldVal);
  }

  coinCollected(coinId: string) {
    this.notifyOnChange("coinCollected", coinId, null);
  }
  notifyInGameMsg(newVal: any) {
    this.notifyOnChange("inGameMsg", newVal, null);
  }
  notifyOnChange(key: string, newVal: any, oldVal: any) {
    for (let p in this.gameStateListeners) {
      this.gameStateListeners[p](key, newVal, oldVal);
    }
  }
  addChangeListener(fn: ObservableComponentSubscription) {
    this.gameStateListeners.push(fn);
  }
}

export let GAME_STATE: GameState;
export function initGameState() {
  log("initGameState called");
  if (GAME_STATE === undefined) {
    GAME_STATE = new GameState();

    GAME_STATE.raceData = new RaceData();

    // onIdleStateChangedObservable.add((isIdle: boolean) => {
    //   log("Idle State change: ", isIdle)
    //   GAME_STATE.isIdle = isIdle
    // })
  }
}

export function getTimeFormat(distance: number): string {
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let timeLeftFormatted =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);

  return timeLeftFormatted;
}


export function resetAllGameStateGameCoin(){
  

}
export function resetAllGameStateGameCoinRewards(){
  
  
}
