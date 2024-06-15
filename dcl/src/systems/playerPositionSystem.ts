import * as serverStateSpec from '../rooms/spec/server-state-spec'
import { IntervalUtil } from '../utilities/interval-util'
import { Transform, engine } from '@dcl/sdk/ecs'
import { Networking } from '../networking'
import { VEHICLE_MANAGER } from '../arena/setupVehicleManager'
import { GameState } from '../game-state'
import { NPCManager } from '../arena/npc-manager'

/*const dataToSend: serverStateSpec.PlayerTransformState = {
  position: {x:0,y:0,z:0},
  serverTime: -1,
  rotation: { x:0,y:0,z:0,w:0 }
}*/

/*const racingDataToSend: serverStateSpec.PlayerRaceDataState = {
  //player
  playerWorldPosition: { x: 0, y: 0, z: 0 },
  playerCameraDirection: { x: 0, y: 0, z: 0, w: 0 },
  //vehicle
  moveSpeed: 0,
  moveDirection: { x: 0, y: 0, z: 0, w: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  angularVelocity: { x: 0, y: 0, z: 0 },
  force: { x: 0, y: 0, z: 0 },
  mass: 0,
  shootDirection: { x: 0, y: 0, z: 0, w: 0 },
  //meta
  endTime: 0,
  serverTime: -1,
  lastKnownServerTime: -1,
  lastKnownClientTime: -1,
};*/


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
const SEND_RACE_DATA_FREQ_MILLIS = 1000/10
export class PlayerPositionSystem  {
  checkInterval = new IntervalUtil(SEND_RACE_DATA_FREQ_MILLIS)
  connected: boolean = false
  isPreview: boolean = false
  
  async update(dt: number) {
    //halt if past interval update
    if(!this.checkInterval.update(dt)) return;
    //halt if the player is not in a room
    if(Networking.ClientRoom == null || Networking.ClientRoom == undefined) return;
    //halt if game is not in session
    if(GameState.CurGameState.GetValue() != GameState.GAME_STATE_TYPES.PLAYING_IN_SESSION) return;

    //get player position
    const playerPos = Transform.getOrNull(engine.PlayerEntity)
    if(playerPos == null) return;
    
    //get player vehicle
    const vehicle = VEHICLE_MANAGER.getPlayerVehicle(Networking.GetUserID())
    if(!vehicle) return;
    
    //get current vehicle state
    const vehicleState = vehicle.getVehicleState();
    //pass vehicle state to server
    Networking.ClientRoom.send("player-vehicle-controller-record", {
      heading:vehicleState.heading,
      rank:vehicleState.rank,
      position:vehicleState.position,
      velocity:vehicleState.velocity,
      angularVelocity:vehicleState.angularVelocity,
    } as serverStateSpec.VehicleStateSyncData);

    //process all delegated npc vehicle states
    for(var i:number=0; i<NPCManager.NPC_DELEGATE_LIST.size(); i++) {
      const npc:NPCManager.NPCController = NPCManager.NPC_DELEGATE_LIST.getItem(i);
      //console.log("processing npc, id=",npcID);
      //get npc vehicle state
      const npcVehicleState = npc.Vehicle.getVehicleState();
      //pass vehicle state to server
      Networking.ClientRoom.send("npc-vehicle-controller-record", { 
        id:npc.ID,
        vehicleState:{
          heading:npcVehicleState.heading,
          rank:npcVehicleState.rank,
          position:npcVehicleState.position,
          velocity:npcVehicleState.velocity,
          angularVelocity:npcVehicleState.angularVelocity,
        } as serverStateSpec.VehicleStateSyncData
      });
    }
  }
}  

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
