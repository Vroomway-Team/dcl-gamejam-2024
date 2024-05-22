import { InputAction, PointerEventType, Schemas, Transform, engine, inputSystem, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import * as CANNON from 'cannon'
import { collidersFromJSON } from '../utilities/func.collidersFromJSON'

import colliderJSON from '../arena-colliders.json'
import { Vehicle } from '../classes/class.Vehicle'
import { VEHICLE_MANAGER } from './setupVehicleManager'
import { CannonWorldSystem } from '../systems/system.CannonWorld'

// Setup cannon world and define some settings for it
export const WORLD = new CANNON.World()

// This gets called from index main to setup the world and add all the stuff
export function setupCannonWorld() { 
	WORLD.gravity.set(0, -20.2, 0)
	
	// Add the systems for monitoring player input/vehicle movement, and the world step
	engine.addSystem(CannonWorldSystem)
	
	// Add a ground plane, and the colliders for the arena
	addGround(WORLD)
	collidersFromJSON(colliderJSON, WORLD)
	
	// Add a single vehicle
/* 	const vehicle = new Vehicle(VEHICLE_MANAGER, 0, WORLD, {
		position: Vector3.create(32, 1, 32),
		rotation: Quaternion.create(),
		scale   : Vector3.One()
	}, {
		position: Vector3.create(32, 5, 32),
		rotation: Quaternion.create(),
		scale   : Vector3.One()
	}, "assets/gltf/speedster.gltf") */
}


// Add a ground to the world and give it a suitable material
function addGround(world: CANNON.World) {
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
