import { Vector3 } from '@dcl/sdk/math';
import { isPreviewMode } from '~system/EnvironmentApi'
import { GameLevelData } from "./connect/resources";
import { notNull } from "./utils";
import { getRealm } from '~system/Runtime';
  
export const SCENE_TYPE_GAMIMALL = "gamimall"
export const SCENE_TYPE_UNIFIED_SCENE = "unified-scene"

type SceneType = 'gamimall'|'unified-scene'|'px'
let SCENE_TYPE:SceneType = SCENE_TYPE_GAMIMALL//SCENE_TYPE_UNIFIED_SCENE//SCENE_TYPE_GAMIMALL

export enum WearableEnum {

}

//MOVED TO GAME_STATE
//PLAYER_AVATAR_SWAP_ENABLED = false //starts off disabled, only changes when has wearable on
//PLAYER_NFT_DOGE_HELMET_BALANCE = 0;//starts off 0

//DEV
//METADOGE_ART_DOMAIN = 'https://dev.metadoge.art'
//PROD

const METADOGE_ART_DOMAIN = "https://www.metadoge.art";


export const DEFAULT_ENV = "dev" 

//version 2 means compute based on worn werables
//version 1 means compute on owned wearables
const CHECK_MULTIPLIE_URL_VERSION = 2


export const PLAYFAB_ENABLED = false
export const PLAYFAB_TITLE_ID: Record<string, string> = {
  //FIXME AA567 is grandprix, need new account for this
  local: "AA567",
  dev: "AA567",
  stg: "AA567",
  prd: "AA567",
};

export const COLYSEUS_ENDPOINT_URL: Record<string, string> = {
  local: "ws://127.0.0.1:2567",
  dev: "wss://vroomway.herokuapp.com",
  stg: "wss://STAGE-END-POINT-HERE",
  prd: "wss://PROD-END-POINT-HERE",
}

export const GAME_MINABLES_ENABLED_VALS: Record<string, boolean> = {
  local: true,
  dev: false,
  stg: true,
  prd: true 
};
export const GAME_BUYABLES_ENABLED_VALS: Record<string, boolean> = {
  local: true,
  dev: false,
  stg: true,
  prd: true
};
export const GAME_RACING_BP_NI_VC_ENABLED_VALS: Record<string, boolean> = {
  local: true,
  dev: true,
  stg: true,
  prd: true
};
   

const AUTH_URL: Record<string, string> = {
  local: "https://vroomway-auth-79f2ca20be45.herokuapp.com",//http://localhost:5001", //only used if PLAYFAB_ENABLED
  localColyseus: "TODO", //TODO get io
  dev: "https://vroomway-auth-79f2ca20be45.herokuapp.com", //TODO get io
  stg: "TODO",
  prd: "TODO"
};
 
export class Config {
  SCENE_TYPE:SceneType = SCENE_TYPE
  IN_PREVIEW = false; // can be used for more debugging of things, not meant to be enabled in prod
  AVATAR_SWAP_ENABLED = true; //kill switch for avatar swap completely
  AVATAR_SWAP_WEARBLE_DETECT_ENABLED = false; //if true will detect if user is wearing right stuff to swap, local can set to false so it just enables
  ENABLE_NPCS = true; //turn off for performance local dev
  CHECK_INTERVAL_CHECK_PLAYER_CHANGED = 10; //make large number for performance local dev
  
  ADMINS = [
    "WALLET-HERE", //
    "WALLET-HERE", //
    "WALLET-HERE", //
    ,
    "any", //if set to any will allow anyone to see
  ];
  TEST_CONTROLS_ENABLE = true;

  SHOW_CONNECTION_DEBUG_INFO = false;
  SHOW_PLAYER_DEBUG_INFO = false;
  SHOW_GAME_DEBUG_INFO = false; 
  DEBUG_ENABLE_TRIGGER_VISIBLE = true
  DEBUGGING_LAG_TESTING_ENABLED = false 
  // const ENDPOINT = "wss://hept-j.colyseus.dev";
  //d-awgl.us-east-vin.colyseus.net/  
  //new dev: wss://wnc9pc.colyseus.dev
  //new prod: wss://z34-ff.colyseus.dev
  COLYSEUS_ENDPOINT_LOCAL = "see #initForEnv"//"wss://bnvdlg.us-east-vin.colyseus.net"; //"ws://127.0.0.1:2567"; // local environment
  //COLYSEUS_ENDPOINT_NON_LOCAL = "wss://d-awgl.us-east-vin.colyseus.net"; // dev environment
  COLYSEUS_ENDPOINT_NON_LOCAL_HTTP = "see #initForEnv"
  COLYSEUS_ENDPOINT_NON_LOCAL = "see #initForEnv"; // prod environment
  //COLYSEUS_ENDPOINT = "wss://TODO"; // production environment
  
  //2 was minables
  //3 is buyables + changeProfile listeners
  //4 coin collect cap capable
  CLIENT_VERSION = 4; //version of client so server knows what features it can enabled
   
  LOGIN_ENDPOINT = "see #initForEnv"
  //AUTOCLAIM_ENDPOINT = METADOGE_ART_DOMAIN + "/api/dcl/claim/nft";
  //signedTypeV4 // dclSignedFetch
  AUTO_LOGIN_ENABLED = true
  LOGIN_FLOW_TYPE = "dclSignedFetch"

  PLAYFAB_ENABLED = true
  PLAYFAB_TITLEID = "see #initForEnv";

