import { Rotate, engine } from "@dcl/sdk/ecs";
import { Scoreboard } from "../classes/class.Scoreboard";
import { ScoreboardManager, ScoreboardSystem } from "../classes/class.ScoreboardManager";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export const SCOREBOARD_MANAGER = new ScoreboardManager()

export function setupScoreboards() {
	
	// First Scoreboard, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30.05, 5, 32),
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, 3, "assets/gltf/scoreboard.01.gltf"))
	
	// First Scoreboard, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30.05, 5, 28),
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, 10, "assets/gltf/scoreboard.01.gltf"))
	
	// First Scoreboard, in lobby	
	SCOREBOARD_MANAGER.addScoreboard(new Scoreboard({
		position: Vector3.create(30.05, 5, 36),
		rotation: Quaternion.fromEulerDegrees(-25, 90, 0),
		scale   : Vector3.One()
	}, 10, "assets/gltf/scoreboard.01.gltf"))
	
	// Add the scoreboard system, repsonsible for adjusting round timers
	engine.addSystem(ScoreboardSystem)
}