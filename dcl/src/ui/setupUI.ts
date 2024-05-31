import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { hudCenterMsgs, hudSpeedometer, hudTicketScore, hudTimer } 			from "./ui.hud"
import { uiDebug } 			from "./ui.debug"

const uiComponents = () => [
	//had to break them up to make it work right
	hudSpeedometer(),
	hudTimer(),	
	hudTicketScore(),
	...hudCenterMsgs(),
	uiDebug()
]
  
export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponents)
}
