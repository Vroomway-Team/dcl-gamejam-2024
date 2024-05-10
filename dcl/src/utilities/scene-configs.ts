/**     SCENE CONFIG 
    defines layouts for multiple scenes

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/

import { Vector3 } from "@dcl/sdk/math";

/** define all scenes in the game */
export enum GAME_SCENE_ID {
    SCENE_0 = 0,
    SCENE_1 = 1
}
/** display names per  */
export const GAME_SCENE_NAME = [
    "SCENE_NAME_0",
    "SCENE_NAME_1"
];

/** defines min distance for details to be rendered in at (ex: an object with 'medium' distance will display at medium & near distance, but not be visible from far) */
export enum GAME_SCENE_VISIBILITY_ID {
    NONE = -1,  //<- use this to disable scene objects
    FAR = 0, //large details (building shell)
    MEDIUM = 1, //medium details (frames/vehicles)
    NEAR = 2 //smallest details (tools/loose clutter)
}
/** display names per  */
export const GAME_SCENE_VISIBILITY_NAME = [
    "FAR",
    "MEDIUM",
    "NEAR"
];

/** data interface for defining an object within a game scene */
export interface GameSceneObjectDataInterface {
    //display details
    model?:string; //custom 3d model
    visibility:GAME_SCENE_VISIBILITY_ID;
    //transform
    position:Vector3; //default position
    scale?:Vector3; //default scale
    rotation?:Vector3; //default rotation
}

/** data interface for defining a game scene (used for initialization, can also be used as metadata) */
export interface GameSceneDataInterface {
    //indexing
    id:GAME_SCENE_ID,
    //all objects to be created at the start
    objects:GameSceneObjectDataInterface[]
}

/** def data representing all scenes in the game */
export const SceneData:GameSceneDataInterface[] =
[
    //# SCENE 0
    {
        id:GAME_SCENE_ID.SCENE_0,
        objects:[
            {
                model:"",
                visibility:GAME_SCENE_VISIBILITY_ID.NEAR,
                position:{x:4,y:1,z:4}
            },
            {
                model:"",
                visibility:GAME_SCENE_VISIBILITY_ID.MEDIUM,
                position:{x:4,y:1,z:4}
            },
            {
                model:"",
                visibility:GAME_SCENE_VISIBILITY_ID.FAR,
                position:{x:4,y:1,z:4}
            }
        ]
    },
    //#  SCENE 1
    {
        id:GAME_SCENE_ID.SCENE_1,
        objects:[
            {
                model:"",
                visibility:GAME_SCENE_VISIBILITY_ID.NEAR,
                position:{x:4,y:1,z:4}
            },
            {
                model:"",
                visibility:GAME_SCENE_VISIBILITY_ID.MEDIUM,
                position:{x:4,y:1,z:4}
            },
            {
                model:"",
                visibility:GAME_SCENE_VISIBILITY_ID.FAR,
                position:{x:4,y:1,z:4}
            }
        ]
    }
]