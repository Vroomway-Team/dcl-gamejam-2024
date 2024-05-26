import { engine, Entity, GltfContainer, Transform, TransformType 
	
} 					from "@dcl/sdk/ecs";
import { ScoreboardState } from "../interfaces/interface.Scoreboard";

export class Scoreboard {
	
	entityRoot: Entity	
	state     : ScoreboardState | undefined
	
	maxScores : number =  10 // Max number of scores to show on the board
	
	constructor(
		transform: TransformType,
		maxScores: number = 10,
		modelSrc?: string
	) {
		
		this.maxScores = maxScores
		
		// Add the root entity and attach the gltf object
		this.entityRoot = engine.addEntity()
		Transform.create(this.entityRoot, transform)
		
		// Attach the (optional) gltf object
		if (modelSrc) {	
			GltfContainer.createOrReplace(this.entityRoot, {
				src: modelSrc,
			})
		}
		
		
	}	
	
	updateState(state: ScoreboardState) {
		this.state = state
	}
	
}