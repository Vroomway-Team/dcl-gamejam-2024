import * as utils from '@dcl-sdk/utils'
import * as ui from 'dcl-ui-toolkit'
//import * as ui from '@dcl/ui-scene-utils';
import {  CONNECTION_EVENT_REGISTRY, connect, disconnect, reconnect, showConnectingEnded } from "./connect/connection";
import { updateLeaderboard } from './connect/leaderboard';
//import { ambienceSound, clickSound, fallSound, finishSound1, finishSound2, newLeaderSound, countdownRestartSound, playLoop, playOnce, playOnceRandom } from './sound';
import { log } from './back-ports/backPorts';
//import { AudioSource, Entity, MeshCollider, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs';
import { Color3, Color4, Vector3 } from '@dcl/sdk/math';
//import { addRepeatTrigger } from './utils4Game';
import { CONFIG } from './config';
import { COIN_MANAGER, RewardNotification, CoinType as CoinDataType, Coin } from './connect/coin';
import { GAME_STATE, GameState, PlayerState, resetAllGameStateGameCoin, resetAllGameStateGameCoinRewards } from './state';
import { isNull } from './utils';
import { Room } from 'colyseus.js';
import { refreshUserData } from './connect/login-flow';
//import { getCoinCap, getLevelFromXp } from './modules/leveling/levelingUtils';
import * as clientState from "./connect/state/client-state-spec";
import * as serverStateSpec from "./connect/state/server-state-spec";
import { REGISTRY } from './registry';

const announcement = ui.createComponent(ui.Announcement, {
    value: 'Text center',
    startHidden: true,
    duration: 5,
    color: Color4.Red(),
    size: 50,
    xOffset: 100,
    yOffset: -50,
  })

function displayAnnouncement(text:string,duration?:number,color?:Color4,size?:number){
    announcement.color = color || Color4.Red()
    announcement.size = size || 50
    announcement.value = text
    //announcement.duration = duration || 5

    announcement.show( duration || 5 )
}
export function initGamePlay(){    
    //PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID;
    startGame(); 
}

function getEnemySpawnCount(room: Room, player: clientState.PlayerState) {
  //2 will create enemy clones of actual player to see lag
  return 1//levelConnectUtil.getEnemySpawnCount(room, player);
}


function updatePlayerRacingData(raceData: clientState.PlayerRaceDataState) {
  GAME_STATE.playerState.raceEndTime = raceData.endTime;
  //calculate it from lap + segment+percent?  easier if server calculates it
  GAME_STATE.playerState.racePosition = raceData.racePosition ? raceData.racePosition : -1;

  //is this safe, it does take highest so yes?
  GAME_STATE.setGameTimeFromServerClock(raceData);

  //TODO - tag:GAMEJAM2024-TODO spawn the player!
  //SceneData.player.updateLatency(raceData.lastKnownClientTime, raceData.serverTime);

  if (GAME_STATE.playerState.raceEndTime) {
    //TODO - tag:GAMEJAM2024-TODO spawn the player!
    //GAME_STATE.playerState.markCompletedRace("server replied raceData.endTime " + raceData.endTime);
    //Game_2DUI.showRaceEnded
    //TODO - tag:GAMEJAM2024-TODO spawn the player!
    //Constants.SCENE_MGR.racingScene.playerFinishedRace();
  } else if (!GAME_STATE.raceData.started) {
    //find better spot for this, as is only called before race start
    //TODO - tag:GAMEJAM2024-TODO spawn the player!
    //updateRacerStartPos();
  }

  //for now do not sync lap with server
  //scene.player.lap = (raceData.lap) ? raceData.lap : -1
}
/*
executeTask(async () => {
    const message = 'msg: this is a top secret message'
    log(`signing MESSAGE: `, message)
    const messageSigned = await crypto.ethereum.signMessage(message)
    log(`signed MESSAGE: `, messageSigned)
  })
*/



// play ambient music
//playLoop(ambienceSound, 0.4);

//updateLeaderboard(["- Nobody -"]);

// getEntityByName("testCoinPlacementBlock").addComponent(
//     new OnPointerDown(
//         () => {
//             testCoinPlacement()
//         },
//         { hoverText: "Place Coins At Pianos" }
//     )
// )
/*
function testCoinPlacement(){
    coins.forEach((coin, key)=> {
        spawnCoin(`coin-${key}-placement`, coin[0], coin[1]-0.44, coin[2],5,(id)=>{ 
            log("touche test coin") 
        })
    })
}
*/

//TODO ADD ME BACK
function getFeatureDefById(id?:string):serverStateSpec.TrackFeatureInstDef|undefined{
  if(!id) return undefined

  // for(const p in COIN_GAME_FEATURE_DEF.minables){
  //   if(COIN_GAME_FEATURE_DEF.minables[p].id === id){
  //     return COIN_GAME_FEATURE_DEF.minables[p]
  //   }
  // }
  // for(const p in COIN_GAME_FEATURE_DEF.buyables){
  //   if(COIN_GAME_FEATURE_DEF.buyables[p].id === id){
  //     return COIN_GAME_FEATURE_DEF.buyables[p]
  //   }
  // }
  return undefined
}

// function handleRewardData(result:RewardNotification){
//     //TODO ADD ME BACK
//   //const result = (message as RewardNotification)
//     //GAME_STATE.notifyInGameMsg(message);
//     //displayAnnouncement("PLUG IN LEVEL UP:"+result.newLevel, 8, Color4.White(), 60);
//     if(result.rewards!==undefined){
//       let gc=0
//       let mc=0

