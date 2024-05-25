import { Entity, engine, Transform, GltfContainer, ColliderLayer, Animator } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { Dictionary, TransformDataObject, TRANSFORM_SCALE_ON, TRANSFORM_SCALE_OFF, List } from "./utilities/escentials";
import * as utils from '@dcl-sdk/utils'
import { Networking } from "./utilities/networking";

/*      BUMPER CAR - TICKET ENTITY
    system for handling ticket creation/instancing, pooling, and onTouch interactions

    TODO:
        maybe ticket tiers with different values (blue:1,red:3,gold:5)
*/
export module TicketEntity {
    const isDebugging:boolean = false;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("Ticket Entity: "+log); }

    /** ticket display model */
    const DISPLAY_MODEL_SRC:string = "models/bumper-cars/ticket-entity.glb";

    /** display model positional offset */
    const MODEL_OFFSET:Vector3 = { x:0, y:1.25, z:0 };
    /** display model scale */
    const MODEL_SCALE:Vector3 = { x:0.5, y:0.5, z:0.5 };

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
        index:number,
        transform:TransformDataObject;
	}

    /** represents a single managed object */
    export class TicketEntityObject {
        /** access key for object */
        public get Key():string { return this.EntityParent.toString(); };

        /** index of the spawner this ticket is owned by */
        private index:number = -1;
        public get Index():number { return this.index; };
        /** whether this object is currently being used */
        private isActive:boolean = true;
        public get IsActive():boolean { return this.isActive; };

        /** parental object */
        public EntityParent:Entity;
        public EntityModel:Entity;

        /** called when the object is first created (setup all core entities & components here) */
        public constructor() {
            //create entities
            //  parental entity
            this.EntityParent = engine.addEntity();
            Transform.create(this.EntityParent);
            //  display model
            this.EntityModel = engine.addEntity();
            Transform.create(this.EntityModel,{
                parent: this.EntityParent,
                position: MODEL_OFFSET,
                scale: MODEL_SCALE
            });
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
            addLog("initializing collection ticket...");
            //set owner
            this.index = data.index;
            //update object's active state (now in use)
            this.isActive = true;

            //update entities
            //  parent
            var transform = Transform.getMutable(this.EntityParent);
            transform.parent = data.transform.parent;
            transform.scale = TRANSFORM_SCALE_ON;
            //  display model
            transform = Transform.getMutable(this.EntityModel);
            if(data.transform.position) {
                transform.position.x = MODEL_OFFSET.x + data.transform.position.x;
                transform.position.y = MODEL_OFFSET.y + data.transform.position.y;
                transform.position.z = MODEL_OFFSET.z + data.transform.position.z;
            }
            transform.scale = MODEL_SCALE;
            //  toggle animations
            Animator.getClip(this.EntityModel, "Action").playing = false;
            Animator.getClip(this.EntityModel, "Action").playing = true;
            //  collection trigger
            const ticketID = data.index;
            utils.triggers.addTrigger(
                //parental object
                this.EntityModel,
                //layer mask
                utils.NO_LAYERS,
                //triggered by mask
                utils.ALL_LAYERS,
                //area size
                [{ type:'sphere', position:{x:0,y:0.25,z:0}, radius:1 }],
                //collision callback (send demand to server)
                function() { 
                    //halt if player is not part of a room
                    if(Networking.ServerRoom == undefined) return;
                    //send interaction request
                    Networking.ServerRoom.send("ticket-interact", { playerID:Networking.GetUserID(), ticketID:ticketID });
                },
                //exit callback
                undefined 
            );

            addLog("initialized collection ticket!");
        }

        /** disables this object */
        public Disable() {
            //mark this object as inactive
            this.isActive = false;

            //hide object's main entity
            Transform.getMutable(this.EntityParent).scale = TRANSFORM_SCALE_OFF;
            //remove trigger
            utils.triggers.removeTrigger(this.EntityModel);
        }
    }

    /** creates a new object (possibily reusing an inactive object) and initializes it with the provided creation data */
    export function Create(data:TicketEntityObjectCreationData):TicketEntityObject {
        addLog("creating new object...");
        
        //attempt to get an existing inactive object
        var object:undefined|TicketEntityObject = undefined;
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
        
        addLog("created new object {key="+object.Key+", \n\tpooling stats: count="
            +pooledObjectsAll.size()+", active="+pooledObjectsActive.size()+", inactive="+pooledObjectsInactive.size());
        //provide object reference
        return object;
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
}