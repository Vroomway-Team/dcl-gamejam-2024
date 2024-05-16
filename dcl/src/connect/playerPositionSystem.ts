
import { connect, disconnect, showConnectingEnded, showConnectingStarted } from './connection'
//import { onConnect } from './onConnect'
import { Room } from 'colyseus.js'

import { log } from '../back-ports/backPorts'
import { getRealm } from '~system/Runtime'
import { IntervalUtil } from '../utilities/interval-util'
import { isNull } from '../utils'
import { GAME_STATE } from '../state'
import { CONFIG } from '../config'
import { REGISTRY } from '../registry'
import { Transform, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

import * as serverStateSpec from './state/server-state-spec'
import { RaceData } from './race'
import { cannonVehicle } from '../cannonWorld'

let currentRealm: string | null = null
let currentRoom: string | null = null

const CLASS_NAME = "PlayerTransformSystem"


/*const dataToSend: serverStateSpec.PlayerTransformState = {
  position: {x:0,y:0,z:0},
  serverTime: -1,
  rotation: { x:0,y:0,z:0,w:0 }
}*/


const racingData: serverStateSpec.PlayerRaceDataState = {
  carScenePosition: { x: 0, y: 0, z: 0 },
  closestProjectedPoint: { x: 0, y: 0, z: 0 },
  endTime: 0,
  closestPointID: 0,
  closestSegmentID: 0,
  closestSegmentPercent: 0,
  closestSegmentDistance: 0,
  currentSpeed: 0,
  shootDirection: { x: 0, y: 0, z: 0, w: 0 },
  cameraDirection: { x: 0, y: 0, z: 0, w: 0 },
  worldPosition: { x: 0, y: 0, z: 0 },
  carModelId: 'undefined',
  serverTime: -1,
  racePosition: -1,
  lap: -1,
  worldMoveDirection: { x: 0, y: 0, z: 0, w: 0 },
  lastKnownServerTime: -1,
  lastKnownClientTime: -1,
  force: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0,},
  mass: 0
};


// function updatePlayerRacingData() {
//   let playerWorldPosition = player.worldPosition; //Camera.instance.position//worldPos//worldPos.add(trackPath[0])

//   const now = Date.now();
//   const lastKnowPos = new Vector3(racingData.worldPosition.x, racingData.worldPosition.y, racingData.worldPosition.z);
//   const delta = now - racingData.lastKnownClientTime;

//   racingData.worldPosition.x = playerWorldPosition.x;
//   racingData.worldPosition.y = playerWorldPosition.y;
//   racingData.worldPosition.z = playerWorldPosition.z;

//   racingData.lastKnownServerTime = player.lastKnowServerTime;
//   racingData.lastKnownClientTime = now; //snaphot for when sent

//   //take last one minus current one
//   const dist = realDistance(lastKnowPos, playerWorldPosition);
//   player.currentSpeed = dist / delta;
//   racingData.currentSpeed = dist / delta;

//   //log("updatePlayerRacingData",racingData.currentSpeed,dist,delta,lastKnowPos.subtract(racingData.worldPosition) )

//   racingData.shootDirection = player.shootDirection; //Camera.instance.rotation//player.shootDirection//player.shootDirection
//   racingData.cameraDirection = player.cameraDirection;
//   racingData.worldMoveDirection = player.worldMoveDirection;
//   racingData.carModelId = player.carModelId; //
//   racingData.lap = player.lap; //NOT NEEDED

//   //log("sending",GAME_STATE.gameConnected,racingData)
//   //TODO only send during race??? && GAME_STATE.gameRoom.state.raceData.startTime > 0
//   if (
//     GAME_STATE.gameRoom &&
//     (GAME_STATE.gameRoom.name == CONFIG.GAME_DEMO_DERBY_ROOM_NAME ||
//       GAME_STATE.gameRoom.name == CONFIG.GAME_GRAND_PRIX_ROOM_NAME ||
//       GAME_STATE.gameRoom.name == CONFIG.GAME_GRAND_PRIX_LOBBY_ROOM_NAME ||
//       GAME_STATE.gameRoom.name == CONFIG.GAME_LOBBY_ROOM_NAME) &&
//     GAME_STATE.gameConnected == "connected"
//   ) {
//     GAME_STATE.gameRoom.send("player.racingData.update", racingData);
//   }
// }

//const checkParcleInterval = new IntervalUtil(1000)//check a little faster than connection check
export class PlayerPositionSystem  {
  checkInterval = new IntervalUtil(CONFIG.SEND_RACE_DATA_FREQ_MILLIS)
  connected: boolean = false
  isPreview: boolean = false
  
  async update(dt: number) {
    const METHOD_NAME = "update"

    const playerPos = Transform.getOrNull(engine.PlayerEntity)
    
    if(!this.checkInterval.update(dt)){
      return;
    }

    this.connected = GAME_STATE.gameConnected === "connected"
    
    if (playerPos !== null && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined) {
      const player = GAME_STATE.playerState

      racingData.worldPosition= playerPos.position
      racingData.cameraDirection= playerPos.rotation
      
      //sync to game state
      player.worldMoveDirection = cannonVehicle.cannonBody.quaternion
      player.force = cannonVehicle.cannonBody.force
      player.velocity = cannonVehicle.cannonBody.velocity
      player.mass = cannonVehicle.cannonBody.mass

      //send them to server
      racingData.worldMoveDirection = player.worldMoveDirection
      racingData.force = player.force
      racingData.velocity = player.velocity
      racingData.mass = player.mass
      racingData.currentSpeed = cannonVehicle.currentSpeed

      const now = Date.now();
      //const lastKnowPos = new Vector3(racingData.worldPosition.x, racingData.worldPosition.y, racingData.worldPosition.z);
      //const delta = now - racingData.lastKnownClientTime;

      racingData.lastKnownServerTime = player.lastKnowServerTime;
      racingData.lastKnownClientTime = now; //snaphot for when sent

      GAME_STATE.gameRoom.send("player.racingData.update", racingData);
      //GAME_STATE.gameRoom.send("player.transform.update",dataToSend)
    }
    
  }
  constructor() {
    
  }
}
 

//if(CONFIG.GAME_COIN_AUTO_START &&  myConnectSystem) engine.addSystem(myConnectSystem)

export function initSendPlayerInputToServerSystem(){
  const playerPosSys = new PlayerPositionSystem()

  engine.addSystem((dt:number)=>{ playerPosSys.update(dt) })
}

// // ground
// let floor = new Entity()
// floor.addComponent(new GLTFShape('models/FloorBaseGrass.glb'))
// floor.addComponent(
//   new Transform({
//     position: new Vector3(23*16/2, 0, 23*16/2),
//     scale: new Vector3(24, 0.1, 24),
//   })
// )
// engine.addEntity(floor)
