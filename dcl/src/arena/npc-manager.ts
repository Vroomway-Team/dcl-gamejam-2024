import { Transform, engine } from "@dcl/sdk/ecs";
import { Dictionary, GetRotationFromPoints, List } from "../utilities/escentials";
import { Vehicle } from "../classes/class.Vehicle";
import { VEHICLE_MANAGER } from "./setupVehicleManager";
import { TicketEntity } from "./ticket-entity";

export module NPCManager {
    /** delay (in seconds) between each npc objective update */
    const OBJECTIVE_RECALC_DELAY:number = 1;

    /**  */
    export class NPCController {
        /** access id for npc (session & player ids) */
        public ID:string;
        /** npc's vehicle */
        public Vehicle:Vehicle;
        /** current ticket target */
        public Ticket:undefined|TicketEntity.TicketEntityObject = undefined;

        /**  */
        public ObjectiveTicker:number = 0;
        public ProcessObjectiveTicker(dt:number):boolean {
            //check for recalc
            this.ObjectiveTicker -= dt;
            if(this.ObjectiveTicker > 0) return false;
            this.ObjectiveTicker = OBJECTIVE_RECALC_DELAY;
            return true;
        }

        constructor(id:string, vehicle:Vehicle) {
            this.ID = id;
            this.Vehicle = vehicle;
        }

        Move() {
            if(this.Ticket == undefined) {
                this.Vehicle.decelerate();
            } else {
                const ticketTrans = Transform.get(this.Ticket.EntityModel);
                //console.log("id=",this.Ticket.Index,", pos=",JSON.stringify(ticketTrans.position));
                //look towards target
                const rot = GetRotationFromPoints(this.Vehicle.getPosition(), ticketTrans.position);
                this.Vehicle.setTargetHeading(rot.y)
                //move towards direction
                this.Vehicle.accelerate();
                //this.Vehicle.PushToWaypoint(ticketTrans.position, 28);
            } 
            this.Vehicle.applyMoveForce();
        }
    }  

    //listings
    export var NPC_DELEGATE_LIST:List<NPCController> = new List<NPCController>();
    export var NPC_DELEGATE_REG:Dictionary<NPCController> = new Dictionary<NPCController>();

    export function TicketClaimed(id:number) {
        //process all npc controllers
        for(var i:number=0; i<NPC_DELEGATE_LIST.size(); i++) {
            const npc = NPC_DELEGATE_LIST.getItem(i);
            //console.log("npc: ticket consumed id=",id," cur target: ",npc.Ticket?.Index);

            //halt if npc does not have a ticket target
            if(npc.Ticket == undefined) continue; 
            //halt if npc was not targeting this ticket
            //if(npc.Ticket.Index != id) continue; 

            //remove ticket target from npc
            npc.Ticket = undefined;
            //calculate new objective
            CalculateObjective(npc);
        }
    }

    /** attempts to find a new objective for the given npc */
    export function CalculateObjective(npc:NPCController) {
        //reset objective counter
        npc.ObjectiveTicker = OBJECTIVE_RECALC_DELAY;

        //halt if ticket
        if(npc.Ticket != undefined) return; 

        //atm just find a new ticket and move towards it
        const ticket = TicketEntity.GetRandom();
        if(ticket == undefined) {
            //console.log("npc: ",npc.ID,": no ticket found, idle");
            npc.Vehicle.decelerate();
            return;
        }

        //assign ticket
        npc.Ticket = ticket;
        //console.log("npc: ",npc.ID,": ticket found, moving towards id=",ticket.Index);
    }  

    /** */
    export function Create(id:string) {
        //get vehicle related to ai
        const vehicle = VEHICLE_MANAGER.getPlayerVehicle(id);
        if(vehicle == undefined) {
            //console.log("failed to add npc controller, no vehicle found for id=",id);
            return; 
        } 
        //populate vehicle details
        vehicle.ownerID = id;
        vehicle.ownerName = id;
        vehicle.moveToArena();
        //create npc controller
        const controller = new NPCController(id, vehicle);
        //add to listings
        NPC_DELEGATE_LIST.addItem(controller);
        NPC_DELEGATE_REG.addItem(id, controller);
    }
 
    /**  */
    export function Destroy(id:string) {
        //get controller
        const controller = NPC_DELEGATE_REG.getItem(id);
        if(!controller) return;
        //remove from listing
        NPC_DELEGATE_LIST.removeItem(controller);
        NPC_DELEGATE_REG.removeItem(id);
    }

    /** update system to re-evaluate npc objective at a given interval */
    function ProcessingObjectiveRecalc(dt:number) {
        //process all npc controllers
        for(var i:number=0; i<NPC_DELEGATE_LIST.size(); i++) {
            const npc = NPC_DELEGATE_LIST.getItem(i);

            //halt if npc is not ready for the next update
            if(npc.ProcessObjectiveTicker(dt)) {
                //calculate new objective
                CalculateObjective(npc);
            }

            npc.Move();
        }
    }
    engine.addSystem(ProcessingObjectiveRecalc);
}