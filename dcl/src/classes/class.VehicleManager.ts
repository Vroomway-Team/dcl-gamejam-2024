import { engine, Entity, Font, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, TextShape, 
		 Transform, TransformType
}								from "@dcl/sdk/ecs";
import { Vector3, Quaternion } 	from "@dcl/sdk/math";
import { getPlayer } 			from "@dcl/sdk/src/players";

import { Vehicle } 				from "./class.Vehicle";
import { VehicleProperties } 	from "../interfaces/interface.VehicleProperties";
import { LobbyLabel } from "./class.LobbyLabel";

const playerData = getPlayer()

// Vehicle manager sysyetm to manage all vehicles
// Includes: spawning, movement

export class VehicleManager {
	
	private world               : CANNON.World
	private vehicles            : Vehicle[]    = []      // List of spawned Vehicle class instances
	private vehicleProps        : VehicleProperties[] // The vehicle properties used for spawning, eg gltf model, position, stats
	private lobbyLabels         : LobbyLabel[] = []      // The entities with buttons on them used for claiming vehicles
	
	// Delta time history stuff
	private deltaTimeHistory    : number[]     = [] // DEBUG: empty array for crude delta time logging
	private deltaTimeHistorySize: number       = 60 // DEBUG: max history size
	private deltaTimeAverage    : number       = 0  // DEBUG: track the avergae dt over time - used for calculating tween durations
	
	constructor(
		world       : CANNON.World,
		vehicleProps: VehicleProperties[]
	) {
		this.world        = world
		this.vehicleProps = vehicleProps
		
		this.spawnVehicles(this.vehicleProps)
	}
	
	status() {
		console.log("VehicleManager is active with", this.vehicles.length, "controlled vehicles")
		const vehicle = this.vehicles[6]
		//debugger
	}
	
	
	spawnVehicles(vehicles: VehicleProperties[]) {
		vehicles.forEach((vehicleProps, index) => {
			
			//const arenaTransform =  copyTransformWithVerticalOffset(vehicleProps.lobbyTransform, 5)
			
			const vehicle = new Vehicle(
				this, index, this.world,
				vehicleProps.arenaTransform, 
				vehicleProps.lobbyTransform,
				vehicleProps.modelSrc,
				vehicleProps.maxSpeed, 
				vehicleProps.maxTurn,
				vehicleProps.acceleration
			)
			this.vehicles.push(vehicle)
			
			const lobbyLabel = new LobbyLabel(index, vehicle.entityPreview, "claim")
			this.lobbyLabels.push(lobbyLabel)
			
		})
	}
	
	
	onRoundStart() {
		
	}
	
	onRoundEnd() {
		
	}
	
	getVehicles(): Vehicle[] {
		return this.vehicles
	}
	
	getPlayerVehicle(userId: string): Vehicle | undefined {
		for (const vehicle of this.vehicles) {
			if (vehicle.ownerID == userId) { 
				return vehicle
			}
		}
		
		return undefined
	}
	
	destroyVehicles() {
		this.vehicles.forEach((vehicle, index) => {
			vehicle.destroy()
		})
	}
	
	resetVehicles() {
		this.vehicles.forEach((vehicle, index) => {
			vehicle.resetTransform()
		})		
	}
	
	userClaimVehicle(vehicleIndex: number) {
		const vehicle = this.vehicles[vehicleIndex]
		const label   = this.lobbyLabels[vehicleIndex]
		
		// Check if the vehicle is elligible to be claimed
		if (vehicle.ownerID == "npc") {
			const playerData = getPlayer()
			if (playerData) {
				
				// Release any vehicles already being controlled by the player
				const currentVehicle = this.getPlayerVehicle(playerData.userId)
				if (currentVehicle !== undefined) {
					this.userUnclaimVehicle(currentVehicle.vehicleID) 
				}
				
				// Assign ownership of the vehicle
				vehicle.setOwner(playerData.userId, playerData.name)
				vehicle.enable()
				
				label.setText(playerData.name)
				// COLYSEUS HOOK
				// Preusmably, at this point we want to sync up to the server that someone
				// has claimed the vehicle
				return true
			} else {
				return false 
			}
			
			
		} else {
			return false
		}
	}
	
	userUnclaimVehicle(vehicleIndex: number) {
		
		const playerData = getPlayer()
		if (!playerData) return false
		
		const vehicle = this.vehicles[vehicleIndex]
		const label   = this.lobbyLabels[vehicleIndex]
		vehicle.clearOwner()
		vehicle.disable()
		label.setText()
		
		
		
		// COLYSEUS HOOK
		// At this point we want to sync up to the server that someone
		// has unclaimed the vehicle
		return true
	}
	
	
	// Crude function to record a history of system delta times, used for debugging.
	recordDeltaTimeHistory(dt: number) {
		if (this.deltaTimeHistory) {
			
			// Add the new record
			this.deltaTimeHistory.push(dt)
			
			// Trim excess records
			if (this.deltaTimeHistory.length > this.deltaTimeHistorySize) {
				this.deltaTimeHistory.shift()
			}
			
			// Update the average
			this.deltaTimeAverage = this.deltaTimeHistory.reduce((total, dt) => total + dt, 0) / this.deltaTimeHistory.length;
			
			console.log("dt average: ", this.deltaTimeAverage * 1000 + "ms")			
		}
	}
	
	getAverageDeltaTime(): number {
		return this.deltaTimeAverage
	}
	
}

function copyTransformWithVerticalOffset(t: TransformType, offset: number) {
	return {
		position: Vector3.create(t.position.x, t.position.y + offset, t.position.z),
		rotation: t.rotation,
		scale   : t.scale
	}
}