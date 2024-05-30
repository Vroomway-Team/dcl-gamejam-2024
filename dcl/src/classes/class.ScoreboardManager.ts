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
		
		console.log("ScoreboardManager: updateState()")
		
		// If a new state was provided, store it
		if (state) { 
			// Check if the roundInProgress property has changed since the last state update and react accoringly
/* 			if (this.state && this.state.roundInProgress !== state.roundInProgress) {
				if (state.roundInProgress) {
					//this.onRoundStart()
				} else {
					//this.onRoundEnd()
				}
			} */
			
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
	
	incrementRoundTimer(dt: number) {
		if (this.state) {
			if (this.state.roundInProgress) {
				this.state.roundTimer += dt
				
				for (const scoreboard of this.scoreboards) {
					scoreboard.setTimer(this.state.roundTimer)
				}	
			}
		}
	}
	
	
	debugTestFunc() {
		const state: ScoreboardState = {
			"roundInProgress": true,
			"roundTimer":      120,
			"scores":          [
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
				{
					"userName": generateRandomString(10),
					"score"   : Math.floor(Math.random() * 50),
				},
			]
		}
		
		this.updateState(state)
	}
	
}

export function ScoreboardSystem(dt: number) {
	if (SCOREBOARD_MANAGER) {
		SCOREBOARD_MANAGER.incrementRoundTimer(dt)
	}	
}

function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}