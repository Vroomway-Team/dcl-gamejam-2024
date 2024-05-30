import { Rotate, engine } from "@dcl/sdk/ecs";
import { Scoreboard } from "../classes/class.Scoreboard";
import { ScoreboardManager, ScoreboardSystem } from "../classes/class.ScoreboardManager";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export const SCOREBOARD_MANAGER = new ScoreboardManager()

export function setupScoreboards() {
	
	// First Scoreboard, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30.05, 7, 32),
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, 3, "assets/gltf/scoreboard.01.gltf"))
	
	// First Scoreboard, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30.05, 7, 28),
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, 10, "assets/gltf/scoreboard.01.gltf")) 
	
	// First Scoreboard, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30.05, 7, 36),
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, 10, "assets/gltf/scoreboard.01.gltf"))
	
	
	// Big scoreboards:
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(32, 15.934, 61.6723),
		rotation: Quaternion.fromEulerDegrees(0, 0, 0),
		scale   : Vector3.One()
	}, 10, "assets/gltf/scoreboard.big.gltf", 42, 2.4, 0, true, true))  
		
		// Gold
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(25.5, 13.9, 61.6723),
			rotation: Quaternion.fromEulerDegrees(0, 0, 0),
			scale   : Vector3.One()
		}, 1, undefined, 48, 0, 0, true, true, true, true))
		
		// Silver
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(38.5, 14.3, 61.6723),
			rotation: Quaternion.fromEulerDegrees(0, 0, 0),
			scale   : Vector3.One()
		}, 1, undefined, 48, 0, 1, true, true, true, true))
		
		// Bronze
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(38.5, 12.5, 61.6723),
			rotation: Quaternion.fromEulerDegrees(0, 0, 0),
			scale   : Vector3.One()
		}, 1, undefined, 48, 0, 2, true, true, true, true))
		
	
	
	// Big scoreboards:
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(32, 15.934, 2.32766),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale   : Vector3.One()
	}, 10, "assets/gltf/scoreboard.big.gltf", 42, 2.4, 0, true, true))
		
		// Gold
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(38.5, 13.9, 2.32766),
			rotation: Quaternion.fromEulerDegrees(0, 180, 0),
			scale   : Vector3.One()
		}, 1, undefined, 48, 0, 0, true, true, true, true))
		
		// Silver
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(25.5, 14.3, 2.32766),
			rotation: Quaternion.fromEulerDegrees(0, 180, 0),
			scale   : Vector3.One()
		}, 1, undefined, 48, 0, 1, true, true, true, true))
		
		// Bronze
		SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
			position: Vector3.create(25.5, 12.5, 2.32766),
			rotation: Quaternion.fromEulerDegrees(0, 180, 0),
			scale   : Vector3.One()
		}, 1, undefined, 48, 0, 2, true, true, true, true))
	
	
	
	// Add the scoreboard system, repsonsible for adjusting round timers
	engine.addSystem(ScoreboardSystem)
}