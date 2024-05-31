import { Transform, TransformType } 		from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } 	from "@dcl/sdk/math"
import { GltfObjectAnimated } 	from "./class.GltfObjectAnimated"
import * as utils 				from '@dcl-sdk/utils'

type ParticleType = "ticket" | "bump"

interface Particle {
	type  : ParticleType
	entity: GltfObjectAnimated
}

export class ParticleManager {
	
	private particleCount : number     = 10
	private particles     : Particle[] = []

	private ticketSrc     : string = "assets/gltf/particles.ticket-drop.gltf"
	private ticketClipName: string = "Armature.particles.ticket-drop"
	private bumpSrc       : string = "assets/gltf/particles.bump.gltf"
	private bumpClipName  : string = "Armature.particles.bump"
	
	// Where do birds go when it rains?
	private idleTransform: TransformType = {
		position: Vector3.create(10, -10, 10),
		rotation: Quaternion.Zero(),
		scale   : Vector3.One()
	}
	
	private currentIndex: { 
		[key in ParticleType]: number 
	} = {
		ticket: 0,
		bump  : 0
	}

	constructor() {
		this.spawnParticles("ticket", this.particleCount)
		this.spawnParticles("bump", this.particleCount)
	}

	private spawnParticles(
		type : ParticleType, 
		count: number
	) {		
		for (let i = 0; i < count; i++) {
			const entity = this.createEntity(type)
			this.particles.push({ type, entity })
		}
	}

	private createEntity(type: ParticleType): any {
		const src      = type == "ticket" ? this.ticketSrc      : this.bumpSrc
		const clipName = type == "ticket" ? this.ticketClipName : this.bumpClipName
		const gltf     = new GltfObjectAnimated(src, this.idleTransform, clipName)
		return {
			"type"  : type,
			"entity": gltf
		}
	}

	triggerParticleAtPosition(
		type    : ParticleType, 
		position: Vector3
	) {
		const index = this.currentIndex[type]
		const particlesOfType = this.particles.filter(p => p.type === type)
		
		if (particlesOfType.length > 0) {
			const particle = particlesOfType[index]

			if (particle) { 
				const trans = Transform.getMutable(particle.entity.entity)
				trans.position = position
				
				particle.entity.animateOnce()
				console.log("ParticleManager() playing animation")
				
				utils.timers.setTimeout(() => {
					trans.position = this.idleTransform.position
					console.log("ParticleManager() returning to pos")
				}, 1000)
				
				this.currentIndex[type] = (index + 1) % 10
				
			} else {
				console.error(`No particle of type ${type} found at index ${index}`)
			}
		}
	}
	
	debugTestFunc() {
		this.triggerParticleAtPosition("ticket", Vector3.create(30, 1, 28))
		this.triggerParticleAtPosition("bump", Vector3.create(32, 1, 32))
	}
}
