import { engine, Entity, GltfContainer, 
		 Rotate, TextAlignMode, TextShape, 
		 Transform, TransformType 
} 											from "@dcl/sdk/ecs";
import { ScoreboardEntry, ScoreboardState } from "../interfaces/interface.Scoreboard";
import { Color4, Vector3, Quaternion } 		from "@dcl/sdk/math";
import { Networking } 						from "../networking";

export class Scoreboard {
	
	entityRoot    : Entity	// engine entity for root transform
	entityTimer   : Entity | undefined	// engine entity for timer
	entityStatus  : Entity | undefined	// engine entity for round status
	
	state         : ScoreboardState | undefined	
	elements      : ScoreboardRow[] = [] // Array of scoreboard row elements
	
	constructor(
		rootTransform    : TransformType,
		modelSrc?        : string,
		
		public maxScores : number  = 10,
		public rankOffset: number  = 0, // Offset the first rank shown - used b big boards to show position 2, 3, etc
		
		public textSize  : number  = 15,
		public rowWidth  : number  = 2.4,
		public rowHeight : number  = 0.5,
		
		public hideStatus: boolean = false,
		public hideTimer : boolean = false,
		public hideRanks : boolean = false,
		public hideScores: boolean = false,
		
		timerTransform: TransformType = {
			position: Vector3.create(0, 0, 0),
			rotation: Quaternion.Zero(),
			scale   : Vector3.create(0.2, 0.2, 0.2)
		},
		statusTransform: TransformType = {
			position: Vector3.create(0, -1.9, 0),
			rotation: Quaternion.Zero(),
			scale   : Vector3.create(0.2, 0.2, 0.2)
		}
	) {
		
		// Add the root entity and attach the gltf object
		this.entityRoot = engine.addEntity()
		Transform.create(this.entityRoot, rootTransform)
		
		// Attach the (optional) gltf object
		if (modelSrc) {	
			GltfContainer.createOrReplace(this.entityRoot, {
				src: modelSrc,
			})
		}
		
		if (!hideTimer) {
			// Add the timer
			this.entityTimer  = engine.addEntity()
			TextShape.create(this.entityTimer, {
				text: "00:00",
				fontSize: 20,
			})
			Transform.create(this.entityTimer, {
				...timerTransform,
				parent: this.entityRoot,
			})			
		}
		
		if (!hideStatus) {
			// Add the match status
			this.entityStatus = engine.addEntity()
			TextShape.create(this.entityStatus, {
				text: "Loading scoreboard..."
			})
			Transform.create(this.entityStatus, {
				...statusTransform,
				parent: this.entityRoot
			})
		}
		
		// Add all the elements required for the board
		this.createElements()		
	}
	
	setTimer(amount: number) {
		if (this.state) {
			this.state.roundTimer = amount
			
			if (this.entityTimer) {
				const text = TextShape.getMutable(this.entityTimer)
				text.text  = parseTime(this.state.roundTimer)				
			}
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
		
		// Update the timer		
		if (this.entityTimer && this.state.roundTimer != undefined) {
			const timer = TextShape.getMutable(this.entityTimer)
			timer.text = parseTime(this.state.roundTimer)		
		}
		
		// Update the status
		if (this.entityStatus) {
			const status = TextShape.getMutable(this.entityStatus)
			status.text = this.state.roundInProgress ? "Match in progress" : "Waiting to start..."
		}
		
		// Get the current username
		const player = Networking.GetUserName()
		
		// Start a counter (can't use index because of rankOffset)
		let rowCount = 0
		
		// Loop through each of our score entries and upate the corresponding elements
		for (const [index, entry] of this.state.scores.entries()) {
			
			// Check we've not exceeded the display limit
			if (rowCount >= this.maxScores) { 
				break
			}
			
			// Check if we should skip this record due to the rankOffset
			if (index < this.rankOffset) { 
				continue
			}
			
			const rank  = this.hideRanks ? "" : (index + 1).toString()
			const score = this.hideScores ? "": entry.score.toString()
			const name  = entry.userName == player ? entry.userName+"(You)": entry.userName
			
			const element = this.elements[rowCount]
			element.update(name, rank, score) 
			
			rowCount++
		}
			
	}
	
	
	createElements() {		
		// Create the replacement scoreboard rows
		for (let index = 0; index < this.maxScores; index++) {
			// Create the row transform
			const transform: TransformType = {
				position: Vector3.create(0, (-this.rowHeight * index), 0),
				rotation: Quaternion.create(),
				scale   : Vector3.One()
			}
			
			// Create the new row element
			const row = new ScoreboardRow(
				this.entityRoot, 
				transform, 
				this.textSize,
				this.rowWidth
			)
			this.elements.push(row)
		}
	}

	
	// Sort the current state.scores array
	sortScores() {
        if (!this.state) return

		// Check if we need to sort the scores to avoid repeat work
		if(!this.state.storesSorted){
			// Sort the scores array by score value in descending order
			this.state.scores.sort((a: ScoreboardEntry, b: ScoreboardEntry) => b.score - a.score)
			this.state.storesSorted = true
		} else {
			console.log("scores already sorted")
		}
    }
	
}

class ScoreboardRow {
	rootEntity : Entity
	nameEntity : Entity
	scoreEntity: Entity | undefined
	rankEntity : Entity | undefined
	
