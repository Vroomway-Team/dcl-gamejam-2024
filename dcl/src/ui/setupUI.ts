import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { uiHud } from "./ui.hud"
import { uiDebug } from "./ui.debug"
import * as ui from 'dcl-ui-toolkit'
import { createDebugUIButtons } from "./ui-hud-debugger"
import { initUILoginGame } from "../connect/ui-login-game"
import { initUIEndGame, initUIGameHud } from "../connect/ui-game-hud"

const uiComponents = () => [
	uiDebug(),
	ui.render(),
	//uiHud(),
]
   
export function setupUi() {
	initUILoginGame();
	initUIEndGame()

	//from gamimall
	initUIGameHud()
	
	createDebugUIButtons();

	ReactEcsRenderer.setUiRenderer(uiComponents)
} 
 