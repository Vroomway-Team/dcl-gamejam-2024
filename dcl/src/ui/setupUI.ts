import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { uiHud, uiSpeedometerHud, uiYouGotHitHud } 			from "./ui.hud"
import { uiDebug } 			from "./ui.debug"

const uiComponents = () => [
	uiDebug(),
	uiHud(),
	uiSpeedometerHud(),
	uiYouGotHitHud(),
]
  
export function setupUi() {
	ReactEcsRenderer.setUiRenderer(uiComponents)
}
