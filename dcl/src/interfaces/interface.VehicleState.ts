import { Vector3 } from "@dcl/sdk/math";

export interface VehicleState {
	ownerID        : string,       // taken from PlayerData
	ownerName      : string,       // taken from PlayerData
	position       : Vector3,      // taken from DCL entity, applied to cannonBody
	rotation       : Vector3,      // taken from DCL entity, applied to DCL entity
	velocity       : CANNON.Vec3,  // taken from cannonBody, applied to cannonBody
	angularVelocity: CANNON.Vec3,  // taken from cannonBody, applied to cannonBody
	score          : number,       // player score, num tickets/tokens, etc
	rank           : number        // current ranking for this vehicle. lower is better, starts at 1
}