//       let bp=0
//       let ni=0

//       let vb=0
//       let ac=0
//       let zc=0
//       let rc=0

//       let bz=0

//       let r1=0
//       let r2=0
//       let r3=0

//       let bronzeShoe=0

//       let statRaffleCoinBag=0
//       let ticketRaffleCoinBag=0
//       let redeemRaffleCoinBag=0
      
//       for(const p in result.rewards){
//         switch(result.rewards[p].id){
//           case CONFIG.GAME_COIN_TYPE_GC:
//             gc=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_MC:
//             mc=result.rewards[p].amount
//             break; 

//           case CONFIG.GAME_COIN_TYPE_VB:
//               vb=result.rewards[p].amount
//               break; 
//           case CONFIG.GAME_COIN_TYPE_AC:
//               ac=result.rewards[p].amount
//               break; 
//           case CONFIG.GAME_COIN_TYPE_ZC:
//               zc=result.rewards[p].amount
//               break; 
//           case CONFIG.GAME_COIN_TYPE_RC:
//               rc=result.rewards[p].amount
//               break; 

//           case CONFIG.GAME_COIN_TYPE_BP:
//             bp=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_BZ:
//             bz=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_NI:
//             ni=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_R1:
//             r1=result.rewards[p].amount
//             break;
//           case CONFIG.GAME_COIN_TYPE_R2:
//             r2=result.rewards[p].amount
//             break;
//           case CONFIG.GAME_COIN_TYPE_R3:
//             r3=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
//             bronzeShoe=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_STAT_RAFFLE_COIN_BAG_3_ID:
//             statRaffleCoinBag=result.rewards[p].amount
//             break; 
//           case CONFIG.GAME_COIN_TYPE_TICKET_RAFFLE_COIN_BAG_ID:
//             ticketRaffleCoinBag=result.rewards[p].amount
//             break;
//           case CONFIG.GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID:
//             redeemRaffleCoinBag=result.rewards[p].amount
//             break; 
//           default:
//             log("unhandled reward type",result.rewards[p].id,result.rewards[p])
//         }
//       } 
       
//       const addToWallet = 
//            result.rewardType !== 'mining-lack-of-funds'  
//         && result.rewardType !== 'buying-lack-of-funds' 
//         && result.rewardType !== 'mining-maxed-out' 
//         && result.rewardType !== 'buying-maxed-out' 
//         && result.rewardType !== 'mining-maxed-out-calls' 
//         && result.rewardType !== 'buying-maxed-out-calls' 
//         && result.rewardType !== 'mining-maxed-out-wheel' 
//         && result.rewardType !== 'buying-maxed-out-wheel' 
//         && result.rewardType !== 'mining-maxed-out-inventory'
//         && result.rewardType !== 'buying-maxed-out-inventory'

//       if(addToWallet){
//         GAME_STATE.setGameItemRewardBronzeShoeValue(GAME_STATE.gameItemRewardBronzeShoeValue + bronzeShoe)
//         GAME_STATE.setGameItemRewardStatRaffleCoinBag(GAME_STATE.statRewardRaffleCoinBag + statRaffleCoinBag)
//         GAME_STATE.setGameItemRewardTicketRaffleCoinBag(GAME_STATE.ticketRewardRaffleCoinBag + ticketRaffleCoinBag)
 
//         GAME_STATE.setGameCoinRewardGCValue(GAME_STATE.gameCoinRewardGCValue + gc)
//         GAME_STATE.setGameCoinRewardMCValue(GAME_STATE.gameCoinRewardMCValue + mc)

//         GAME_STATE.setGameCoinRewardVBValue(GAME_STATE.gameCoinRewardVBValue + vb)
//         GAME_STATE.setGameCoinRewardACValue(GAME_STATE.gameCoinRewardACValue + ac)
//         GAME_STATE.setGameCoinRewardZCValue(GAME_STATE.gameCoinRewardZCValue + zc)
//         GAME_STATE.setGameCoinRewardRCValue(GAME_STATE.gameCoinRewardRCValue + rc)
        
//         GAME_STATE.setGameCoinRewardBPValue(GAME_STATE.gameCoinRewardBPValue + bp)
//         GAME_STATE.setGameCoinRewardNIValue(GAME_STATE.gameCoinRewardNIValue + ni)
//         GAME_STATE.setGameCoinRewardBZValue(GAME_STATE.gameCoinRewardBZValue + bz)

//         GAME_STATE.setGameCoinRewardR1Value(GAME_STATE.gameCoinRewardR1Value + r1)
//         GAME_STATE.setGameCoinRewardR2Value(GAME_STATE.gameCoinRewardR2Value + r2)
//         GAME_STATE.setGameCoinRewardR3Value(GAME_STATE.gameCoinRewardR3Value + r3)

//         //forces a refresh of stanima bar
//         GAME_STATE.setGameCoinGCValue(  GAME_STATE.gameCoinGCValue )
//         GAME_STATE.setGameCoinMCValue(  GAME_STATE.gameCoinMCValue )

//         GAME_STATE.setGameCoinVBValue(  GAME_STATE.gameCoinVBValue )
//         GAME_STATE.setGameCoinACValue(  GAME_STATE.gameCoinACValue )
//         GAME_STATE.setGameCoinZCValue(  GAME_STATE.gameCoinZCValue )
//         GAME_STATE.setGameCoinRCValue(  GAME_STATE.gameCoinRCValue )
        
