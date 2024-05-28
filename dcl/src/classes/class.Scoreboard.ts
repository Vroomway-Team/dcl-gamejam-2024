import { engine, Entity, GltfContainer, Rotate, TextAlignMode, TextShape, Transform, TransformType 
	
} 					from "@dcl/sdk/ecs";
import { ScoreboardEntry, ScoreboardState } from "../interfaces/interface.Scoreboard";
import { Color4, Vector3, Quaternion } from "@dcl/sdk/math";
import { Vector3ToVec3 } from "../utilities/func.Vectors";

export class Scoreboard {
	
	entityRoot    : Entity	// engine entity for root transform
	entityTimer   : Entity	// engine entity for timer
	entityStatus  : Entity	// engine entity for round status
	
	state         : ScoreboardState | undefined	
	elements      : ScoreboardRow[] = [] // Array of scoreboard row elements
	maxScores     : number          = 10 // Max number of scores to show on the board	
	rowStartOffset: number          = -0.3   // Offset start of rows
	rowYHeight    : number          = 0.2 // Space between score rows
	
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
		
		// Add the timer
		this.entityTimer  = engine.addEntity()
		TextShape.create(this.entityTimer, {
			text: "foo"
		})
		Transform.create(this.entityTimer, {
			parent: this.entityRoot,
			position: Vector3.create(0, 0, -0.01),
			rotation: Quaternion.Zero(),
			scale   : Vector3.create(0.2, 0.2, 0.2)
		})
		
		this.entityStatus = engine.addEntity()
		TextShape.create(this.entityStatus, {
			text: "bar"
		})
		Transform.create(this.entityStatus, {
			parent: this.entityRoot,
			position: Vector3.create(0, -1.5, -0.01),
			rotation: Quaternion.Zero(),
			scale   : Vector3.create(0.2, 0.2, 0.2)
		})
		
		
	}	
	
	clearRows() {
		for (const row of this.elements) {
			row.destroy()
		}
	}
	
	setTimer(amount: number) {
		if (this.state) {
			this.state.roundTimer = amount
			const text = TextShape.getMutable(this.entityTimer)
			text.text  = this.parseTime(this.state.roundTimer)
		}
	}
	
	updateState(state: ScoreboardState) {
		// Update the stored state
		if (state) {
			this.state = state			
			this.sortScores()
		}
		
		// Ensure we have a state
		if (!this.state) { return }
		
		// Remove the existing Scoreboard Rows
		this.clearRows()
		
		// Update the timer
		const timer = TextShape.getMutable(this.entityTimer)
		timer.text = this.parseTime(this.state.roundTimer)
		
		// Update the status
		const status = TextShape.getMutable(this.entityStatus)
		status.text = this.state.roundInProgress ? "Match in progress" : "Waiting to start..."
		
		// Create the replacement scoreboard rows
		for (const [index, score] of this.state.scores.entries()) {
			
			// Check we've not exceeded the display limit
			if (index >= this.maxScores) { 
				break
			}
			
			// Create the row transform
			const transform: TransformType = {
				position: Vector3.create(0, (-this.rowYHeight * index) + this.rowStartOffset, 0),
				rotation: Quaternion.create(),
				scale   : Vector3.One()
			}
			
			// Create the new row element
			const row = new ScoreboardRow(this.entityRoot, score.userName, score.score, index + 1, transform)
			this.elements.push(row)
		}
			
	}
	
	parseTime(time: number) {
		const minutes = Math.floor(time / 60).toString();
		const seconds = Math.floor(time % 60).toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
	
	sortScores() {
        if (!this.state) return

        // Sort the scores array by score value in descending order
        this.state.scores.sort((a: ScoreboardEntry, b: ScoreboardEntry) => b.score - a.score)
    }
	
}

class ScoreboardRow {
	rootEntity : Entity
	nameEntity : Entity
	scoreEntity: Entity
	rankEntity : Entity
	
	private textScale = 0.1
	
	constructor(
		parentEntity: Entity,
		userName    : string,
		score       : number,
		rank        : number,
		transform   : TransformType
	) {
		this.rootEntity  = engine.addEntity()
		this.nameEntity  = engine.addEntity()
		this.scoreEntity = engine.addEntity()
		this.rankEntity  = engine.addEntity()	
		
		// Root transform
		Transform.create(this.rootEntity, {
			...transform,
			parent: parentEntity
		});
		
		//  Rank
		Transform.create(this.rankEntity, {
			parent  : this.rootEntity,
			position: {x: -1.2, y: 0, z: -0.01},
			scale   : {x: this.textScale, y: this.textScale, z:this.textScale}
		});
		TextShape.create(this.rankEntity,{
			text     : rank.toString(),
			fontSize : 15,
			textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
			textColor: Color4.White(),
		});
		
		//  Player's name
		Transform.create(this.nameEntity, {
			parent  : this.rootEntity,
			position: {x: 0, y: 0, z: -0.01},
			scale   : {x: this.textScale, y: this.textScale, z:this.textScale}
		});
		TextShape.create(this.nameEntity,{
			text     : userName,
			fontSize : 15,
			textAlign: TextAlignMode.TAM_MIDDLE_CENTER,
			textColor: Color4.White(),
		});
		
		//  Score
		Transform.create(this.scoreEntity, {
			parent  : this.rootEntity,
			position: {x: 1.2, y: 0, z: -0.01},
			scale   : {x: this.textScale, y: this.textScale, z:this.textScale}
		});
		TextShape.create(this.scoreEntity,{
			text     : score.toString(),
			fontSize : 15,
			textAlign: TextAlignMode.TAM_MIDDLE_RIGHT,
			textColor: Color4.White(),
		});
	}
	
	destroy() {
		engine.removeEntity(this.rootEntity)
		engine.removeEntity(this.nameEntity)
		engine.removeEntity(this.scoreEntity)
		engine.removeEntity(this.rankEntity)
	}
}