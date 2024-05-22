import { Vector3 } from "@dcl/sdk/math"

export function Vec3ToVector3(v: CANNON.Vec3) {
	return Vector3.create(v.x, v.y, v.z)
}

export function Vector3ToVec3(v: Vector3) {
	return new CANNON.Vec3(v.x, v.y, v.z)
}