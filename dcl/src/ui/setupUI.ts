import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { uiHud } 			from "./ui.hud"
import { uiDebug } 			from "./ui.debug"

const uiComponents = () => [
	uiDebug()
	//uiHud(),
]
  
export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponents)
}
