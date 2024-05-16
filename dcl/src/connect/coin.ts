import * as utils from '@dcl-sdk/utils'
import {
  //createTextShape,
  //getEntityByName,
  isNull,
  notNull,
  //removeFromEngine,
} from "../utils";

import PlayFab from "./playfab_sdk/PlayFabClientApi";

import { GAME_STATE } from "../state";
import { refreshUserData } from "./login-flow";
import { CONFIG } from "../config";
//import { NFTUIDataPriceType } from "../store/types";
import { TranformConstructorArgs, engineTweenStartScaling, log } from "../back-ports/backPorts";
import { Color3, Vector3 } from '@dcl/sdk/math';
import { AudioSource, ColliderLayer, Entity, GltfContainer, PBAudioSource, PBGltfContainer, Transform, engine } from '@dcl/sdk/ecs';
//import { cameraOnlyTrigger } from '../sdk7-utils/cameraOnlyTrigger';
//import { Transform } from '../back-ports/workarounds';

const collectCoinClip:PBAudioSource = {audioClipUrl:"sounds/collect-coin.mp3",loop:false,volume:0.4,playing:false};

export const collectCoinSparkle:PBGltfContainer = {src:"models/collect-sparkle.glb"}; // Includes the spinning animation
export const coinShape:PBGltfContainer = {src:"models/coin.glb"};
export const coinShapeVB:PBGltfContainer = {src:"models/VOXBUX.glb"}; // Includes the spinning animation
export const coinShapeMC:PBGltfContainer = {src:"models/coin-mc.glb"}; // Includes the spinning animation

const CLASSNAME = "coin.ts"

//update no colliders
const noColliderShapes:PBGltfContainer[] = [coinShape,coinShapeMC,coinShapeVB,collectCoinSparkle];
for(const p of noColliderShapes){
  p.invisibleMeshesCollisionMask = ColliderLayer.CL_NONE
  p.visibleMeshesCollisionMask = ColliderLayer.CL_NONE
}

//current size of y:1 and position 1.6 (center of head) seems to work well as
//default camera size is 2 meters.  it does not cause high coins on spiral to be collected by the feet
const coinTriggerShape_Size = Vector3.create(0.6, 0.6, 0.6)
const coinTriggerShape_Pos = Vector3.create(0, 0, 0)
/*const coinTriggerShape = new utils.TriggerBoxShape(
  new Vector3(0.6, 0.6, 0.6), // custom trigger shape
  new Vector3(0, 0, 0) // custom trigger shape
  //for default 2x2 trigger shape
  //new Vector3(.6, 1, .6), // size 1.8 is a little bigger than standing 1.6
  //new Vector3(0, 1.6, 0) // position place so walking the camera hits it and jumping camera hits its (feet on avatar)
);*/

//tracks spawned so end level remove them

const utilsTriggers = utils.triggers //

function _removeFromEngine(wrapper: {entity:Entity,name:string|undefined}, time:number) {
  console.log(CLASSNAME,"_removeFromEngine for ",wrapper,"ignoring right now since no way to just add back, need new way to add remove or dont")
  //engine.removeEntity(entity);
}

export type SpawnCoinArgType = {
  id: string;
  x: number;
  y: number;
  z: number;
  coinType: string;
  value: number;
};
//mirror what colysoius has
export type CoinType = {
  id: string;
  x: number;
  y: number;
  z: number;
  value: number;
  type: string;
  visible: boolean;
  collectedBy: string;
};


export type RewardData = {
  amount: number,
  //type: NFTUIDataPriceType
  id: string
};

export type RewardNotification={
  rewardType:string
  newLevel:number,
  rewards:RewardData[]
  sourceObjectId?:string //id it is linked to that gave out the reward
}

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
            log(CLASSNAME,"touche test coin") 
        })
    })
}
*/

function ensureAlive(entity: Entity) {
  //TODO
}
export class CoinManager {
  coinsSpawned: Record<string, Coin> = {};
  coinPool: Record<string, Coin> = {};
  //map:Map<string,Coin> = new Map<string,Coin>()
  maxCount: number;

  constructor(_coinCount: number) {
    this.maxCount = _coinCount;
    //this.ballSystem = new BallThrowSystem(this)
    //engine.addSystem(this.ballSystem)
  }

