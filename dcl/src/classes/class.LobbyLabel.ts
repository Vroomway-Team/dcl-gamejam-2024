import { 
	engine, Entity, Font, 
	InputAction, 
	MeshCollider, 
	MeshRenderer, 
	pointerEventsSystem, 
	TextShape, Transform, TransformType
} 										from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 			from '@dcl/sdk/math'
import { getPlayer } 					from '@dcl/sdk/src/players'
import { VEHICLE_MANAGER } from '../vehicles/setupVehicleManager'

export class LobbyLabel {
	
	entityText: Entity
	entityMesh: Entity
	labelIndex: number
	
	constructor(
		labelIndex: number,
		parentEntity: Entity,
		text        : string
	) {
		this.labelIndex = labelIndex
		
		// Add the entity used for the text
		this.entityText     = engine.addEntity()
		
		Transform.create(this.entityText, {
			position: Vector3.create(0, 0, 2),
			rotation: Quaternion.fromEulerDegrees(20, 180, 0),
			parent  : parentEntity,
		})
		TextShape.create(this.entityText, {
			text        : text,
			textColor   : { r: 1, g: 0, b: 0, a: 1 },
			fontSize    : 5,
			font        : Font.F_MONOSPACE,
			shadowBlur  : 4,
			shadowColor : { r: 1, g: 1, b: 0 },
			outlineWidth: 0.1,
			outlineColor: { r: 1, g: 1, b: 1 },
		})
	
		// Create the box mesh which the text sits in front of
		this.entityMesh = engine.addEntity()
		Transform.create(this.entityMesh, {
			position: Vector3.create(0, 0, 0.051),
			rotation: Quaternion.create(),
			scale   : Vector3.create(2, 0.8, 0.1),
			parent  : this.entityText,
		})
		MeshRenderer.setBox(this.entityMesh)
		MeshCollider.setBox(this.entityMesh)
		
		this.addPointerEvent(this.entityMesh)
	}
	
	addPointerEvent(
		entity: Entity,
		text  : string = "Claim Vehicle"
	) {
		pointerEventsSystem.onPointerDown({
			entity: entity,
			opts  : {
				button   : InputAction.IA_POINTER,
				hoverText: text
			}
		}, () => {
			VEHICLE_MANAGER.userClaimVehicle(this.labelIndex)
		})
	}
	
	setText(text: string = "Claim") {
		const textShape = TextShape.getMutable(this.entityText)
		textShape.text  = text
	}
}