	private textScale = 0.1
	
	constructor(
		parentEntity: Entity,
		transform   : TransformType,
		textSize    : number,
		rowWidth    : number,
		userName    : string = "",
		score       : string = "",
		rank        : string = "",
	) {
		this.rootEntity  = engine.addEntity()
		this.nameEntity  = engine.addEntity()
		this.rankEntity  = engine.addEntity()	
		this.scoreEntity = engine.addEntity()
		
		// Root transform
		Transform.create(this.rootEntity, {
			...transform,
			parent: parentEntity
		});
		
		//  Player's name
		Transform.create(this.nameEntity, {
			parent  : this.rootEntity,
			scale   : {x: this.textScale, y: this.textScale, z:this.textScale}
		});
		TextShape.create(this.nameEntity,{
			text     : userName,
			fontSize : textSize,
			textAlign: TextAlignMode.TAM_MIDDLE_CENTER,
			textColor: Color4.White(),
		});
		
		//  Rank
		Transform.create(this.rankEntity, {
			parent  : this.rootEntity,
			position: {x: -rowWidth, y: 0, z: 0},
			scale   : {x: this.textScale, y: this.textScale, z:this.textScale}
		});
		TextShape.create(this.rankEntity,{
			text     : rank.toString(),
			fontSize : textSize,
			textAlign: TextAlignMode.TAM_MIDDLE_LEFT,
			textColor: getColorForRank(parseInt(rank)),
		});
		
		//  Score
		Transform.create(this.scoreEntity, {
			parent  : this.rootEntity,
			position: {x: rowWidth, y: 0, z: 0},
			scale   : {x: this.textScale, y: this.textScale, z:this.textScale}
		});
		TextShape.create(this.scoreEntity,{
			text     : score.toString(),
			fontSize : textSize,
			textAlign: TextAlignMode.TAM_MIDDLE_RIGHT,
			textColor: Color4.fromHexString("#A253DA"),
		});
	}
	
	update(
		userName: string = "",
		rank    : string = "",
		score   : string = "",
	) {
		
		// Update the rank
		if (this.nameEntity) {
			const nameText = TextShape.getMutable(this.nameEntity)
			nameText.text = userName
		}
		
		// Update the rank
		if (this.scoreEntity) {
			const scoreText = TextShape.getMutable(this.scoreEntity)
			scoreText.text = score
		}
		
		// Update the rank
		if (this.rankEntity) {
			const rankText = TextShape.getMutable(this.rankEntity)
			rankText.text = rank
			rankText.textColor = getColorForRank(parseInt(rank))
		}
	}
	
	destroy() {
		engine.removeEntity(this.rootEntity)
		engine.removeEntity(this.nameEntity)
		if (this.scoreEntity) { engine.removeEntity(this.scoreEntity) }
		if (this.rankEntity) { engine.removeEntity(this.rankEntity) }
	}
}

// Takes a timestamp ins econds and converts it to m:ss format
export function parseTime(time: number) {
	const minutes = Math.floor(time / 60).toString();
	const seconds = Math.floor(time % 60).toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
}

function getColorForRank(rank: number) {
	if (rank == 1) {
		return Color4.fromHexString("#FFCC00")
	} else if(rank == 2) {
		return Color4.fromHexString("#B4B4B4")
		
	} else if(rank == 3) {
		return Color4.fromHexString("#FFAE4E")
	} else {
		const color    = Color4.fromHexString("#cccccc")
		const val      = rank * 6
		const rankgrey = Color4.fromInts(1, val, val, 0)
		
		return Color4.subtract(Color4.White(), rankgrey)
	}
}