  _getEntityByName(id:string){
    console.log(CLASSNAME,"_getEntityByName for ",id)
    return this.coinPool[id]
  }
  getCoinById(id: string): Coin {
    let coin: Coin = this.coinPool[id];
    if (coin === undefined) {
      console.log(CLASSNAME,"getCoinById","WARNING","failed to find id in coinPool",id)
      //non optimized way
      //TODO store as map
      //should we ever get here????
      coin = this._getEntityByName(id) as Coin; //TODO optimize
    }
    return coin;
  }
  removeSpawnedCoins() {
    for (let p in this.coinsSpawned) {
      const coin = this.coinsSpawned[p];
      this.removeFromCoinsSpawned(coin);
      this.removeCoinFromScene(coin);
    }
  }
  removeFromCoinsSpawned(entity: Coin) {
    //log(CLASSNAME,"removeFromCoinsSpawned ENTRY")
    const name = entity.name;
    if (name !== null) {
      const key = name != null ? name : "id";
      delete this.coinsSpawned[key];
    }
  }
  removeCoinFromScene(entity: Coin) {
    //log(CLASSNAME,"removeFromScene ENTRY")
    //TODO do a  better remove, should we remove from engine?
    entity.hide()

    //entity.getComponent(Transform).position.y = entity.getComponent(Transform).position.y + 1
    //entity.getComponent(Transform).scale.y = .2
    //removeFrom

    // call this as side affect? removeFromCoinsSpawned(entity)

    //TODO what will remove from scene do?
    //if (entity.alive) engine.removeEntity(entity);
  }
  spawnCoin(
    spawnCoinArg: SpawnCoinArgType,
    onTouchBlock?: (id: string) => void
  ): Coin {
    const METHOD_NAME = "spawnCoin"; 
    let id = spawnCoinArg.id;
    let x = spawnCoinArg.x;
    let y = spawnCoinArg.y;
    let z = spawnCoinArg.z;
    let coinType = spawnCoinArg.coinType;
    let value = spawnCoinArg.value;

    //START TODO MOVE THIS INTO ITS OWN COIN CLASS
    // create the entity
    log(CLASSNAME,METHOD_NAME,"ENTRY",id,coinType,value,"x",x,"y",y,"z",z)

    const newCoin = isNull(this.coinPool[id]);

    //TODO pull from object pool?
    const coin = !newCoin ? this.coinPool[id] : new Coin(id);

    this.coinPool[id] = coin;
    this.coinsSpawned[id] = coin;

    // add a transform to the entity
    Transform.createOrReplace(coin.entity, {
      position: Vector3.create(x, y, z),
      scale: Vector3.create(0.6, 0.6, 0.6),
    })

    if (newCoin) {
      log(CLASSNAME,METHOD_NAME,id,"cache MISS for coin ", id);
      //log(CLASSNAME,"spawn making coin " + id)
      // add a shape to the entity
      //const coin = new CoinShape();
      //coin.withCollisions = false;
      //coin.addComponent(coin);
      //TODO make a coin class for encapsulation and reusablilty

      // set random color/material for the coin
      /*
            const coinMaterial = new Material()
            coinMaterial.albedoColor = Color3.Random();
            coinMaterial.metallic = Math.random();
            coinMaterial.roughness = Math.random();
            coin.addComponent(coinMaterial);*/

      //TODO MOVE TO CONSTANTS
      // trigger configurations (Took from https://github.com/decentraland-scenes/switchboard-platforms/)


      utilsTriggers.addTrigger(coin.entity, utils.NO_LAYERS, utils.LAYER_1, 
        [{type: "sphere",position: coinTriggerShape_Pos , radius: coinTriggerShape_Size.x}],
        ()=>{ 
          if (onTouchBlock !== null && onTouchBlock !== undefined)
              onTouchBlock(id);
        },
        ()=>{ 
        },
        Color3.Blue()
      )

      coin.setCollectable(true);
      coin.setCoinType(coinType);
      // Button triggers

      /*coin.addComponent(
        new utils.TriggerComponent(coinTriggerShape, {
          onCameraEnter: () => {
            if (onTouchBlock !== null && onTouchBlock !== undefined)
              onTouchBlock(id);
          },
          enableDebug: false,
        })
      );*/

      //const coinValue = new Entity(id+"-coin-value")
      //coinValue.setParent(coin)
      //coinValue.addComponent( createTextShape(String(value),Color3.Black(),'SF',3) )
      //coinValue.addComponent(new Transform({ position: new Vector3(0, .5, 0) }))
      //coinValue.addComponent(new Billboard())
      // scale block from 0 to 1

      coin.show();

      /*
            // play click sound
            const clickAudioSource = new AudioSource(clickSound);
            coin.addComponent(clickAudioSource);
            clickAudioSource.playOnce();*/
      //END TODO MOVE THIS INTO ITS OWN COIN CLASS
    } else {
      log(CLASSNAME,METHOD_NAME,id,"spawn cache HIT for coin ", id);

      coin.setCoinType(coinType);

      coin.setCollectable(true);

      coin.show();

      //update trigger
      utilsTriggers.setOnEnterCallback(coin.entity,  () => {
        onTouchBlock!(id);
      } )
      /*coin.getComponent(utils.TriggerComponent).onCameraEnter = () => {
        onTouchBlock!(id);
      };*/
    }

    // add the entity to the engine
    //if (!coin.alive) engine.addEntity(coin);
    ensureAlive(coin.entity)

    return coin;
  }
  preloadCoins(qty: number, transformArgs: TranformConstructorArgs) {
    log(CLASSNAME,"preloadCoins called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (let x = 0; x < qty; x++) {
      let coinType = CONFIG.GAME_COIN_TYPE_GC;
      let value = 1;
      if (Math.floor(Math.random() * 2) == 1) {
        coinType = CONFIG.GAME_COIN_TYPE_MC;
        value = 1;
      }
      const coin = this.spawnCoin(
        {
          id: "block-" + x + "",
          x: transformArgs.position!.x,
          y: transformArgs.position!.y,
          z: transformArgs.position!.z,
          coinType: coinType,
          value: value,
        },
        undefined
      );
      coin.hide(-1);
    }
  }

