import { inputSystem, InputAction, PointerEventType, engine } from "@dcl/sdk/ecs";
import { Networking } from "./utilities/networking";
import { DynamicButton_Simple } from "./utilities/escentials";

export module VehicleManager {
    //create buttons representing vehicles
    const vehicles:DynamicButton_Simple[] = []; 
    for(var i:number=0; i<8; i++) {
        vehicles.push(new DynamicButton_Simple(i, {x:4+i,y:1,z:12}, i.toString()));
    }

    /** updates the view for all lobby objects  */
    export function UpdateVehicleStateByID(id:number, state:boolean) {
        vehicles[id].SetState(state);
    }
    /** updates the view for all lobby objects  */
    export function UpdateVehicleStates(states:undefined|string[]) {
        console.log("updating vehicle states: "+states);
        for(var i:number=0; i<vehicles.length; i++) {
            vehicles[i].SetState(false);
        }
        if(states != undefined) {
            for(var i:number=0; i<states.length; i++) {
            vehicles[parseInt(states[i])].SetState(true);
            }
        }
    }

    /** processes all buttons, executing interactions */
    export function processInteractions() {
        //process every active button 
        for(var i:number=0; i<vehicles.length; i++) { 
            //get button entity
            const button = vehicles[i].FrameEntity;
            
            //mouse click
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, button)) {
            console.log("vehicle "+i+" clicked");
            //halt if player is not part of a room
            if(Networking.ServerRoom == undefined) return;
            //send request based on vehicle claim state
            const vID:number = i;
            if(vehicles[i].State) Networking.ServerRoom.send("lobby-leave", {id:Networking.GetUserID()});
            else Networking.ServerRoom.send("lobby-join", {id:Networking.GetUserID(), displayName:Networking.GetUserName(), vehicle:vID});
            }
        }
    } 
    //add system to engine
    engine.addSystem(processInteractions);

    //initial vehicle update
    UpdateVehicleStates([]);
}