import { Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs";
import { TicketEntity } from "./ticket-entity";
import { Vector3 } from "@dcl/sdk/math";
import { Dictionary, List, TRANSFORM_POSITION_ON } from "../utilities/escentials";


/*      BUMPER CAR - TICKET SPAWN MANAGER
    management system for spawning tickets around the game field

    PrimaryAuthors: TheCryptoTrader69 (Alex Pazder)
    TeamContact: thecryptotrader69@gmail.com
*/
export module TicketSpawnManager {
    /**  */
    const ticketList:List<TicketEntity.TicketEntityObject> = new List<TicketEntity.TicketEntityObject>(); 
    /**  */
    const ticketDict:Dictionary<TicketEntity.TicketEntityObject> = new Dictionary<TicketEntity.TicketEntityObject>(); 


    /**  */ 
    export function Spawn(index:number, position:Vector3) {
        console.log("spawning ticket: {index="+index+", position="+JSON.stringify(position)+"}");
        if(ticketDict.containsKey(index.toString())) return;
        //create ticket
        const ticket = TicketEntity.Create({
            index:index,
            transform:{
                parent:undefined,
                position:position
            }
        });
        //add to listing
        ticketList.addItem(ticket);
        ticketDict.addItem(index.toString(), ticket);
    } 
 
    /**  */
    export function Clear(index:number) {
        if(ticketDict.containsKey(index.toString())) return;
        //get ticket
        const ticket = ticketDict.getItem(index.toString());
        //disable ticket object
        TicketEntity.Disable(ticket);
        //remove from listing
        ticketList.removeItem(ticket);
        ticketDict.removeItem(index.toString());
    }

    /** */
    export function ClearAll() {
        while(ticketList.size() > 0) {
            Clear(ticketList.getItem(0).Index);
        }
    }
}