  loadCoins(coins: SpawnCoinArgType[]) {
    log(CLASSNAME,"preloadCoins called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (const p in coins) {
      const coinArg = coins[p];
      const coin = this.spawnCoin(coinArg, undefined);
      //coin.hide(-1)
    }
  }
}

export class SparkleManager {
  balls: Sparkle[];
  maxCount: number;

  constructor(_ballCount: number) {
    this.balls = [];
    this.maxCount = _ballCount;
  }

  spawnSparkle(transform: TranformConstructorArgs, visible: boolean): Sparkle {
    let retVal: Sparkle;

    if (this.balls.length < this.maxCount) {
      //TODO make sparkle manager
      let sparkle = new Sparkle("sparkle-" + this.balls.length);
      
      GltfContainer.create(sparkle.entity, collectCoinSparkle);
      Transform.createOrReplace(sparkle.entity, transform);
      sparkle.setVisible(visible);

      this.balls.push(sparkle);

      retVal = sparkle;
    } else {
      let instance = this.balls.shift();
      if (instance !== undefined) {
        Transform.createOrReplace(instance.entity, transform);
        instance.setVisible(visible);

        this.balls.push(instance); //push it to the end
        retVal = instance;
      } else {
        //should never enter here!!!
        //done to make compiler happy
        log(CLASSNAME,"spawnSparkle never enter here!!!");
        retVal = new Sparkle();
      }
    }

    //if (!retVal.alive) engine.addEntity(retVal);
    ensureAlive(retVal.entity)

    //log(CLASSNAME,"spawning sparkle: ", retVal);

    return retVal;
  }

  preloadSparkle(qty: number, transformArgs: TranformConstructorArgs) {
    log(CLASSNAME,"preloadSparkle called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (let x = 0; x < qty; x++) {
      
      const spark = this.spawnSparkle(transformArgs, true);
      spark.hide();
    }
  }
}

export const COIN_MANAGER: CoinManager = new CoinManager(400);
export const SPARKLE_MANAGER: SparkleManager = new SparkleManager(10);

export class Sparkle  {
  //sound: AudioSource;
  showScale: Vector3;
  visible: boolean = false;
  entity: Entity;
  name:string|undefined;
  delayId?: number

  constructor(name?: string) {
    this.name = name;
    this.entity = engine.addEntity()

    AudioSource.createOrReplace(this.entity, collectCoinClip)

    const scaleMult = 1; // + value/5
    this.showScale = Vector3.create(scaleMult, scaleMult, scaleMult);
  }

