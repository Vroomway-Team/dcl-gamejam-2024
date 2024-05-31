import { engine } 					from '@dcl/sdk/ecs'
import * as CANNON 					from 'cannon'
import { collidersFromJSON } 		from '../utilities/func.collidersFromJSON'
import { createCannonWorldSystem } 	from '../systems/system.CannonWorld'
import arenaBaseCollidersJSON 		from './arena.colliders.json'

console.log("setupCannonWorld.ts","loaded")
// Setup cannon world and define some settings for it
let _WORLD:CANNON.World;

export function getWorld(){
	if(!_WORLD){
		_WORLD = new CANNON.World()
	}
	return _WORLD
}

// This gets called from index main to setup the world and add all the stuff
export function setupCannonWorld() { 
	const WORLD = getWorld()
	WORLD.gravity.set(0, -20.2, 0)
	
	// Add the systems for Cannon world step
	engine.addSystem(createCannonWorldSystem())
	
	// Add a ground plane, and the colliders for the arena
	addGround(WORLD)
	collidersFromJSON(arenaBaseCollidersJSON, WORLD)
}

// Add a ground to the world and give it a suitable material
function addGround(world: CANNON.World) {
	const WORLD = getWorld()

	// Define a physics material: Ground
	const groundPhysicsMaterial = new CANNON.Material('groundMaterial')
	const groundPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, groundPhysicsMaterial, {
		friction   : 1,
		restitution: 1
	})
	WORLD.addContactMaterial(groundPhysicsContactMaterial)

	// Create a ground plane and apply physics material
	const groundBody: CANNON.Body = new CANNON.Body({ 
		mass    : 0,
		shape   : new CANNON.Plane(),
		material: groundPhysicsMaterial,
	})
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis
	WORLD.addBody(groundBody)	
}
