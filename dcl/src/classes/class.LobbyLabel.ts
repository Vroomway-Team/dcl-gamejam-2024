import { 
	engine, Entity, Font, 
	InputAction, 
	MeshCollider, 
	MeshRenderer, 
	PointerEvents, 
	pointerEventsSystem, 
	PointerEventType, 
	TextShape, Transform, TransformType
} 									from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 		from '@dcl/sdk/math'
import { getPlayer } 				from '@dcl/sdk/src/players'
import { VEHICLE_MANAGER } 			from '../arena/setupVehicleManager'
import { Vehicle } from './class.Vehicle'

export class LobbyLabel {
	entityOrigin: Entity
	entityText  : Entity
	entityMesh  : Entity
	labelIndex  : number
	
	ownerID      : string = "npc"
	ownerName    : string = "npc"
	isLocalPlayer: boolean = false
	
	constructor(
		labelIndex: number,
		origin    : TransformType,
		modelName : string
	) {
		this.labelIndex = labelIndex
		
		// Add the origin entity
		this.entityOrigin = engine.addEntity()
		Transform.create(this.entityOrigin, origin)
		
		// Add the entity used for the text
		this.entityText     = engine.addEntity()
		Transform.create(this.entityText, {
			position: Vector3.create(0, 0, 2.25),
			rotation: Quaternion.fromEulerDegrees(45, 180, 0),
			parent  : this.entityOrigin,
		})
		
		// Add the TextShape
		TextShape.create(this.entityText, {
			text        : "Claim \n" + modelName,
			textColor   : { r: 1, g: 0, b: 0, a: 1 },
			fontSize    : 3,
			font        : Font.F_MONOSPACE,
			shadowBlur  : 4,
			shadowColor : { r: 1, g: 1, b: 0 },
			outlineWidth: 0.1,
			outlineColor: { r: 1, g: 1, b: 1 },
		})
	
		// Add the box entity used as a panel/collider for the input trigger
		this.entityMesh = engine.addEntity()
		Transform.create(this.entityMesh, {
			position: Vector3.create(0, 0, 0.051),
			rotation: Quaternion.create(),
			scale   : Vector3.create(2, 0.8, 0.1),
			parent  : this.entityText,
		})
		MeshRenderer.setBox(this.entityMesh)
		MeshCollider.setBox(this.entityMesh)
		
		// Add the onPointerDown 
		pointerEventsSystem.onPointerDown({
			entity: this.entityMesh,
			opts  : {
				button   : InputAction.IA_POINTER,
				hoverText: "Claim " + modelName
			}
		}, () => {
			this.onButtonPress()
		})
	}
	
	onButtonPress(): void {
		
		const vehicle = VEHICLE_MANAGER.getVehicle(this.labelIndex)
		
		const playerData = getPlayer()
		if (!playerData) return
		
		if (vehicle.isClaimed && vehicle.isLocalPlayer) {
			VEHICLE_MANAGER.userUnclaimVehicle(this.labelIndex)
		} else {
			VEHICLE_MANAGER.userClaimVehicle(this.labelIndex, playerData.userId, playerData.name, true)			
		}
	}
	
	updateState(
		isClaimed    : boolean,
		ownerID      : string,
		ownerName    : string,
		isLocalPlayer: boolean,
		modelName    : string,
	): void {
		this.ownerID       = ownerID
		this.ownerName     = ownerName
		this.isLocalPlayer = isLocalPlayer
		
		if (!isClaimed) {
			// UNclaimed vehicle
			this.setPointerHoverText("Claim " + modelName)
			this.setText("Claim \n" + modelName)
		} else {
			if (isLocalPlayer) {
				// Claimed by local player
				this.setPointerHoverText("Remove Claim")
				this.setText("Remove Claim\n" + modelName)
			} else {
				// Claimed by remote player
				this.setPointerHoverText(" ")
				this.setText(ownerName + "\n" + modelName)
			}
		}
	}
	
	setPointerHoverText(
		text: string
	): void {
		PointerEvents.createOrReplace(this.entityMesh, { pointerEvents: [
			{
			  eventType: PointerEventType.PET_DOWN,
			  eventInfo: {
				button      : InputAction.IA_POINTER,
				showFeedback: true,
				hoverText   : text
			  }
			}
		  ]})
	}
	
	setText(
		text: string = "Claim"
	): void {
		const textShape = TextShape.getMutable(this.entityText)
		textShape.text  = text
	}
}
