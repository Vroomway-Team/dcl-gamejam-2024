import { Rotate, engine } from "@dcl/sdk/ecs";
import { Scoreboard } from "../classes/class.Scoreboard";
import { ScoreboardManager, ScoreboardSystem } from "../classes/class.ScoreboardManager";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { GameState } from "../game-state";

export const SCOREBOARD_MANAGER = new ScoreboardManager()

export function setupScoreboards() {
	
	// Small wide Scoreboards, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30, 7, 33.4), // offset by 1.4 to match wide model offset
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, "assets/gltf/scoreboard.01.gltf", 10, 0, 16, 1.15, 0.2, true, false, false, false, {
			position: Vector3.create(1.4, 0.565, 0),
			rotation: Quaternion.Zero(),
			scale   : Vector3.create(0.2, 0.2, 0.2)
		}))
		// Second column for above board
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(30, 7, 30.6), // offset by 1.4 to match wide model offset
			rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
			scale   : Vector3.One()
		}, undefined, 10, 10, 16, 1.15, 0.2, false, true, false, false))
	
	// Small wide Scoreboards, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(34, 7, 30.6), // offset by 1.4 to match wide model offset
		rotation: Quaternion.fromEulerDegrees(-25, 270, 0),
		scale   : Vector3.One()
	}, "assets/gltf/scoreboard.01.gltf", 10, 0, 16, 1.15, 0.2, true, false, false, false, {
			position: Vector3.create(1.4, 0.565, 0),
			rotation: Quaternion.Zero(),
			scale   : Vector3.create(0.2, 0.2, 0.2)
		}))
		// Second column for above board
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(34, 7, 33.4), // offset by 1.4 to match wide model offset
			rotation: Quaternion.fromEulerDegrees(-25, 270, 0),
			scale   : Vector3.One()
		}, undefined, 10, 10, 16, 1.15, 0.2, false, true, false, false))

	
	
	// Big scoreboards:
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(32, 17, 61.6723),
		rotation: Quaternion.fromEulerDegrees(0, 0, 0),
		scale   : Vector3.One()
	}, "assets/gltf/scoreboard.big.gltf", 10, 0, 42, 2.6, undefined, true, true))  
		
		// Gold
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(25.6, 14.6, 61.6723),
			rotation: Quaternion.fromEulerDegrees(0, 0, 0),
			scale   : Vector3.One()
		}, undefined, 1, 0, 48, undefined, undefined, true, true, true, true))
		
		// Silver & Bronze
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(38.4, 15.60, 61.6723),
			rotation: Quaternion.fromEulerDegrees(0, 0, 0),
			scale   : Vector3.One()
		}, undefined, 2, 1, 48, undefined, 1.5, true, true, true, true))
		
	
	
	// Big scoreboards:
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(32, 17, 2.32766),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, "assets/gltf/scoreboard.big.gltf", 10, 0, 42, 2.6, undefined, true, true))  
		
		// Gold
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(38.4, 14.60, 2.32766),
			rotation: Quaternion.fromEulerDegrees(0, 180, 0),
			scale   : Vector3.One()
		}, undefined, 1, 0, 48, undefined, undefined, true, true, true, true))
		
		// Silver & Bronze
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(25.6, 15.6, 2.32766),
			rotation: Quaternion.fromEulerDegrees(0, 180, 0),
			scale   : Vector3.One()
		}, undefined, 2, 1, 48, undefined, 1.5, true, true, true, true))
		
	
	
	
	// Add the scoreboard system, repsonsible for adjusting round timers
	//engine.addSystem(ScoreboardSystem)
	//server now handles timing, we can just reg a listen on the game end timer
	//GameState.GameEndCountdown.RegisterCallback(SCOREBOARD_MANAGER.setRoundTimer);
}