  //in milliseconds
  DELAY_LOAD_UI_BARS = -1;
  DELAY_LOAD_NPCS = 2000;

  UI_REPLACE_TEXTURE_WITH_SINGLETON = true;

  GAME_UI_LOADING_SCREEN_ENABLED = false//when coins being placed pops a loading modal
  GAME_UI_RACE_PANEL_ENABLED = false // top center gives stats of current coin collecting in lobby ui_background.ts RacePanel
  
  //max auto connect retries, prevent error always visible
  GAME_CONNECT_RETRY_MAX=3
  //after this time period restart the retry again
  GAME_CONNECT_RESTART_RETRY_INTERVAL=30*60*1000//30 min

  SEND_RACE_DATA_FREQ_MILLIS = 1000 / 10 // doing 13 times a second or 76ms (100 or less is considered acceptable for gaming). best i could get locally was ~60ms

  
  GAME_LEADEBOARD_BILLBOARD_MAX_RESULTS = 14; //current leaderboard max
  GAME_LEADEBOARD_2DUI_MAX_RESULTS = 14;
  //fetching 100 so 2dUI can show more

  GAME_LEADERBOARDS = {
    COINS:{
      MONTHLY:{
        name:"coinsCollectedMonthly",
        defaultPageSize:100
      }
    }
  };

  GAME_LEADEBOARD_MAX_RESULTS = 100//16;
  GAME_LEADEBOARD_LVL_MAX_RESULTS = 100;
  GAME_LEADEBOARD_RAFFLE_MAX_RESULTS = 20;
  GAME_ROOM_DATA: GameLevelData[] = [
    //see #initForEnv() below
  ];

  GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME = 5000//in milliseconds. how long to wait for other room disconnect to finalize
  GAME_LOBBY_ROOM_NAME="custom_lobby"
  GAME_RACE_ROOM_NAME="gamejam_2024"

  //if we fetch from playfab inventory
  GAME_PLAFAB_INVENTORY_ENABLED = true
  
  GAME_COIN_TYPE_GC = "GC";
  GAME_COIN_TYPE_MC = "MC";
  GAME_COIN_TYPE_VB = "VB";
  
  sizeX!:number
  sizeY!:number
  sizeZ!:number

  center!:Vector3
  centerGround!:Vector3
  size!:Vector3

  initForEnv(){
    const env = DEFAULT_ENV
    
    this.COLYSEUS_ENDPOINT_LOCAL = COLYSEUS_ENDPOINT_URL[env]
    this.COLYSEUS_ENDPOINT_NON_LOCAL = COLYSEUS_ENDPOINT_URL[env]; 
    this.COLYSEUS_ENDPOINT_NON_LOCAL_HTTP = COLYSEUS_ENDPOINT_URL[env].replace("wss://","https://").replace("ws://","http://")
    
    this.PLAYFAB_ENABLED = PLAYFAB_ENABLED
    this.PLAYFAB_TITLEID = PLAYFAB_TITLE_ID[env]
    this.LOGIN_ENDPOINT = AUTH_URL[env] + "/player/auth";

    switch(SCENE_TYPE){
      //case "px":
        //this.GAME_ROOM_DATA.push( { id: "unified_scene", loadingHint: "Collect coins. No time limit" } )
        //break;
      case "unified-scene":
        this.GAME_ROOM_DATA.push( { id: "unified_scene", loadingHint: "Collect coins. No time limit" } )
        break;
      default:
        //{ id: "level_pad_surfer", loadingHint: "Collect coins along the road" },
        //{ id: "level_pad_surfer_infin", loadingHint: "Collect coins along the road. No time limit" },
        //{ id: "px_random_spawn", loadingHint: "Collect coins. No time limit" },  
        /*
        {
          id: "level_random_ground_float",
          loadingHint: "Coins are scattered on the ground floor",
        },
        {
          id: "level_random_ground_float_few",
          loadingHint:
            "There are a limited number of coins scattered on the ground floor.  Can you find them?",
        },*/
        this.GAME_ROOM_DATA.push({ id: "gamejam_2024", loadingHint: "Collect coins along the road. No time limit" })
    }
    

    const ParcelCountX:number = this.SCENE_TYPE === SCENE_TYPE_GAMIMALL ? 4 : 1
    const ParcelCountZ:number = this.SCENE_TYPE === SCENE_TYPE_GAMIMALL ? 5 : 1

    
    this.sizeX = ParcelCountX*16
    this.sizeZ = ParcelCountZ*16 
    this.sizeY = (Math.log((ParcelCountX*ParcelCountZ) + 1) * Math.LOG2E) * 20// log2(n+1) x 20 //Math.log2( ParcelScale + 1 ) * 20
    this.size = Vector3.create(this.sizeX,this.sizeY,this.sizeZ)
    this.center = Vector3.create(this.sizeX/2,this.sizeY/2,this.sizeZ/2)
    this.centerGround = Vector3.create(this.sizeX/2,0,this.sizeZ/2)
  }

}
     
export let CONFIG: Config; // = new Config()//FIXME HACK DOUBLE INITTING

export async function initConfig() {
  if (CONFIG === undefined) {
    CONFIG = new Config();
    CONFIG.initForEnv()
    
    //set in preview mode from env, local == preview
    //isPreviewMode is deprecated
    //or is this the more correct way?
    await getRealm({}).then((val: any) => {
      setInPreview(val.realmInfo?.isPreview)
    })
  }
}

export function setInPreview(val: boolean) {
  console.log("setInPreview " + val);
  CONFIG.IN_PREVIEW = val;

  //var console: any

}
