import { WORLD } from "../vehicles/setupCannonWorld"

// World step settings
const fixedTimeStep: number  = 1.0 / 60 // seconds
const maxSubSteps  : number  = 4 // 4 seems to be enough for smooth movement, might need more if we're dealing with high speed stuff

// System for stepping/updating the the Cannon World
export function CannonWorldSystem(dt: number): void {
	// Instruct the world to perform a single step of simulation.
	// It is generally best to keep the time step and iterations fixed.
	
	if (WORLD) {
		WORLD.step(fixedTimeStep, dt, maxSubSteps) 
	}
}