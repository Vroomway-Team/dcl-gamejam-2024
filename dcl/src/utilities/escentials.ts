import { Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, PointerEventType, PointerEvents, TextShape, Transform, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";

/**     ESCENTIALS LIB
    set of useful constants, settings, and functions

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/


/** object representing a player's vehicle controller data */
export interface PlayerVehicleControllerData {
    /** target vehicle */
    vehicleID:number;
    /** world position */
    worldPosition?:Vector3;
    /** move speed */
    moveSpeed?:number;
    /** move direction */
    moveDirection?:Quaternion;
    /** move velocity */
    moveVelocity?:Vector3;
    /** move force */
    moveForce?:Vector3;
    /** mass */
    mass?:number;

    lastKnownClientTime?:number
    lastKnownServerTime?:number
}

//### COMMON VECTORS ###
//common transform positions
export const TRANSFORM_POSITION_ON:Vector3 = {x:0,y:0,z:0};
export const TRANSFORM_POSITION_OFF:Vector3 = {x:4,y:-4,z:4};
//common transform scales
export const TRANSFORM_SCALE_ON:Vector3 = {x:1,y:1,z:1};
export const TRANSFORM_SCALE_OFF:Vector3 = {x:0,y:0,z:0};
//common transform rotation
export const TRANSFORM_ROTATION_ORIGIN:Quaternion = Quaternion.fromEulerDegrees(0,0,0);

//### DATA CAPSULES (useful for p2p packeting) ###
/** value container for a bool (mainly for dict simplification) */
export class CapsuleBoolean { public value:boolean = true; }

//### INTERFACES ###
/** interface for a transform's core pieces */
export interface TransformDataObject {
    parent?:Entity;
    position?:Vector3;
    scale?:Vector3;
    rotation?:Quaternion;
}
/** interface for a transform's core pieces */
export interface TextShapeDataObject {
    text?:string;
    size?:number;
    color?:Color4;
}
/** callbacks for function */
export interface FunctionCallback { ():void }
/** callback for function taking in a number */
export interface FunctionCallbackIndex { (index:number):void }
/** callback for function taking in text */
export interface FunctionCallbackString { (str:string):void }

//### FUNCTIONS ###
/** sets the state of a given entity */
export function SetState(entity:Entity, state:boolean) {
    const transform = Transform.getMutable(entity);
    transform.position = state ? TRANSFORM_POSITION_ON : TRANSFORM_POSITION_OFF;
    transform.scale = state ? TRANSFORM_SCALE_ON : TRANSFORM_SCALE_OFF;
}

//### PACKAGED VARIABLE DELECATION ###
/** defines structure of function used to automate variable updates */
export interface DisplayVariableDelegateCallback<T> { (value:T): void; }
/** container used to automate variable updates */
export class DisplayVariableDelegate<T> {
    /** variable value */
    private value:T;
    /** return value */
    public GetValue():T {
        return this.value;
    }
    /** set value */
    public SetValue(value:T) {
        this.value = value;
        for (const callback of this.registeredCallbacks) { callback(this.value); }
    }

    /** all callbacks made when value changes */
    registeredCallbacks:DisplayVariableDelegateCallback<T>[] = [];
    /** registers a callback */
    public RegisterCallback(callback:DisplayVariableDelegateCallback<T>) {
        this.registeredCallbacks.push(callback);
    }
    /** calls all registered callbacks */
    public ProcessCallbacks() {
        for (const callback of this.registeredCallbacks) { callback(this.value); }
    }

    //initialization
    constructor(value:T) { this.value = value; }
}

//### VECTOR DIFFERENTIALS ###
/** returns the midpoint between 2 points */
export function GetMidpointBetweenPoints(point1:Vector3, point2:Vector3): Vector3 {
    return {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2,
        z: (point1.z + point2.z) / 2
    };
}
/** returns the distance between 2 points */
export function GetDistanceBetweenPoints(point1:Vector3, point2:Vector3):number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    const dz = point1.z - point2.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/** returns look rotation based on 2 points (creating a forward look from one to the other) */
export function GetRotationFromPoints(pointFrom:Vector3, pointTo:Vector3):Vector3 {
    const direction = {
        x: pointTo.x - pointFrom.x,
        y: pointTo.y - pointFrom.y,
        z: pointTo.z - pointFrom.z
    };

    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);

    // Normalize the direction vector
    direction.x /= length;
    direction.y /= length;
    direction.z /= length;

    // Calculate Euler angles (in radians)
    const pitch = Math.asin(-direction.y);
    let yaw = Math.atan2(direction.z, direction.x);

    // Convert to degrees (if needed)
    const rotation = {
        x: pitch * (180 / Math.PI),
        y: yaw * (180 / Math.PI),
        z: 0 // Assuming roll is not needed for this rotation
    };

    return rotation;
}

