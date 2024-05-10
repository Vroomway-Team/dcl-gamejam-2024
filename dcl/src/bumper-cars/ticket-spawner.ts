import { Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { TicketEntity } from "./ticket-entity";
import { Vector3 } from "@dcl/sdk/math";


/*      BUMPER CAR - TICKET SPAWN MANAGER
    management system for spawning tickets around the game field

*/
export module TicketSpawnManager {
    /** when true tickets are spawning */
    var isSpawning:boolean = false;

    /** how many tickets are spawned per batch */
    const TICKET_SPAWN_COUNT:number = 1;
    /** time between spawning each ticket batch */
    const TICKET_SPAWN_LENGTH:number = 3.5;
    /** current amount of time remaining befor next batch is spawned */
    var ticketSpawnCountdown:number = 0;

    /** all spawner objects */
    var spawners:TicketSpawnerObject[] = [];

    const GRID_SIZE_X:number = 7;
    const GRID_SIZE_Z:number = 7;
    /** all spawner locations */
    const SPAWNER_POSITIONS:Vector3[] = [];
    for(var x:number=0; x<GRID_SIZE_X; x++) {
        for(var z:number=0; z<GRID_SIZE_Z; z++) {
            const position = { 
                x:32+(6*(x-(GRID_SIZE_X/2)+0.5)),
                y:8.75,
                z:32+(6*(z-(GRID_SIZE_Z/2)+0.5))
            };
            SPAWNER_POSITIONS.push(position);
        }
    }

    /** sets the state ticket spawning */
    export function SetSpawnState(state:boolean) {
        //halt if no change is required
        if(isSpawning == state) return;
        //update state
        isSpawning = state;
        if(isSpawning) engine.addSystem(processingTicketSpawning);
        else engine.removeSystem(processingTicketSpawning);
    }

    /** timed processing for object components */
    function processingTicketSpawning(dt:number) {
        //add change in time
        ticketSpawnCountdown -= dt;
        //halt if timer is not consumed
        if(ticketSpawnCountdown > 0) return;
        //reset count down
        ticketSpawnCountdown += TICKET_SPAWN_LENGTH;

        //spawn required number of tickets 
        for(var i:number=0; i<TICKET_SPAWN_COUNT; i++) {
            //get random spawner
            var index = Math.round(Math.random()*(spawners.length-1));
            var indexCur = index;
            while(true) {
                //push next index
                indexCur++;
                if(indexCur >= spawners.length) indexCur = 0;
                //cancel if wrapping around (no more free spawners)
                if(index == indexCur) return;
                //halt search if spawner is not occupied 
                if(!spawners[indexCur].IsOccupied) break;
            }
            //create ticket object
            spawners[indexCur].SpawnTicket();
        }
    }

    /** spawner point used as an anchor point to spawn in tickets */
    export class TicketSpawnerObject {
        /** access key for object */
        public get Key():string { return this.EntityParent.toString(); };
        private key:number;

        /** when true spawner is occupied by a token */
        public IsOccupied:boolean = false;

        /** parental object */
        public EntityParent:Entity;

        /** current ticket object */
        public TicketObject:undefined|TicketEntity.TicketEntityObject; 

        /** called when the object is first created (setup all core entities & components here) */
        public constructor(index:number) {
            this.key = index;
            //create entities
            //  parental entity
            this.EntityParent = engine.addEntity();
            Transform.create(this.EntityParent,{
                position: SPAWNER_POSITIONS[this.key]
            });
            MeshRenderer.setBox(this.EntityParent);
        }

        /**  */
        public SpawnTicket() {
            //halt if spawner is occupied
            if(this.IsOccupied) return;
            this.IsOccupied = true;

            //create ticket
            this.TicketObject = TicketEntity.Create({
                index: this.key,
                transform:{
                    parent:this.EntityParent
                }
            });
        }

        /**  */
        public ClaimTicket() {
            //halt if no ticket exists
            if(this.TicketObject == undefined) return;

            //disable ticket object
            TicketEntity.Disable(this.TicketObject);

            //remove reference to current ticket
            this.TicketObject = undefined;
            this.IsOccupied = false;
        }
    }

    /**  */
    export function ClaimTicket(index:number) {
        //console.log("claiming ticket...")
        spawners[index].ClaimTicket();
    }
    
    //create spawner objects
    for(var i:number=0; i<SPAWNER_POSITIONS.length; i++) {
        spawners.push(new TicketSpawnerObject(i));
    }
}