import { engine, Entity, Font,  
	TextShape, 
	Transform, TransformType
}								from "@dcl/sdk/ecs";
import { Vector3, Quaternion } 	from "@dcl/sdk/math";
import { getPlayer } 			from "@dcl/sdk/src/players";
import * as utils 				from '@dcl-sdk/utils'

import { Vehicle } 				from "./class.Vehicle";
import { VehicleProperties } 	from "../interfaces/interface.VehicleProperties";
import { movePlayerTo } 		from "~system/RestrictedActions";
import { VehicleState } 		from "../interfaces/interface.VehicleState";
import { Networking } from "../networking";

const playerData = getPlayer()

// Vehicle manager sysyetm to manage all vehicles
// Includes: spawning, movement between lobby and arena
export class VehicleManager {
	
	private world               : CANNON.World
	private vehicles            : Vehicle[]    = []      // List of spawned Vehicle class instances
	private vehicleProps        : VehicleProperties[] // The vehicle properties used for spawning, eg gltf model, position, stats
	
	// Delta time history stuff
	private deltaTimeHistory    : number[]     = [] // DEBUG: empty array for crude delta time logging
	private deltaTimeHistorySize: number       = 60 // DEBUG: max history size
	private deltaTimeAverage    : number       = 0  // DEBUG: track the avergae dt over time - used for calculating tween durations
	
	roundInProgress : boolean = false
	
	constructor(
		world       : CANNON.World,
		vehicleProps: VehicleProperties[]
	) {
		this.world        = world
		this.vehicleProps = vehicleProps
		
		this.spawnVehicles(this.vehicleProps)
	}
	
	// DEBUG: test func for triggering via debug UI. use for whatever.
	debugTestFunc(): void {
		/* const playerData = getPlayer()
		if (playerData) {
			const vehicle   = this.getPlayerVehicle(playerData.userId)
			debugger			
		} */
	
		this.userClaimVehicle(2, "1a2b3c4d5e", "FakeDave")
	}
	
	// Print simple status
	status(): void {
		console.log("VehicleManager is active with", this.vehicles.length, "controlled vehicles") 
	}
	
	// Main func for spawning in all the vehicle instances, should only ever be triggered once
	spawnVehicles(
		vehicles: VehicleProperties[]
	): void {
		vehicles.forEach((vehicleProps, index) => {			
			const vehicle = new Vehicle(
				this, index, this.world,
				vehicleProps.arenaTransform, 
				vehicleProps.lobbyTransform,
				vehicleProps.modelSrc,
				vehicleProps.name,
				vehicleProps.maxSpeed, 
				vehicleProps.maxTurn,
				vehicleProps.acceleration
			)
			this.vehicles.push(vehicle)			
		})
	}
	
	// COLYSEUS: trigger this on round start
	onRoundStart(): void {
		console.log("onRoundStart")
		
		const duration = 2000
		this.moveVehiclesToArena(duration)
		
		utils.timers.setTimeout(() => {
			this.roundInProgress = true
			this.enableVehicles()
			this.movePlayerToVehicle()
		}, duration)
		
	}
	
	// COLYSEUS: trigger this on round end
	onRoundEnd(): void {
		console.log("onRoundEnd")
		
		this.roundInProgress = false
		this.disableVehicles()
		
		this.moveVehiclesToLobby(2000) 
		this.movePlayerToLobby()
	}
	
	// Enables all vehicles, allowing them to respond to user input and be moved 
	enableVehicles(): void {
		console.log("enableVehicles")
		
		for (const vehicle of this.vehicles) {
			vehicle.enable()
		}
	}
	
	// Disable all vehicles, stopping them from being controlled
	disableVehicles(): void {
		console.log("disableVehicles")
		
		for (const vehicle of this.vehicles) {
			vehicle.disable()
		}
	}
	
	// Get a particular vehicle
	// Mostly used by LobbyLabels when checking ownership
	getVehicle(index: number): Vehicle {
		return this.vehicles[index]
	}
	
	// Get an array of all the vehicles in the scene
	getVehicles(): Vehicle[] {
		return this.vehicles
	}
	
	// Get the vehicle instance which is registered to the given userId
	getPlayerVehicle(
		userId: string
	): Vehicle | undefined {
		for (const vehicle of this.vehicles) {
			if (vehicle.ownerID == userId) { 
				return vehicle
			}
		}
		
		return undefined
	}
	
