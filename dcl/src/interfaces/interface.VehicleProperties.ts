import { TransformType } from "@dcl/sdk/ecs";

export interface VehicleProperties {
	name          : string,
	modelSrc      : string,
	acceleration  : number,
	maxSpeed      : number,
	maxTurn       : number,
	arenaTransform: TransformType,
	lobbyTransform: TransformType
}