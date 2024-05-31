import { Animator, ColliderLayer, Entity, GltfContainer, 
	Transform, TransformType, engine 
} 	from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// glTF object class to simplify spawning 
export class GltfObjectAnimated {
	
	public entity: Entity
	public clipName: string
	
	constructor(
		modelPath: string, 
		transform: TransformType,
		clipName : string		
	) {
		this.entity   = engine.addEntity()
		this.clipName = clipName
		
		Transform.create(this.entity, transform)
		
		GltfContainer.create(this.entity, {
			src: modelPath
		})
		
		Animator.create(this.entity, {
			states: [
				{
					clip   : this.clipName,
					playing: false,
					loop   : false,
				},
			],
		})
	}
	
	animateOnce() {
		Animator.playSingleAnimation(this.entity, this.clipName)
	}
}
