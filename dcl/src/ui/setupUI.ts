import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { uiHud } from "./ui.hud"
import { uiDebug } from "./ui.debug"
import * as ui from 'dcl-ui-toolkit'
import { createDebugUIButtons } from "./ui-hud-debugger"
import { initUILoginGame } from "../connect/ui-login-game"

const uiComponents = () => [
	uiDebug(),
	ui.render(),
	//uiHud(),
]
   
export function setupUi() {
	initUILoginGame();
	createDebugUIButtons();

	ReactEcsRenderer.setUiRenderer(uiComponents)
} 
 