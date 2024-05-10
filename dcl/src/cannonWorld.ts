import { InputAction, PointerEventType, Schemas, Transform, engine, inputSystem, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as CANNON from 'cannon'
import { CannonProjectile, cannonEntityMap } from './classes/class.CannonProjectile'

// Setup cannon world and define some settings for it
export const world = new CANNON.World()

const fixedTimeStep: number  = 1.0 / 60 // seconds
const maxSubSteps  : number  = 4 // 4 seems to be enough for smooth movement, might need more if we're dealing with high speed stuff


// This gets called from index main to setup the world and add the required systems
export function setupCannon() { 
	world.gravity.set(0, -9.82, 0)
	
	engine.addSystem(cannonUpdateSystem)
	engine.addSystem(playerInputSystem)
	
	addGround(world)
}

// Add a ground to the world and give it a suitable material
function addGround(world: CANNON.World) {
	// Define a physics material: Ground
	const groundPhysicsMaterial = new CANNON.Material('groundMaterial')
	const groundPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, groundPhysicsMaterial, {
		friction: 1,
		restitution: 1
	})
	world.addContactMaterial(groundPhysicsContactMaterial)

	// Create a ground plane and apply physics material
	const groundBody: CANNON.Body = new CANNON.Body({ 
		mass    : 0,
		shape   : new CANNON.Plane(),
		material: groundPhysicsMaterial,
	})
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis
	world.addBody(groundBody)	
}

// Update function to process the world
function cannonUpdateSystem(dt: number): void {
	// Instruct the world to perform a single step of simulation.
	// It is generally best to keep the time step and iterations fixed.
	world.step(fixedTimeStep, dt, maxSubSteps) 
	
	console.log("World step")
	
	// Next we iterate through all the objects in the cannon world and, if they have an associated DCL 
	// entity, we update its position and rotation to match
	for (const [body, entity] of cannonEntityMap.entries()) {

        const transform = Transform.getMutable(entity);
        if (transform) {
            // Update the position and rotation of the DCL entity to match the Cannon.js body
			
            transform.position = body.position;
            //transform.rotation = body.quaternion;
        }
	}
}

// Player input system to respond to actions, eg firing new projectile
function playerInputSystem(dt: number): void {
	
	if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
		
		console.log("Firing projectile")
		
		const projectileSpeed = 20
		const projectile = new CannonProjectile(world, {
			position: getPlayerPosition(),
			rotation: getCameraRotation(),
			scale   : Vector3.create(0.1, 0.1, 0.1)
		}, projectileSpeed)
    } 
}


// Utility functions to get the player position and camera rotation, used when constructing a new projectile
function getPlayerPosition() {
	// This is messy. There's a better way to do it for sure, but it works for now. 
	if (Transform.has(engine.PlayerEntity)) {
		const verticalOffset = 0.8
		const playerPosition = Transform.getMutable(engine.PlayerEntity).position;
		const position = Vector3.create(playerPosition.x, playerPosition.y + verticalOffset, playerPosition.z);
		return position
	} else {
		return Vector3.Zero()
	}
}

function getCameraRotation(): Quaternion{
	if (Transform.has(engine.CameraEntity)) {
		return Transform.get(engine.CameraEntity).rotation	
	} else {
		return Quaternion.Zero()
	}
}