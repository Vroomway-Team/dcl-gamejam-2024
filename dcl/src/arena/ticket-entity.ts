import { Entity, engine, Transform, GltfContainer, ColliderLayer, Animator, MeshCollider, MeshRenderer } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import * as utils from '@dcl-sdk/utils'
import { Dictionary, FunctionCallbackIndex, List, TRANSFORM_POSITION_OFF, TRANSFORM_SCALE_OFF, TRANSFORM_SCALE_ON, TransformDataObject } from "../utilities/escentials";
import { AudioManager } from "./audio-manager";

/*      BUMPER CAR - TICKET ENTITY
    system for handling ticket creation/instancing, pooling, and onTouch interactions

    PrimaryAuthors: TheCryptoTrader69 (Alex Pazder)
    TeamContact: thecryptotrader69@gmail.com
*/
export module TicketEntity {
    const isDebugging:boolean = false;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("Ticket Entity: "+log); }

    /** ticket display model */
    const DISPLAY_MODEL_SRC:string = "assets/gltf/ticket.gltf";

    /** display model scale */
    const MODEL_SCALE:Vector3 = { x:0.5, y:0.5, z:0.5 };

    /** function called when the player collides with a ticket */
    export var CallbackTicketCollision:undefined|FunctionCallbackIndex;

    /** pool of ALL existing objects */
    var pooledObjectsAll:List<TicketEntityObject> = new List<TicketEntityObject>();
    /** pool of active objects (already being used in scene) */
    var pooledObjectsActive:List<TicketEntityObject> = new List<TicketEntityObject>();
    /** pool of inactive objects (not being used in scene) */
    var pooledObjectsInactive:List<TicketEntityObject> = new List<TicketEntityObject>();
    /** registry of all objects in-use, access key is entity's uid */
    var pooledObjectsRegistry:Dictionary<TicketEntityObject> = new Dictionary<TicketEntityObject>();
  
    /** attmepts to find an object of the given key. if no object is registered under the given key then 'undefined' is returned. */
    export function GetByKey(key:string):undefined|TicketEntityObject {
        //check for object's existance
        if(pooledObjectsRegistry.containsKey(key)) {
            //return existing object
            return pooledObjectsRegistry.getItem(key);
        }
        //object does not exist, send undefined
        return undefined;
    }
    
	/** object interface used to define all data required to create a new object */
	export interface TicketEntityObjectCreationData {
        id:number,
        transform:TransformDataObject;
	}

    /** represents a single managed object */
    export class TicketEntityObject {
        public get Key():string { return this.index.toString(); };
        /** index of the spawner this ticket is owned by */
        private index:number = -1;
        public get Index():number { return this.index; };
        /** whether this object is currently being used */
        private isActive:boolean = true;
        public get IsActive():boolean { return this.isActive; };

        /** parental object */
        public EntityModel:Entity;

        /** called when the object is first created (setup all core entities & components here) */
        public constructor() {
            //create entities
            //  display model
            this.EntityModel = engine.addEntity();
            Transform.create(this.EntityModel,{
                parent: undefined,
                position: TRANSFORM_POSITION_OFF,
                scale: TRANSFORM_SCALE_OFF
            });
            /*MeshRenderer.setBox(this.EntityModel);*/
            GltfContainer.createOrReplace(this.EntityModel, {
                src: DISPLAY_MODEL_SRC,
                visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                invisibleMeshesCollisionMask: undefined
            });
            Animator.create(this.EntityModel,{
                states: [
                    {clip:"Action", playing:true, speed:1, shouldReset:false, loop:true},
                ]
            });
        }

        /** called when the object is activated/def is first set (load in all specifics to defs here) */
        public Initialize(data:TicketEntityObjectCreationData) {
            addLog("initializing ticket {id="+data.id+", pos="+JSON.stringify(data.transform.position)+"}...");
            //set owner
            this.index = data.id;
            //update object's active state (now in use)
            this.isActive = true;

            //update entities
            //  display model
            const transform = Transform.getMutable(this.EntityModel);
            if(data.transform.position) {
                const pos = {
                    x: data.transform.position.x,
                    y: data.transform.position.y,
                    z: data.transform.position.z
                }
                transform.position = pos;
            }
            transform.scale = MODEL_SCALE;
            //  toggle animations
            Animator.getClip(this.EntityModel, "Action").playing = false;
            Animator.getClip(this.EntityModel, "Action").playing = true;
            //  collection trigger
            const ticketID = data.id;
            utils.triggers.addTrigger(
                //parental object
                this.EntityModel,
                //layer mask
                utils.NO_LAYERS,
                //triggered by mask
                utils.ALL_LAYERS,
                //area size
                [{ type:'sphere', position:{x:0,y:0,z:0}, radius:1 }],
                //collision callback (send demand to server)
                function() {
                    //play sound effect
                    AudioManager.PlaySoundEffect(AudioManager.AUDIO_SFX.INTERACTION_TICKET_COLLECT);
                    //attempt callback
                    if(CallbackTicketCollision) CallbackTicketCollision(ticketID);
                },
                //exit callback
                undefined 
            ); 

            addLog("initialized ticket {id="+data.id+", pos="+JSON.stringify(transform.position)+"}!");
        }

        /** disables this object */
        public Disable() {
            //mark this object as inactive
            this.isActive = false;

            //hide object's main entity
            Transform.getMutable(this.EntityModel).scale = TRANSFORM_SCALE_OFF;
            //remove trigger
            utils.triggers.removeTrigger(this.EntityModel);
        }
    }

    /** creates a new object (possibily reusing an inactive object) and initializes it with the provided creation data */
    export function Create(data:TicketEntityObjectCreationData):TicketEntityObject {
        addLog("creating new object {id="+data.id+"} ...");
        
        //attempt to get an existing inactive object
        var object = undefined;
        //
        if(pooledObjectsInactive.size() > 0) {
            //get object from listing of inactive objects
            object = pooledObjectsInactive.getItem(pooledObjectsInactive.size()-1);
            pooledObjectsInactive.removeItem(object);
        }
        //if no inactive object was found
        if(object == undefined) {
            //create new object and add it to pooling management
            object = new TicketEntityObject();
            pooledObjectsAll.addItem(object);
        }
        //initialize object with provided creation data
        object.Initialize(data);

        //add object to active collection
        pooledObjectsActive.addItem(object);
        //add object to key-access registry
        pooledObjectsRegistry.addItem(object.Key, object);
        
        addLog("created new object {id="+object.Key+", \n\tpooling stats: count="
            +pooledObjectsAll.size()+", active="+pooledObjectsActive.size()+", inactive="+pooledObjectsInactive.size());
        //provide object reference
        return object;
    }

    /** disables the given object, hiding it from the scene but retaining it in data & pooling */
    export function Disable(object:TicketEntityObject) {
        addLog("disabling object {key="+object.Key+"}...");

        //remove object from active listings
        pooledObjectsActive.removeItem(object);
        if(pooledObjectsRegistry.containsKey(object.Key)) pooledObjectsRegistry.removeItem(object.Key);
        
        //add object to inactive listing (ensure add is required)
        const posX = pooledObjectsInactive.getItemPos(object);
        if(posX == -1) pooledObjectsInactive.addItem(object);
        
        //disable object
        object.Disable();
        
        addLog("disabled object {key="+object.Key+"}!");
    }

    /** disables all objects, hiding them from the scene but retaining them in data & pooling */
    export function DisableAll() {
        addLog("disabling all objects...");
        //ensure all objects are parsed
        while(pooledObjectsActive.size() > 0) { 
            //small opt by starting at the back b.c of how list is implemented (list keeps order by swapping next item up)
            Disable(pooledObjectsActive.getItem(0));
        }
        addLog("disabled all objects!");
    }
}