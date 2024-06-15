//import { UserData } from "@decentraland/Players";
//import { CONFIG } from "src/config";
//import { GAME_STATE } from "src/state";
//import { getAndSetUserData, getAndSetUserDataIfNull, getUserDataFromLocal } from "src/userData";
//import { isNull } from "src/utils";

import { executeTask } from "@dcl/sdk/ecs";
import { log } from "../back-ports/backPorts";
import { CONFIG } from "../_config";

const CLASSNAME = "fetch-utils.ts"

export async function fetchColyseusInfo(){
  return {}
}
//   export async function fetchColyseusInfo(){
//     const METHOD_NAME = "fetchColyseusInfo";
//     log(METHOD_NAME,"ENTRY")
//     //const result = await executeTask(async () => {
//       let response = null;
      
//       //docs https://github.com/MetaLiveStudio/metadoge#apiwallet
//       const callUrl =
//         CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL_HTTP + "/info"
//           "&_unique=" +
//           new Date().getTime();
 
//       try {
//         log(METHOD_NAME," fetch.calling " , callUrl);
//         response = await fetch(callUrl, {
//           //headers: { "Content-Type": "application/json" },
//           method: "GET",
//           //body: JSON.stringify(myBody),
//         });
//         if (response.status == 200) {
//           let json = await response.json();

//           //log(json)
//           log(METHOD_NAME, " reponse ", json);
//           return json;
//         } else {
//           try{
//             let json = await response.json();
//             //log("NFTRepository reponse " + response.status + " " + response.statusText)
//             log(
//               METHOD_NAME ,
//                 " error reponse to reach URL status:" +
//                 response.status +
//                 " text:" +
//                 response.statusText +
//                 " json:" +
//                 JSON.stringify(json)
//             ); 
//             //throw new Error(response.status + " " + response.statusText)
//             return {
//               ok: false,
//               errorMsg: response.status + " " + response.statusText + " " + json,
//             };
//           }catch(e){
//             log(METHOD_NAME, ".failed to parse response " + e);
            
//             return {
//               ok: false,
//               errorMsg: "Failed to parse json response",
//               error: e
//             };
//           }
//         }
//       } catch (e) {
//         log(METHOD_NAME, ".failed to reach URL " + e + " " + response);
//         throw e;
//       }
//     //});

// }