//         GAME_STATE.setGameCoinBPValue(  GAME_STATE.gameCoinBPValue )
//         GAME_STATE.setGameCoinNIValue(  GAME_STATE.gameCoinNIValue )
//         GAME_STATE.setGameCoinBZValue(  GAME_STATE.gameCoinBZValue )

//         GAME_STATE.setGameCoinR1Value(  GAME_STATE.gameCoinR1Value )
//         GAME_STATE.setGameCoinR2Value(  GAME_STATE.gameCoinR2Value )
//         GAME_STATE.setGameCoinR3Value(  GAME_STATE.gameCoinR3Value )

//         GAME_STATE.setGameItemStatRaffleCoinBag( GAME_STATE.statRaffleCoinBag )
//         GAME_STATE.setGameItemTicketRaffleCoinBag( GAME_STATE.ticketRaffleCoinBag )

//         REGISTRY.ui.inventoryPrompt.updateGrid()
//       }

//       switch(result.rewardType){
//         case 'level-up' :
//           REGISTRY.ui.levelUpPrompt.update(result)
//           REGISTRY.ui.levelUpPrompt.show()
//           break;
//         case 'buying-reward' :
//         case 'mining-reward' :
          
//           minableController.showUIReward( true, result )

//           //perform a delayed save to see it sooner
//           //utils.setTimeout( 500,)
//           utils.timers.setTimeout(() => {
//             if(GAME_STATE.gameRoom) GAME_STATE.gameRoom.send("save-game",{})
//           },500)
//           break;
//         case 'buying-maxed-out-inventory' :
//         case 'mining-maxed-out-inventory' :          
//           minableController.showUIMaxedOutInventory( true, result )
//           break;
//         case 'buying-maxed-out' :
//         case 'mining-maxed-out' : 
//         case 'buying-maxed-out-calls' :
//         case 'mining-maxed-out-calls' :          
//           minableController.showUIMaxedOut( true, result )
//           break;
//         //TODO let controller handle speicifc message?
//         case 'buying-maxed-out-wheel' :
//         case 'mining-maxed-out-wheel' :          
//             minableController.showUIMaxedOutWheel( true, result )
//             break;
//         case 'buying-lack-of-funds' :
//         case 'mining-lack-of-funds' :          
//           minableController.showUINotEnoughFunds( true, result )
//           break;
//         case 'buying-paid' : 
//         case 'mining-paid' :  
           
//           minableController.showUIPaidFunds( true, result )
//           break;
//       }
//     }
// } 
//TODO ADD ME BACK


function updateEnrollmentSlot(room: Room<clientState.RaceRoomState>, slot: clientState.EnrollmentSlot) {
  if (slot.playerId == room.sessionId) {
    //SceneData.player.enrollmentSlotNumber = slot.number;
  }
}
function updateEnrollment(enrollment: clientState.EnrollmentState) {
  log("updateEnrollment", enrollment, Math.round((enrollment.endTime - enrollment.serverTime) / 1000));

  //updateRacerStartPos();

  GAME_STATE.raceData.maxPlayers = enrollment.maxPlayers;

  //loop teams sum it up
  //let totPlayers = enrollment.
  let totMaxPlayers = enrollment.maxPlayers;
  let minTotalPlayer = enrollment.minPlayers;

  GAME_STATE.raceData.maxTotalTeamPlayers = totMaxPlayers;
  GAME_STATE.raceData.minTotalTeamPlayers = minTotalPlayer; //TODO enrollment.mi;

  if (enrollment.open) {
    //Game_2DUI.showRaceStartMsg(true);
    //Game_2DUI.updateRaceStartWaiting(Math.round((enrollment.endTime - enrollment.serverTime) / 1000));
  } else {
    //Game_2DUI.showRaceStartMsg(false);
  }
}

function addRemoveTrackFeature(trackFeat: clientState.ITrackFeatureState,type:|'add'|'remove') {
  const METHOD_NAME = "addRemoveTrackFeature" 
  log("addRemoveTrackFeature","ENTRY",trackFeat,type);
  
  //const featureDef = getFeatureDefById(trackFeat.featureDefId)
  // if(trackFeat) trackFeat._featureDef=featureDef

  // if(trackFeat.type.indexOf("minable")>-1 || trackFeat.type.indexOf("buyable")>-1){
  //     if(type=='add'){
  //       //const minable = minableController.createMinableFromState(trackFeat)
        
  //     }else{
  //       //remove
  //       //TODO remove from engine???
  //     }
  // }
}
function updateTrackFeature(trackFeat: clientState.ITrackFeatureState) {
  const METHOD_NAME = "updateTrackFeature"
  // if(trackFeat.type.indexOf("minable")>-1|| trackFeat.type.indexOf("buyable")>-1){
  //     const minable = minableController.getMinableById(trackFeat.id)
  //     if(minable !== undefined){
  //       //tile.health = 
        
  //       minable.updateFromServer(trackFeat)
  //       ////minable.updateHealth(0)
  //     }else{
  //       log(METHOD_NAME,"WARNING","could not find feature to update",trackFeat.type,trackFeat.id)
  //     }
  // }
}

