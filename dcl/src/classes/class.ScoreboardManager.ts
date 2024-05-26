import { engine, Entity, GltfContainer, 
	Transform, TransformType 	
} 							from "@dcl/sdk/ecs";
import { Scoreboard } 		from "./class.Scoreboard";
import { ScoreboardState } 	from "../interfaces/interface.Scoreboard";
import { SCOREBOARD_MANAGER } from "../arena/setupScoreboards";

export class ScoreboardManager {
	
	scoreboards: Scoreboard[] = []
	state      : ScoreboardState | undefined
	
	constructor(scoreboards?: Scoreboard[]) {
		if (scoreboards) {
			this.scoreboards = scoreboards
		}
	}
	
	updateState(state?: ScoreboardState) {
		// If a new state was provided, store it
		if (state) { 
			// Check if the roundInProgress property has changed since the last state update and react accoringly
			if (this.state && this.state.roundInProgress !== state.roundInProgress) {
				if (state.roundInProgress) {
					this.onRoundStart()
				} else {
					this.onRoundEnd()
				}
			}
			
			// Store the new state
			this.state = state 
		}
		
		// Update the managed boards with the stored state
		if (this.state) {
			for (const scoreboard of this.scoreboards) {
				scoreboard.updateState(this.state)
			}			
		}
	}
	
	addScoreboard(scoreboard: Scoreboard) {
		// Add the new scoreboard to the list of managed boards
		this.scoreboards.push(scoreboard)
		
		// Trigger an update on the boards, if we have a valid state
		if (this.state) {
			this.updateState()
		}
	}
	
	onRoundStart() {
		// Round has started
		
	}
	onRoundEnd() {
		// Round has finished
	}
	
}

export function ScoreboardSystem(dt: number) {
	if (SCOREBOARD_MANAGER) {
		//SCOREBOARD_MANAGER.incrementRoundTimer(dt)
	}	
}