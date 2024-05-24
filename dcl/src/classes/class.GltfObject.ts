import { ColliderLayer, Entity, GltfContainer, 
	Transform, TransformType, engine 
} 	from '@dcl/sdk/ecs'

// glTF object class to simplify spawning 

export class GltfObject {
	
	public entity: Entity
	
	constructor(
		modelPath              : string, 
		transform              : TransformType,
		invisibleMeshCollisions: ColliderLayer = ColliderLayer.CL_PHYSICS,
		visibleMeshCollisions  : ColliderLayer = ColliderLayer.CL_POINTER,
		
	) {
		this.entity = engine.addEntity()
		
		Transform.create(this.entity, transform)
		
		GltfContainer.create(this.entity, {
			src                         : modelPath, 
			visibleMeshesCollisionMask  : visibleMeshCollisions,
			invisibleMeshesCollisionMask: invisibleMeshCollisions,
		})
	}
}