export function startGame(gameType?: string) {
    log("startGame ENTRY", gameType);
  if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
    log("player not logged in yet");
    displayAnnouncement("Player not logged in yet");
    //TODO BRING BACK BUT SHOULD NOT BE NEEDED???
    REGISTRY.ui.openloginGamePrompt();
  } else {
    log("starting game");
    //TODO BRING BACK lets use default shape for now
    //setLobbyCameraTriggerShape();
    GAME_STATE.setScreenBlockLoading(true);
    colyseusConnect(gameType);
  }
}

export function endGame() {
  if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
    log("player not logged in yet");
    displayAnnouncement("Player not logged in yet");
  } else if (GAME_STATE.gameConnected !== "connected") {
    displayAnnouncement("Player not connected to game room");
  } else {
    log("ending game");
    log("LEAVING ROOM1!!!!!!!!!");
    log("LEAVING ROOM2!!!!!!!!!");
    log("LEAVING ROOM3!!!!!!!!!");

    log("endGame.sending quit-game!!!!!!!!");
    //TODO notify of exit, to cause nicer exit
    if(GAME_STATE.gameRoom) GAME_STATE.gameRoom.send("quit-game",{});
    //ADD TIMER IF takes longer than X do this anyways
    //popup a quitting screen.
    GAME_STATE.setGameConnected('disconnecting',"endGame")
    
    GAME_STATE.setGameHudActive(false);
    GAME_STATE.setGameStarted(false);
    
    //waiting 3.5 seconds is kind of long bit need time for stats to be collected
    utils.timers.setTimeout(()=>{
      log("endGame.timer.force.disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
      if(GAME_STATE.gameConnected === 'disconnecting' && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined){
        disconnect(true)
        GAME_STATE.setGameStarted(false);
        GAME_STATE.setGameHudActive(false);
      }else{
        log("endGame.timer.already disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
      }
    },CONFIG.GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME)
      
  }
}
//FIXME ME DO WE NEED CONNECTION_EVENT_REGISTRY
export const onJoinActions = (
        CONNECTION_EVENT_REGISTRY.onJoinActions = (
  room: Room,
  eventName: string
) => {
  log("onJoinActions entered", eventName);

  GAME_STATE.connectRetryCount=0//reset counter
  showConnectingEnded(true)
  
  GAME_STATE.setGameRoom(room);

  resetAllGameStateGameCoin()
  resetAllGameStateGameCoinRewards()

  let lastBlockTouched: string = "";
  function onTouchBlock(id: string) {
    //if( CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED || (!CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED && !GAME_STATE.isIdle) ){
      optimisticCollectCoin(id);

      room.send("touch-block", id);
    //}else{
    //  log("onTouchBlock","not collecting player is GAME_STATE.isIdle",GAME_STATE.isIdle,id,"CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED",CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED)
    //}
  }

  //will remove the coin ahead of actual server confirmed collection 
  function optimisticCollectCoin(id: string) {
    //TODO
    //move to 'coin vault' with timer to put back in 1 second should server not confirm collection
    //???

    //very optmistic,  if they cheat then they just dont get it
    const coin = COIN_MANAGER.getCoinById(id);

    //add sparkle

    //collect-sparkle.glb
    //TODO use sparkle object pool
    //coin.showSparkle
 
    coin.collect();
    //TODO up score? is it safe to do that then check server periodically?
  }    
    
  function collectCoin(id: string) {
    //remove from coinsSpawned
    //add to coinsPool

    //const id = block.id
    // send block index and player position to Colyseus server
    lastBlockTouched = id; //track collection for "combos"

    const coin = COIN_MANAGER.getCoinById(id); //FIXME need faster lookup
    log("onTouchBlock remove entity " + id + " " + coin);

    GAME_STATE.coinCollected(id);

    coin.collect();

    //if being "collected", no need to remove till animation is over
    //removeFromEngine(coin,3000)
  }

  function refreshLeaderboard() {
    // get all players names sorted by their ranking
    const allPlayers = Array.from(room.state.players.values())
      .sort((a: any, b: any) => {
        return b.score - a.score;
      })
      .map(
        (player: any, i: number) => `${i + 1}. ${player.name} - ${player.score}`
      );

    updateLeaderboard(allPlayers);
  }

  // The "floor" object was originally named "entity" from the Decentraland Builder.
  // I exported it from the "./scene" file to be able to attach custom behaviour.
  /*const floorcoinTriggerShape = new utils.TriggerCoinShape(new Vector3(16, 2, 16), new Vector3(0, 3, 0));
    floor.addComponent(
        new utils.TriggerComponent(floorcoinTriggerShape, {
            onCameraEnter: () => {
                if (lastBlockTouched > 2 && lastBlockTouched < 20) {
                    room.send("fall", Camera.instance.pss
            },
        })
    )*/

  //
  // -- Colyseus / Schema callbacks --
  // https://docs.colyseus.io/state/schema/
  //
  //let allCoins: Entity[] = []; using coinsSpawned
  let lastCoin: Coin;

  //TODO ADD BLOCKS AS COINS BACK
  // room.state.blocks.onAdd = (block: CoinDataType, key: string) => {
  //   log("room.state.blocks.onAdd " + block.id, block); 
  //   lastCoin = COIN_MANAGER.spawnCoin(
  //     {
  //       id: block.id,
  //       x: block.x,
  //       y: block.y,
  //       z: block.z,
  //       coinType: block.type,
  //       value: block.value,
  //     },
  //     onTouchBlock
  //   );
  //   //allCoins.push(lastCoin);
  // };
  // room.state.blocks.onRemove = (block: CoinDataType, key: string) => {
  //   log("room.state.blocks.onRemove", block, key);

  //   //removeFromEngine( getEntityByName(key) )
  //   collectCoin(key); //TODO who collected
  //   //lastCoin = spawnCoin(block.id,block.x, block.y, block.z, block.value );
  //   //allCoins.push(lastCoin);
  // };

  room.state.players.onAdd = (player: clientState.PlayerState, sessionId: string) => {
    log("room.state.players.onAdd", player);
    //const playerCallbacks:PlayerInst = (player as PlayerInst)

    //player.racingData.carScenePosition

    GAME_STATE.raceData.totalPlayers = room.state.players.size;

    //if full properties change
    player.onChange = (changes: any) => {
      //log("player.onChange",changes)
    };

    if (player.sessionId == room.sessionId) {
      GAME_STATE.playerState.serverState = player;
      GAME_STATE.playerState.sessionId = player.sessionId;
    }
    //not part of same if statement for lag testing, player gets an enemy version of themself
    if (player.sessionId != room.sessionId || CONFIG.DEBUGGING_LAG_TESTING_ENABLED) {
      const enemySpawnCount = getEnemySpawnCount(room, player);
      for (let i = 0; i < enemySpawnCount; i++) {
        const sessionId = i == 0 ? player.sessionId : player.sessionId + "-" + i;
        // let closestPointId = player.racingData.closestPointID;
        // if (closestPointId === undefined || closestPointId < 0) {
        //   closestPointId = 0;
        // }
        //player.userId,player.publicKey,

        const playerState: PlayerState= new PlayerState(); //TODO cache this? fly weight pattern?
        if (player.sessionId === room.sessionId) {
          playerState.name = i == 0 ? player.userData.name : player.userData.name + "-PREDICTION";
        } else {
          playerState.name = i == 0 ? player.userData.name : player.userData.name + "-PREDICTION";
        }

        playerState.userId = player.userData.userId;
        //playerState.carModelId = player.racingData.carModelId;
        playerState.racePosition = player.racingData.racePosition;

        //const playerRank = playerState.racePosition !== undefined ? playerState.racePosition : -1;

        //let addPosition = GAME_STATE.trackData.trackPath[closestPointId];
        //debugger
        /*if (!GAME_STATE.raceData.started) {
          if (playerRank >= 0) {
            addPosition =
              Constants.SCENE_MGR.racingScene.startPositionSceneEnts[playerRank].entity.getComponent(
                Transform
              ).position; //.subtract( SceneData.center )
            //SCENE_MGR.racingScene.moveRacerToStartPosition( playerRank )
            ENEMY_MGR.addEnemy(
              sessionId,
              "circuit",
              GAME_STATE.trackData.trackPath[closestPointId],
              Color3.Green(),
              playerState
            );
          }
        }*/
        //TODO - tag:GAMEJAM2024-TODO spawn the player!
        // ENEMY_MGR.addEnemy(
        //   sessionId,
        //   "circuit",
        //   //addPosition,
        //   Color3.Green(),
        //   playerState,
        //   false
        // );
      }
      player.listen("racingData", (raceData: clientState.PlayerRaceDataState) => {
        //scene.player.closestPointID
        if (player.sessionId == GAME_STATE.playerState.sessionId) {
          //scene.player.serverState = player
          updatePlayerRacingData(raceData);
        }
        if (player.sessionId != room.sessionId || CONFIG.DEBUGGING_LAG_TESTING_ENABLED) {
          const enemySpawnCount = getEnemySpawnCount(room, player);
          for (let i = 0; i < enemySpawnCount; i++) {
            const sessionId = i == 0 ? player.sessionId : player.sessionId + "-" + i;
            //not part of same if statement for lag testing, player gets an enemy version of themself
            
            //TODO - tag:GAMEJAM2024-TODO spawn the player!
            
            // if (ENEMY_MGR.getPlayerByID(sessionId)) {
            //   const enemy = ENEMY_MGR.getPlayerByID(sessionId);
            //   //raceData.
            //   if (enemy.state) {
            //     enemy.state.currentSpeed = raceData.currentSpeed;
  
            //     enemy.state.closestPointID = raceData.closestPointID;
            //     enemy.state.carModelId = raceData.carModelId;
            //     enemy.state.raceEndTime = raceData.endTime;
            //     if (raceData.endTime !== undefined) enemy.state.markCompletedRace("enemy.has.raceData.endTime");
            //     enemy.state.racePosition = raceData.racePosition;
            //     enemy.state.lap = raceData.lap;
  
            //     enemy.state.updateLatency(raceData.lastKnownClientTime, raceData.serverTime);
  
            //     if (raceData.worldMoveDirection) enemy.state.worldMoveDirection.copyFrom(raceData.worldMoveDirection); //using it for wheel rotation
            //     if (raceData.cameraDirection) enemy.state.cameraDirection.copyFrom(raceData.cameraDirection); //, will be direction next gas is hit?
            //     //shootDirection being stored in enemyData = targetWorldRot. copy it here too for shooting??
            //     if (raceData.shootDirection) enemy.state.shootDirection.copyFrom(raceData.shootDirection);
            //     //playerState.shootDirection = player.racingData.shootDirection
            //   }
            //   //calculateWorldPosFromClosestSegmentData(player,enemy)
            //   const posS = calculateWorldPosFromWorldPos(player, enemy, i);
  
            //   //const posS = calculateWorldPosFromClosestSegmentData(player,enemy)
  
            //   //log("vec",pos,posS)
  
            //   //enemy.getEnemyData().worldPos.copyFrom(posS)
  
            //   enemy.state.lastKnownWorldPosition.copyFrom(enemy.getEnemyData().targetWorldPos);
            //   enemy.getEnemyData().targetWorldPos.copyFrom(posS);
            //   //enemy.getEnemyData().targetWorldRot.copyFrom( raceData.shootDirection )
  
            //   //enemy.getEnemyData().worldPos.copyFrom(a)
            // } else {
            //   log("WARNING player.listen.racingData unable to find player ", sessionId, raceData);
            // }
          }
        }
        //updateLeaderboard(room);
      });
      player.userData.listen("name", (name: string) => {
        if (player.sessionId == GAME_STATE.playerState.sessionId) {
          //scene.player.serverState = player
        }
        //not part of same if statement for lag testing, player gets an enemy version of themself
        if (player.sessionId != room.sessionId || CONFIG.DEBUGGING_LAG_TESTING_ENABLED) {
          //TODO - tag:GAMEJAM2024-TODO spawn the player!
          // const enemy = ENEMY_MGR.getPlayerByID(player.sessionId);
          // enemy.setName(name);
        }
      });
    };
  
    // when a player leaves, remove it from the leaderboard.
    room.state.players.onRemove = (player: clientState.PlayerState, key: any) => {
      log("room.state.player.onRemove");
      //allPlayers = allPlayers.filter((player) => instance.id !== player.id);
  
      if (player.sessionId == GAME_STATE.playerState.sessionId) {
        GAME_STATE.playerState.serverState = undefined;
      }
      //not part of same if statement for lag testing, player gets an enemy version of themself
      if (player.sessionId != room.sessionId || CONFIG.DEBUGGING_LAG_TESTING_ENABLED) {
        const enemySpawnCount = getEnemySpawnCount(room, player);
        for (let i = 0; i < enemySpawnCount; i++) {
          const sessionId = i == 0 ? player.sessionId : player.sessionId + "-" + i;
          //TODO - tag:GAMEJAM2024-TODO spawn the player!
          //ENEMY_MGR.removePlayer(sessionId);
        }
      }
  
      GAME_STATE.raceData.totalPlayers = room.state.players.size;
  
      //updateLeaderboard(room);
    };
  }
  // let highestRanking = 0;
  // let highestPlayer: any = undefined;
  // room.state.players.onAdd = (player: any, sessionId: string) => {
  //   log("room.state.players.onAdd");
  //   player.listen("score", (newRanking: number) => {
  //     log("player.listen.score", newRanking);
  //     if (newRanking > highestRanking) {
  //       if (player !== highestPlayer) {
  //         highestPlayer = player;

  //         //playOnce(newLeaderSound);
  //       }
  //       highestRanking = newRanking;
  //     }

  //     refreshLeaderboard();
  //   });
  //   player.listen("coinGcCount", (num: number) => {
  //     log("player.listen.coinGcCount", num);
  //     //GAME_STATE.setGameCoinGCValue(num);
  //   });
 
    

  //   player.listen("coinsCollected", (num: number) => {
  //     log("player.listen.coinsCollected", num);
  //     //GAME_STATE.setGameCoinsCollectedValue(num);
  //   });
  // };
  
  // // when a player leaves, remove it from the leaderboard.
  // room.state.players.onRemove = () => {
  //   log("room.state.player.onRemove");
  //   refreshLeaderboard();
  // };

  room.state.listen("countdown", (num: number) => {
    //log("room.listen.countdown",num)
    //GAME_STATE.setCountDownTimerValue(num);
  });

  room.state.listen("totalCoins", (num: number) => {
    log("room.listen.totalCoins", num);
    //GAME_STATE.setGameCoinsTotalValue(num);
  });

  room.onMessage("start", () => {
    log("room.msg.start");
    // remove all previous coines
    //allCoins.forEach((coin) => engine.removeEntity(coin));
    //allCoins = [];

    GAME_STATE.setGameStarted(true);
    GAME_STATE.setScreenBlockLoading(false);
    GAME_STATE.setGameHudActive(true);

    lastBlockTouched = "";
    // highestRanking = 0;
    // highestPlayer = undefined;

    //GAME_STATE.setCountDownTimerActive(true)
  });

  room.onMessage("fall", (atPosition) => {
    log("room.msg.fall");
    //playOnce(fallSound, 1, new Vector3(atPosition.x, atPosition.y, atPosition.z));
  });

  
  room.onMessage("game-saved", () => {
    log("room.msg.game-saved");
    //clear reward value, need a way to clear it out when server saves too OR just read server rewardData and colyseus will sync it for us
  
    resetAllGameStateGameCoin()
    resetAllGameStateGameCoinRewards() 

    refreshUserData("game-saved")
    displayAnnouncement(`Save Complete`, 3, Color4.White(), 60);
    //refreshUserData("onMessage(finished")
  });
  room.onMessage("game-auto-saved-daily-reset", () => {
    log("room.msg.game-auto-saved-daily-reset");

    resetAllGameStateGameCoin()
    resetAllGameStateGameCoinRewards() 

    refreshUserData("game-auto-saved-daily-reset")
    displayAnnouncement(`Daily Reset Complete`, 3, Color4.White(), 60);
  })
  room.onMessage("game-auto-saved", () => {
    log("room.msg.game-auto-saved");
    //do we need to clear this?  should auto save send latest stats instead of client having to do it?
    //without refreshing playfab data, not sure we need to / want to clear this out?
    //clear reward value, need a way to clear it out when server saves too OR just read server rewardData and colyseus will sync it for us
    //GAME_STATE.setGameCoinRewardGCValue(0)//zero this out

    //should i refresh on an autosave?
    //refreshUserData("game-auto-saved")
    //displayAnnouncement(`Save Complete`, 3, Color4.White(), 60);
    //refreshUserData("onMessage(finished")
  });
  
  //TODO add back
  /*
  room.onMessage("finished", () => {
    log("room.msg.finished");
    //displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    if(GAME_STATE.gameRoomTarget !== 'racing'){
      displayAnnouncement(`Level Ended`, 8, Color4.White(), 60);
      playOnceRandom([finishSound1], 0.2);
    }
    GAME_STATE.setGameStarted(false);
    GAME_STATE.setGameHudActive(false);

    if(GAME_STATE.gameRoomTarget !== 'racing'){
      REGISTRY.ui.openEndGamePrompt();
    }

    log("LEAVING ROOM!!!!!!!!!");
    log("LEAVING ROOM!!!!!!!!!");
    log("LEAVING ROOM!!!!!!!!!");

    disconnect() 
    log("room.onMessage.finished","refreshUserData not called, letting disconnect do it")
    //refreshUserData("onMessage(finished")
  });
  */
  //get end game results instead of tracking as session data
  //good/bad instead of as session data?
  room.onMessage("endGameResultsMsg", (message) => {
    log("room.msg.endGameResultsMsg", message);
    if (message !== undefined) GAME_STATE.setGameEndResult(message);
    //displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

  room.onMessage("inGameMsg", (data) => {
    log("room.msg.inGameMsg", data);
    if (data !== undefined && data.msg === undefined) {
      GAME_STATE.notifyInGameMsg(data);
      displayAnnouncement(data, 8, Color4.White(), 60);
    }else{
      //if (message !== undefined && message.msg === undefined) {
        GAME_STATE.notifyInGameMsg(data.msg);
        displayAnnouncement(data.msg, data.duration !== undefined ? data.duration : 8, Color4.White(), 60);
      //}
    }

    //displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

  room.onMessage("notify.levelUp", (message) => {
    log("room.msg.notify.levelUp", message);
    if (message !== undefined) {
      const result = (message as RewardNotification)
      
      //handleRewardData(result)
    }
  })

  room.onMessage("notify.stay-in-sceneReward", (message) => {
    log("room.msg.notify.stay-in-sceneReward", message);
    if (message !== undefined) {
      const result = (message as RewardNotification)
      
      //handleRewardData(result)
    }
  })
    
  //miningLackOfFunds
  //miningReward
  //miningPaid
  //buyingLackOfFunds
  //buyingReward   
  //buyingPaid
  // for( const interactionType of ['mining','buying']){ 
  //   //log("creating room.onMessage for interactionType",interactionType)
  //     //TODO make buying message
  //     room.onMessage("notify."+interactionType+"LackOfFunds", (message) => {
  //       log("room.msg.notify."+interactionType+"LackOfFunds", message);
  //       if (message !== undefined) {
  //         const result = (message as RewardNotification)
          
  //         //handleRewardData(result)
  //       }
  //     })
  //     room.onMessage("notify."+interactionType+"MaxedOut", (message) => {
  //       log("room.msg.notify."+interactionType+"MaxedOut", message);
  //       if (message !== undefined) {
  //         const result = (message as RewardNotification)
          
  //         //handleRewardData(result)
  //       }
  //     })
      

  //     room.onMessage("notify."+interactionType+"MaxedOutInventory", (message) => {
  //       log("room.msg.notify."+interactionType+"MaxedOutInventory", message);
  //       if (message !== undefined) {
  //         const result = (message as RewardNotification)
          
  //         //handleRewardData(result)
  //       }
  //     })
    
  //     room.onMessage("notify."+interactionType+"Paid", (message) => {
  //       log("room.msg.notify."+interactionType+"Paid", message);
  //       if (message !== undefined) {
  //         const result = (message as RewardNotification)
          
  //         ///handleRewardData(result)
  //       }
  //     })

  //     room.onMessage("notify."+interactionType+"Reward", (message) => {
  //       log("room.msg.notify."+interactionType+"Reward", message);
  //       if (message !== undefined) {
  //         const result = (message as RewardNotification)
          
  //         //handleRewardData(result)
  //       }

  //     //displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
  //     //displayAnnouncement(message, 8, Color4.White(), 60);
  //     //GAME_STATE.setGameEndResultMsg()
  //   });
  // }

  room.onMessage("onLeave", (message) => {
    log("room.msg.onLeave", message);
    //debugger
    //if(message !== undefined) GAME_STATE.setGameEndResult(message)
    //displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

  room.onMessage("announce", (message) => {
    log("room.msg.announce");
    //displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    displayAnnouncement(message, 8, Color4.White(), 60);
  });

  room.onMessage("restart", () => {
    log("room.msg.restart");
    //playOnce(countdownRestartSound);
  }); 

  room.onLeave((code) => {
    log("room.on.leave");
    log("onLeave, code =>", code);
    //GAME_STATE.setGameConnected('disconnected')
    //debugger 
    refreshUserData("onLeave'");
  });
  
  
  
  room.state.listen("playFabTime", (playFabTime: number) => {
    //log("room.state.playFabTime.listen", playFabTime);
    GAME_STATE.playFabTime = playFabTime

    //const now = Date.now()
    //log("room.state.playFabTime.listen.diffs", (GAME_STATE.serverTime-GAME_STATE.playFabTime), (GAME_STATE.serverTime-now), (GAME_STATE.playFabTime-now));
    
  })
  room.state.listen("serverTime", (serverTime: number) => {
    //log("room.state.serverTime.listen", serverTime);
    GAME_STATE.serverTime = serverTime
  })

  //TODO ADD BACK
  
  room.state.listen("levelData", (levelData: clientState.LevelDataState) => {
    log("room.state.levelData.listen", levelData);
    ////updateLevelData(room.state.levelData); 
 
    //if (!levelData.trackFeatures.onAdd) {
      //for some reason null at the beginning
      levelData.trackFeatures.onAdd = (trackFeat: serverStateSpec.ITrackFeatureState, sessionId: string) => {
        log("room.state.levelData.trackFeatures.onAdd", trackFeat.name, trackFeat);
        
        const clientTrackFeat = (trackFeat as clientState.ITrackFeatureState)
        addRemoveTrackFeature(clientTrackFeat,'add') 
        clientTrackFeat.onChange = (changes: any) => {//(changes: DataChange<any>[]) => {
          log("room.state.levelData.trackFeatures.trackFeat.onChange", trackFeat.name, trackFeat);
          updateTrackFeature(clientTrackFeat)
        };
      };
      levelData.trackFeatures.onRemove = (trackFeat: serverStateSpec.ITrackFeatureState, sessionId: string) => {
        log("room.state.levelData.trackFeatures.onRemove", trackFeat.name,trackFeat.name, trackFeat);
        addRemoveTrackFeature(trackFeat as clientState.ITrackFeatureState,'remove')
      }
    //}
  });
  const registerSlotListner = (enrollment: clientState.EnrollmentState) => {
    if (!enrollment.slots.onAdd) {
      enrollment.slots.onAdd = (slot: serverStateSpec.EnrollmentSlot, sessionId: string) => {
        log("enrollment.slots.onAdd", slot);
        updateEnrollmentSlot(room, slot as clientState.EnrollmentSlot);
      };
      enrollment.slots.onChange = (changes:any) => {
        log("enrollment.slots.onChange", changes);
        //updateEnrollmentSlot(room, slot);
      };
    }
  };
  
  room.state.enrollment.onChange = (changes: any[]) => {
    log("room.state.enrollment.onChange", changes);

    updateEnrollment(room.state.enrollment);

    registerSlotListner(room.state.enrollment);
  };
  room.state.listen("enrollment", (enrollment: clientState.EnrollmentState) => {
    log("room.state.listen.enrollment", enrollment);

    updateEnrollment(enrollment);

    registerSlotListner(enrollment);
  });

  log("onJoinActions exit", eventName);
});

//START colyseusConnect//START colyseusConnect//START colyseusConnect
export const colyseusReConnect = () => {
  const oldRoom = GAME_STATE.gameRoom;
  if (oldRoom == undefined) {
    log("warning oldroom value undefined");
  } else {
    reconnect(oldRoom!.id, oldRoom!.sessionId, {})
      .then((room) => {
        log("ReConnected!");
        //GAME_STATE.setGameConnected('connected')

        onJoinActions(room, "reconnect");
      })
      .catch((err) => {
        GAME_STATE.setGameConnected("disconnected");
        log("ERROR","colyseusReConnect",err)
      });
  }
}; //end colyseusConnect

//START colyseusConnect//START colyseusConnect//START colyseusConnect
const colyseusConnect = (gameType?: string) => {
    log("colyseusConnect ENTRY", gameType); 
  const levels = CONFIG.GAME_ROOM_DATA;

  let levelToLoad = levels[Math.floor(Math.random() * levels.length)];

  if (gameType && gameType == "VB") {
    //if(GAME_STATE.inVox8Park){
    levelToLoad = {
      id: "vox_board_park",
      loadingHint: "Collect coins found in Vox Board Park",
    };
  }
  GAME_STATE.setGameRoomData(levelToLoad);
  log("colyseusConnect loading", levelToLoad.id);

  const roomName = levelToLoad.id; //"level_random_ground_float_few"// "level_random_ground_float_chase" //my_room,level_pad_surfer


  // const coinDataOptions:serverStateSpec.CoinRoomDataOptions = {
  //   levelId: roomName,//GAME_STATE.raceData.id,
  //   featuresDefinition: { minables:[],buyables:[] }
  //   /*,name:GAME_STATE.raceData.name
  //   ,maxLaps:GAME_STATE.raceData.maxLaps
  //   ,maxPlayers:GAME_STATE.raceData.maxPlayers*/}



    //FIXME
    //does not support nested objects so going to pass it twice for now
    //as the "flattened value. using dot notation so there is parity"
    
    const connectOptions = {
      clientVersion: CONFIG.CLIENT_VERSION//, 
      //coinDataOptions: coinDataOptions
    }
    

  connect(roomName, connectOptions)
    .then((room) => {
      log("Connected to ", roomName, "!");
      GAME_STATE.setGameConnected("connected");

      onJoinActions(room, "connect");
    })
    .catch((err) => {
        log("ERROR","colyseusConnect",err)
     // error(err);
    });
}; //end colyseusConnect
