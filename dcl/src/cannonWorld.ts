import { InputAction, PointerEventType, Schemas, Transform, engine, inputSystem, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as CANNON from 'cannon'
import { CannonVehicle, CannonVehicleInputSystem } from './classes/class.CannonVehicle'
import { collidersFromJSON } from './utilities/func.collidersFromJSON'

import colliderJSON from './arena-colliders.json'

// Setup cannon world and define some settings for it
export const world = new CANNON.World()
export let cannonVehicle: CannonVehicle

const fixedTimeStep: number  = 1.0 / 60 // seconds
const maxSubSteps  : number  = 4 // 4 seems to be enough for smooth movement, might need more if we're dealing with high speed stuff

// System for stepping/updating the the Cannon World
function CannonWorldStep(dt: number): void {
	// Instruct the world to perform a single step of simulation.
	// It is generally best to keep the time step and iterations fixed.
	world.step(fixedTimeStep, dt, maxSubSteps) 
}

// This gets called from index main to setup the world and add all the stuff
export function setupCannonWorld() { 
	world.gravity.set(0, -20.2, 0)
	
	// Add the systems for monitoring player input/vehicle movement, and the world step
	engine.addSystem(CannonVehicleInputSystem)	
	engine.addSystem(CannonWorldStep)
	
	// Add a ground plane, and the colliders for the arena
	addGround(world)
	collidersFromJSON(colliderJSON, world)
	
	// Add a single vehicle
	cannonVehicle = new CannonVehicle(world, {
		position: Vector3.create(37, 12, 32),
		rotation: Quaternion.create(),
		scale   : Vector3.One()
	}, "assets/gltf/speedster.gltf")
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
