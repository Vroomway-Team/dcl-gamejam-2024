import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { hudSpeedometer, hudTicketScore, hudTimer, hudYouGotIt } 			from "./ui.hud"
import { uiDebug } 			from "./ui.debug"

const uiComponents = () => [
	//had to break them up to make it work right
	hudSpeedometer(),
	hudTimer(),	
	hudTicketScore(),
	hudYouGotIt(),
	uiDebug()
]
  
export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponents)
}
