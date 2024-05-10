
import * as CANNON from 'cannon'

import { Entity, MeshRenderer, Schemas, 
		 Transform, TransformType, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 				from '@dcl/sdk/math'

// Define an empty map for cannon bodies and dcl entities
export const cannonEntityMap: Map<CANNON.Body, Entity> = new Map();

// Setup the physics material used for the projectiles
const projectilePhysicsMaterial: CANNON.Material = new CANNON.Material('projectileMaterial')
	projectilePhysicsMaterial.friction = 0.01
	projectilePhysicsMaterial.restitution = 1
	
// Define the Projectile class
export class CannonProjectile {
	entity    : Entity
	cannonBody: CANNON.Body
	
	constructor(
		world    : CANNON.World,
		transform: TransformType,
		speed    : number = 20
	) {
		
		// Set up basic entity with sphere shape
		this.entity = engine.addEntity()
		Transform.create(this.entity, transform)
		MeshRenderer.setSphere(this.entity)
		
		// Set up the cannon sphere body
		const quat = new CANNON.Quaternion(transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w);
		
		this.cannonBody = new CANNON.Body({ 
			mass          : 0.1,
			position      : new CANNON.Vec3(transform.position.x, transform.position.y, transform.position.z),
			quaternion    : quat,
			shape         : new CANNON.Sphere(transform.scale.x),
			material      : projectilePhysicsMaterial,
			linearDamping : 0.8,
			angularDamping: 0.4,
			velocity      : quat.vmult(new CANNON.Vec3(0, 0, 1)).scale(speed)
		})
		
		world.addBody(this.cannonBody)
		
		// Add the body to the entityMap. This gets used by the cannonUpdateSystem to match the positions of 
		// the DCL entities to their cannon counterpart
		cannonEntityMap.set(this.cannonBody, this.entity);
	}
}

