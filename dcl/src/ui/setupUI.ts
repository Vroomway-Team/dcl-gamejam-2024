import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { hudCenterMsgs, hudSpeedometer, hudTicketScore, hudTimer, hudVersion } 			from "./ui.hud"
import { uiDebug } 			from "./ui.debug"

const uiComponents = () => [
	//had to break them up to make it work right
	hudSpeedometer(),
	hudTimer(),	
	hudTicketScore(),
	...hudCenterMsgs(),
	hudVersion(),
	uiDebug()
]
  
export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponents)
}