//### TEXTURES/IMAGES ###
/** draw points for plane vectors */
export function GetCardDrawVectors(totalX:number, totalY:number, elementX:number, elementY:number, posX:number, posY:number) {
    const stepSizeX = elementX/totalX;
    const stepSizeY = elementY/totalY;
    const drawX = stepSizeX*posX;
    const drawY = stepSizeY*posY;
    return [ 
        //plane front
        drawX, drawY, //left-bottom corner 
        drawX, drawY+stepSizeY, //left-top corner
        drawX+stepSizeX, drawY+stepSizeY, //right-top corner
        drawX+stepSizeX, drawY, //right-bottom corner
        //plane back (we dont care about this)
        0, 0, 0, 0, 0, 0, 0, 0,
    ];
}

//### COLLECTIONS ###
//pre-edit source: Dominik Marciniszyn, codetain.com
/**  */
export class List<T> {
    /** all items managed by collection */
    private items: Array<T>;
    
    //initialization
    constructor() { this.items = []; }

    /** returns the total number of all items */
    size():number { return this.items.length; }

    /** adds the given item to the list */
    addItem(value:T):void { this.items.push(value); }

    /** assigns the given item to the given position */
    assignItem(pos: number, instance: T) { this.items[pos] = instance; }

    /** returns the item at the given index */
    getItem(index:number):T { return this.items[index]; }

    /** returns positional index of the given element in the array,
     * if the element does exist returns '-1'
     */
    getItemPos(value: T): number {
        //process all items
        var i: number = 0;
        while (i < this.items.length) {
            //if item is found
            if (this.items[i] == value)  return i;
            //force next case
            i++;
        }
        return -1;
    }

    /** removes the given element from the list (if the element exists),
     *  maintaining the order of elements
     *  (uses push-forward/can-kicker technique, so doesn't matter if the item exists)
     */
    removeItem(value: T): void {
        //shift selected element to last spot in array
        var i: number = 0;
        var tmp: T;
        while (i < this.items.length) {
            //if end of list
            if (i == this.items.length - 1) {
                this.items.pop();
                return;
            }

            //if item is found
            if (this.items[i] == value) {
                //swap targeted element with next element in list
                tmp = this.items[i];
                this.items[i] = this.items[i + 1];
                this.items[i + 1] = tmp;
            }
            //force next case
            i++;
        }
    }
}
/**  */
export class Dictionary<T> {
    /** all items managed by collection, access via string */
    private items: { [index: string]: T } = {};
    /** total number of elements in the dictionary */
    private count: number = 0;

    size(): number {
        return this.count;
    }

    getKeys(): string[] {
        let keySet: string[] = [];

        for (let property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                keySet.push(property);
            }
        }

        return keySet;
    }

    containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    addItem(key: string, value: T): undefined {
        if (!this.items.hasOwnProperty(key)) {
            this.count++;
        }

        this.items[key] = value;
        return;
    }

    getItem(key: string): T {
        return this.items[key];
    }

    removeItem(key: string): T {
        let value = this.items[key];

        delete this.items[key];
        this.count--;

        return value;
    }

    values(): T[] {
        let values: T[] = [];

        for (let property in this.items) {
            if (this.items.hasOwnProperty(property)) {
                values.push(this.items[property]);
            }
        }

        return values;
    }
}

/** dummy object simulating interactions with a vehicle (claim/unclaim) */
export class DynamicButton_Simple {
    //button data
    public Index:number;
    public State:boolean = false;
    //entities
    public ParentEntity:Entity = engine.addEntity();
    public FrameEntity:Entity = engine.addEntity();
    public LabelText:Entity = engine.addEntity();
  
    //prepare initial object
    constructor(index:number, pos:Vector3, text?:string) {
      this.Index = index;
      //parent
      Transform.create(this.ParentEntity, {position:pos, scale:{x:0.4, y:0.4, z:0.4}});
      //frame
      Transform.create(this.FrameEntity, {parent:this.ParentEntity});
      MeshRenderer.setBox(this.FrameEntity);
      MeshCollider.setBox(this.FrameEntity);
      PointerEvents.createOrReplace(this.FrameEntity, {
          pointerEvents: [
            { //mouse click
              eventType: PointerEventType.PET_DOWN,
              eventInfo: { button: InputAction.IA_POINTER }
            },
          ]
      });
      //label
      Transform.create(this.LabelText, {parent:this.ParentEntity, position:{x:0,y:0,z:-0.6}});
      TextShape.create(this.LabelText, {text:text??""});
    }
  
    /** updates the current state of the vehicle */
    public SetState(state:boolean) {
      this.State = state;
      if(this.State) {
        Material.setPbrMaterial(this.FrameEntity, { albedoColor: Color4.Red() });
      } else {
        Material.setPbrMaterial(this.FrameEntity, { albedoColor: Color4.Green() });
      } 
    }
  }