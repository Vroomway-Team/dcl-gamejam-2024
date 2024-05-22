import { Vector3 } from "@dcl/sdk/math";

export interface VehicleState {
	ownerID        : string,       // taken from PlayerData
	ownerName      : string,       // taken from PlayerData
	position       : Vector3,      // taken from DCL entity, applied to cannonBody
	rotation       : Vector3,      // taken from DCL entity, applied to DCL entity
	velocity       : CANNON.Vec3,  // taken from cannonBody, applied to cannonBody
	angularVelocity: CANNON.Vec3,  // taken from cannonBody, applied to cannonBody
	score          : number,       // player score, num tickets/tokens, etc
	isLeading      : boolean       // flag if the vehicle has the highest score
}