	// Tell vehicles to move back to their lobby positions (at end of round)
	moveVehiclesToLobby(
		duration: number
	): void {
		console.log("moveVehiclesToLobby")
		
		this.vehicles.forEach((vehicle, index) => {
			vehicle.moveToLobby(duration) 
		})		
	}
	
	// Tell vehicles to move to their arena start positions (at start of round)
	moveVehiclesToArena(
		duration: number
	): void {
		console.log("moveVehiclesToArena")
		
		this.vehicles.forEach((vehicle, index) => {
			vehicle.moveToArena(duration)
		})		
	}
	
	// Teleport the player to the vehicle
	// This is currently done at the start of the round, after the vehicles have moved into position
	movePlayerToVehicle(): void {
		// Get the current userID
		const playerData = getPlayer()
		if (!playerData) { return }
		
		// Get the vehicle
		const vehicle = this.getPlayerVehicle(playerData.userId)
		if (!vehicle) { return }
		
		// Define the target as a position above the vehicle so the player drops into it
		const targetPosition = Vector3.subtract(vehicle.getPosition(), vehicle.entityOffset)
		movePlayerTo({
			newRelativePosition: targetPosition,
			cameraTarget       : Vector3.create(32, 1, 32),
		})
	}
	
	// Teleport the player back to the lobby
	// Might want to do something more fancy here to stop everyone landing on top of one another?
	movePlayerToLobby() {
		const targetPosition = Vector3.create(38, 2.5, 25)		
		movePlayerTo({
			newRelativePosition: targetPosition,
			cameraTarget       : Vector3.create(32, 1, 32),
		})
	}
	
	// Get the current VehicleState for every vehicle
	// COLYSEUS
	getAllVehicleStates(): VehicleState[] {
		const result: VehicleState[] = []
		this.vehicles.forEach((vehicle, index) => {
			result[index] = vehicle.getVehicleState()
		})
		
		return result
		
	}
	
	// Set the current VehicleState for every vehicle
	// Note: this may need additional work to avoid updating the position for the
	// locally controlled vehicle as it'll introduce jitter for the player
	// COLYSEUS
	setAllVehicleStates(
		states: VehicleState[]
	): void {
		states.forEach((state, index) => {
			this.vehicles[index].setVehicleState(state)
		})
	}
	
	// Triggered when a user claims a vehicle - either locally by interacting with the
	// LobbyLabel, or when COLYSEUS tells us that a vehicle has been claimed
	userClaimVehicle(
		vehicleIndex : number,
		userId       : string,
		userName     : string
	): void | boolean {
		
		console.log("userClaimVehicle:", vehicleIndex, userId, userName, Networking.IsUserLocal(userId))
		
		const vehicle = this.vehicles[vehicleIndex]
		
		// Check if the vehicle is elligible to be claimed
		if (vehicle.isClaimed) {
			return false
		}
			
		// Release any vehicles already being controlled by the player
		const currentVehicle = this.getPlayerVehicle(userId)
		if (currentVehicle !== undefined) {
			this.userUnclaimVehicle(currentVehicle.vehicleID)
		}
		
		// Let the vehicle know it has an new owner
		vehicle.setOwner(userId, userName, Networking.IsUserLocal(userId)) 
		
		// COLYSEUS HOOK - let it know the vehicle was claimed
	}
	
	userUnclaimVehicle(
		vehicleIndex: number
	): boolean {
		
		// Let the vehicle know it's now free
		const vehicle = this.vehicles[vehicleIndex]
		console.log("userUnclaimVehicle:", vehicleIndex, vehicle.ownerID, vehicle.ownerName)
		
		vehicle.clearOwner()
		
		// COLYSEUS HOOK
		// At this point we want to sync up to the server that someone
		// has unclaimed the vehicle
		return true
	}
	
	// Crude function to record a history of system delta times, used for debugging.
	recordDeltaTimeHistory(
		dt: number
	): void {
		if (this.deltaTimeHistory) {
			
			// Add the new record
			this.deltaTimeHistory.push(dt)
			
			// Trim excess records
			if (this.deltaTimeHistory.length > this.deltaTimeHistorySize) {
				this.deltaTimeHistory.shift()
			}
			
			// Update the average
			this.deltaTimeAverage = this.deltaTimeHistory.reduce((total, dt) => total + dt, 0) / this.deltaTimeHistory.length;
			
			// console.log("dt average: ", this.deltaTimeAverage * 1000 + "ms")
		}
	}
	
	// Get the current avergae delat time for the scene. 
	getAverageDeltaTime(): number {
		return this.deltaTimeAverage
	}
}
