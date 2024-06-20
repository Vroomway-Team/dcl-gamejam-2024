import { Vector3 } from "@dcl/sdk/math";
import * as CANNON from 'cannon-es'

export interface VehicleState {
	isClaimed      : boolean,      // taken from Vehicle instance
	ownerID        : string,       // taken from PlayerData
	ownerName      : string,       // taken from PlayerData
	position       : Vector3,      // taken from DCL entity, applied to cannonBody
	heading        : number,      // taken from DCL entity, applied to DCL entity
	velocity       : CANNON.Vec3,  // taken from cannonBody, applied to cannonBody
	angularVelocity: CANNON.Vec3,  // taken from cannonBody, applied to cannonBody
	score          : number,       // player score, num tickets/tokens, etc
	rank           : number        // current ranking for this vehicle. lower is better, starts at 1
}
