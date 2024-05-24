import { 
	engine, Entity, Font, 
	InputAction, 
	MeshCollider, 
	MeshRenderer, 
	pointerEventsSystem, 
	TextShape, Transform, TransformType
} 									from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 		from '@dcl/sdk/math'
import { getPlayer } 				from '@dcl/sdk/src/players'
import { VEHICLE_MANAGER } 			from '../arena/setupVehicleManager'

export class LobbyLabel {
	
	entityOrigin: Entity
	entityText  : Entity
	entityMesh  : Entity
	labelIndex  : number
	
	constructor(
		labelIndex: number,
		origin    : TransformType,
		text      : string
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
			text        : text,
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
		this.addClaimButton()
	}
	
	addClaimButton(
		text  : string = "Claim Vehicle"
	): void {
		pointerEventsSystem.onPointerDown({
			entity: this.entityMesh,
			opts  : {
				button   : InputAction.IA_POINTER,
				hoverText: text
			}
		}, () => {
			const playerData = getPlayer()
			if (playerData) {
				VEHICLE_MANAGER.userClaimVehicle(this.labelIndex, playerData.userId, playerData.name, true)
			}
		})
	}
	
	addUnclaimButton(
		text: string = "Remove Claim"
	): void {
		pointerEventsSystem.onPointerDown({
			entity: this.entityMesh,
			opts  : {
				button   : InputAction.IA_POINTER,
				hoverText: text
			}
		}, () => {
			VEHICLE_MANAGER.userUnclaimVehicle(this.labelIndex)
		})
	}
	
	removeClaimButton(): void {
		pointerEventsSystem.removeOnPointerDown(this.entityMesh)
	}
	
	setText(
		text: string = "Claim"
	): void {
		const textShape = TextShape.getMutable(this.entityText)
		textShape.text  = text
	}
}