  setVisible(val: boolean) {
    if (val) {
      this.show();
    } else {
      this.hide();
    }
  }
  hide() {
    //log(CLASSNAME,this.name + ".hide called")
    this.visible = false;
    
    engineTweenStartScaling(
    //utils.tweens.startScaling(
      this.entity, this.showScale, Vector3.Zero(), 0.2 * 1000
      )
  }
  show(duration?: number) {
    log(CLASSNAME,this.name + ".show called");
    this.visible = true;
    
    engineTweenStartScaling(
    //utils.tweens.startScaling(
      this.entity, Vector3.Zero(), this.showScale, 0.2 * 1000
      )
     
    if(this.delayId) {
      utils.timers.clearTimeout(this.delayId)
      this.delayId = undefined
    }
    this.delayId = undefined//clear it

    const delayVal = duration !== undefined ? duration : -1;
    if (delayVal > 0) {
      this.delayId = utils.timers.setTimeout(() => {
        this.hide();
        _removeFromEngine(this, 0);
      }, delayVal);

      /*this.addComponentOrReplace(
        new utils.Delay(delayVal, () => {
          this.hide();
          removeFromEngine(this, 0);
        })
      );*/
    } else {
      _removeFromEngine(this, 0);
    }
  }
  playSound() {
    const audio = AudioSource.getMutableOrNull(this.entity)
    if(audio){
      audio.playing=true
    }else{
      log(CLASSNAME,"playSound",this.name,this.entity,"WARNING missing audio!!! ");
    }
  }
}

export class Coin  {
  coinType?: string;
  coinModelEntity: Entity;
  value?: number;
  showScale: Vector3;
  visible: boolean = false;
  collectable: boolean = false;
  entity: Entity;
  name:string|undefined;

  constructor(name?: string) {
    this.name = name;
    this.entity = engine.addEntity()

    Transform.create(this.entity, {scale:Vector3.One()});//,this.name)

    this.coinModelEntity = engine.addEntity()//new Entity(this.name + "-coin-model");
    //this.coinModelEntity.setParent(this);
    Transform.create(this.coinModelEntity, {
      position: Vector3.Zero(),
      parent: this.entity,
    });//,this.name+"-coinModelEntity");

    const scaleMult = 1; // + value/5
    this.showScale = Vector3.create(scaleMult, scaleMult, scaleMult);
  }
  show(speed?: number) {
    this.visible = true;
    if (speed == undefined || speed < 0) {
      //no
      Transform.getMutable(this.entity).scale = this.showScale;
    } else {
      engineTweenStartScaling(
      //utils.tweens.startScaling(
        this.entity, Vector3.Zero(), this.showScale, speed !== undefined ? speed * 1000 : 0.2 * 1000
        )
    }
  }
  hide(speed?: number) {
    this.visible = false;
    if (speed == undefined || speed < 0) {
      //now
      Transform.getMutable(this.entity).scale = Vector3.Zero();
    } else {
      //TODO consider visible true false
      engineTweenStartScaling(
        //utils.tweens.startScaling(
        this.entity, this.showScale, Vector3.Zero(), speed !== undefined ? speed * 1000 : 0.2 * 1000
        )
    }
  }

  setCollectable(val: boolean) {
    this.collectable = val;
    //TODO split this apart from triggerable but for now
    //make same, help with performance on checks
    utilsTriggers.enableTrigger(this.entity, val);
  }

  collect() {
    if (this.collectable == false) {
      log(CLASSNAME,"collect",this.name,this.entity,"already collected. returnined ", this.name);
      return;
    }
    this.setCollectable(false);

    //start where the coin was
    let sparklePos:Vector3.MutableVector3 = {...Transform.get(this.entity).position}//this.getComponent(Transform).position.clone();
    sparklePos.y -= 1;

    const sparkle = SPARKLE_MANAGER.spawnSparkle(
      {
        position: sparklePos,
        scale: Vector3.One(),
      },
      false
    );

    sparkle.show(1000);
    sparkle.playSound();

    //for now solo to reduce memory consumption
    //this.coinCollectModelEntity.setParent(this)

    //zero it out so can still play sound etc
    this.hide();
    _removeFromEngine(this, 0);
  }

  setCoinType(coinType: string) {
    this.coinType = coinType;

    let shape:PBGltfContainer
    if (coinType == CONFIG.GAME_COIN_TYPE_MC) {
      shape = coinShapeMC
    } else if (coinType == CONFIG.GAME_COIN_TYPE_VB) {
      shape = coinShapeVB
    } else {
      shape = coinShape;
    }
    GltfContainer.createOrReplace(this.coinModelEntity, shape);
  }
}
