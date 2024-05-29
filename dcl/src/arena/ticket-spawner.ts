import { Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { TicketEntity } from "./ticket-entity";
import { Vector3 } from "@dcl/sdk/math";
import { TRANSFORM_POSITION_ON } from "../utilities/escentials";


/*      BUMPER CAR - TICKET SPAWN MANAGER
    management system for spawning tickets around the game field

    PrimaryAuthors: TheCryptoTrader69 (Alex Pazder)
    TeamContact: thecryptotrader69@gmail.com
*/
export module TicketSpawnManager {
    /** when true tickets are spawning */
    var isSpawning:boolean = false;

    /** how many tickets are spawned per batch */
    const TICKET_SPAWN_COUNT:number = 1;
    /** time between spawning each ticket batch */
    const TICKET_SPAWN_LENGTH:number = 1.5;
    /** current amount of time remaining befor next batch is spawned */
    var ticketSpawnCountdown:number = 0; 
 
    /** all spawner objects */
    var spawners:TicketSpawnerObject[] = [];
  
    //place spawners in scene
    const GRID_SIZE_X:number = 4;
    const GRID_SIZE_Z:number = 4;
    /** all spawner locations */
    const SPAWNER_POSITIONS:Vector3[] = [];
    for(var x:number=0; x<GRID_SIZE_X; x++) {
        for(var z:number=0; z<GRID_SIZE_Z; z++) {
            const position = { 
                x:32+(10.5*(x-(GRID_SIZE_X/2)+0.5)),
                y:7.85,
                z:32+(10.5*(z-(GRID_SIZE_Z/2)+0.5))
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

    /** randomness threshold for position */
    const RANDOM_OFFSET:number = 3;
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
            //randomized position
            const posRand = {
                x: ((Math.random()-0.5)*RANDOM_OFFSET),
                y: 0,
                z: ((Math.random()-0.5)*RANDOM_OFFSET)
            };
            //create ticket object
            if(spawners[indexCur]){
                spawners[indexCur].Spawn(posRand);
            }else{
                console.log("WARNING - processingTicketSpawning() - no spawner found for index: ",indexCur);
            }
        }
    }

    /** spawner point used as an anchor point to spawn in tickets */
    export class TicketSpawnerObject {
        /** access key for object */
        public get Key():string { return this.key.toString(); };
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
        public Spawn(pos?:Vector3) {
            //halt if spawner is occupied
            //if(this.IsOccupied) return;
            this.IsOccupied = true;

            //create ticket
            this.TicketObject = TicketEntity.Create({
                index: this.key,
                transform:{
                    parent:this.EntityParent,
                    position:pos??TRANSFORM_POSITION_ON
                }
            });
        }

        /**  */
        public Clear() {
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
    export function Spawn(index:number, position:Vector3) {
        //console.log("spawning ticket: {index="+index+", position="+JSON.stringify(position)+"}");
        if(!spawners[index]){
            console.log("WARNING Spawn() - spawning ticket does not exist!!!: {index="+index+", position="+JSON.stringify(position)+"}");
            return;
        }
        spawners[index].Spawn(position);
    }

    /**  */
    export function Clear(index:number) {
        //console.log("clearing ticket: {index="+index+"}");
        spawners[index].Clear();
    }

    /** */
    export function ClearAll() {
        for(var i:number=0; i<spawners.length; i++) {
            Clear(i);
        }
    }

    //create spawner objects
    for(var i:number=0; i<SPAWNER_POSITIONS.length; i++) {
        spawners.push(new TicketSpawnerObject(i));
    }
}