/*      BUMPER CAR - TICKET SPAWN MANAGER
    management system for spawning tickets around the game field

    we could add some anti-cheat by comparing a player's location against the tickets they interact with
*/
export module TicketSpawnManager {
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("LOBBY MANAGER: "+log); }

    interface Vector3 { x:number; y:number; z:number; }
    interface TicketPacket { id:number; position:Vector3; }

    /** how many tickets are spawned per batch */
    const TICKET_SPAWN_COUNT:number = 1;
    /** time between spawning each ticket batch */
    export const TICKET_SPAWN_LENGTH:number = 4000;
    /** randomness threshold for position */
    const RANDOM_OFFSET:number = 0.5;

    /** current amount of time remaining befor next batch is spawned */
    var ticketSpawnCountdown:number = 0;

    /**  */
    export type SpawnTicketCallbackType = (index:number, position:Vector3) => void;
    export var SpawnTicketCallback:undefined|SpawnTicketCallbackType;

    /** spawner point used as an anchor point to spawn in tickets */
    export class TicketSpawnerObject {
        public Index:number;
        /** when true spawner is occupied by a token */
        public IsOccupied:boolean = false;
        /** current ticket position */
        public Position:Vector3;

        constructor(index:number) {
            this.Index = index;
        }
    }

    /** all spawner objects */
    var spawners:TicketSpawnerObject[] = [];
    /** */
    export function IsSpawnerOccupied(index:number) { return spawners[index].IsOccupied; }
    /** all available spawners */
    var available:number[] = [];
    //generate spawner objects
    const GRID_SIZE_X:number = 4;
    const GRID_SIZE_Z:number = 4;
    /** all spawner locations */
    for(var x:number=0; x<GRID_SIZE_X; x++) {
        for(var z:number=0; z<GRID_SIZE_Z; z++) {
            available.push(spawners.length);
            spawners.push(new TicketSpawnerObject(spawners.length));
        }
    } 

    /** attempts to spawn a ticket on a random spawner, sending down call to all clients */
    export function SpawnTicket() {
        //spawn required number of tickets (batch creation)
        for(var i:number=0; i<TICKET_SPAWN_COUNT; i++) {
            //halt if no spawners remain
            if(available.length == 0) return;
             
            //get random spawner from available
            const index = Math.round(Math.random()*(available.length-1));
            const id = available[index];
            //overwrite target with last element
            available[index] = available[available.length-1];
            //remove last element
            available.pop();

            //register ticket in spawner
            spawners[id].IsOccupied = true;
            //randomized position
            spawners[id].Position = {
                x: ((Math.random()-0.5)*RANDOM_OFFSET),
                y: 0,
                z: ((Math.random()-0.5)*RANDOM_OFFSET)
            };
            //send out ticket spawn details
            if(SpawnTicketCallback) SpawnTicketCallback(id, spawners[id].Position);
            console.log("spawned ticket on spawner="+id);
        }
    }

    export function GetTickets():TicketPacket[] {
        const tickets:TicketPacket[] = [];
        for(var i:number=0; i<spawners.length; i++) {
            if(spawners[i].IsOccupied) tickets.push({id:spawners[i].Index, position:spawners[i].Position});
        }
        return tickets;
    }

    /** attempts to clear a ticket from the given spawner */
    export function ClearTicket(index:number) {
        //halt if spawner does not have a ticket
        if(spawners[index].IsOccupied) return;
        //clear spawner
        spawners[index].IsOccupied = false;
        //add spawner back to available listing
        available.push(index);
    }
}