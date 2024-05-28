import { engine } 					from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } 		from "@dcl/sdk/math"

import { WORLD } 					from "./setupCannonWorld";
import { VehicleInputSystem } 		from '../systems/system.VehicleInputSystem'
import { VehicleMovementSystem } 	from '../systems/system.VehicleMovementSystem'
import { VehicleManager } 			from "../classes/class.VehicleManager";
import { VehicleProperties } 		from "../interfaces/interface.VehicleProperties"

const vehicles: VehicleProperties[] = [
	{
		name            : "Bee",
		modelSrc        : "assets/gltf/vehicle.bee.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(46.066, 9.75, 36.851), 
			rotation       : Quaternion.fromEulerDegrees(0, 262.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(46.066, 2.5, 36.851), 
			rotation       : Quaternion.fromEulerDegrees(0, 262.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Cage",
		modelSrc        : "assets/gltf/vehicle.cage.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(45.107, 9.75, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 247.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(45.107, 2.5, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 247.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Dino",
		modelSrc        : "assets/gltf/vehicle.dino.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(43.255, 9.75, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 232.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(43.255, 2.5, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 232.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Heart",
		modelSrc        : "assets/gltf/vehicle.heart.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(40.636, 9.75, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 217.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(40.636, 2.5, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 217.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Ladybug",
		modelSrc        : "assets/gltf/vehicle.ladybug.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(37.429, 9.75, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 202.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(37.429, 2.5, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 202.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Turtle",
		modelSrc        : "assets/gltf/vehicle.turtle.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(33.851, 9.75, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 187.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(33.851, 2.5, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 187.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.biplane.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(30.148, 9.75, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 172.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(30.148, 2.5, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 172.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.cat.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(26.570, 9.75, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 157.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(26.570, 2.5, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 157.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.donut.blue.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(23.363, 9.75, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 142.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(23.363, 2.5, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 142.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.hotwheels.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(20.744, 9.75, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 127.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(20.744, 2.5, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 127.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.hoverboat.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(18.892, 9.75, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 112.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(18.892, 2.5, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 112.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.speedster.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(17.933, 9.75, 36.851), 
			rotation       : Quaternion.fromEulerDegrees(0, 97.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(17.933, 2.5, 36.851), 
			rotation       : Quaternion.fromEulerDegrees(0, 97.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Bee",
		modelSrc        : "assets/gltf/vehicle.bee.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(46.066, 9.75, 27.148), 
			rotation       : Quaternion.fromEulerDegrees(0, 277.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(46.066, 2.5, 27.148), 
			rotation       : Quaternion.fromEulerDegrees(0, 277.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Cage",
		modelSrc        : "assets/gltf/vehicle.cage.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(45.107, 9.75, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 292.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(45.107, 2.5, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 292.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Dino",
		modelSrc        : "assets/gltf/vehicle.dino.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(43.255, 9.75, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 307.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(43.255, 2.5, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 307.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Heart",
		modelSrc        : "assets/gltf/vehicle.heart.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(40.636, 9.75, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 322.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(40.636, 2.5, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 322.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Ladybug",
		modelSrc        : "assets/gltf/vehicle.ladybug.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(37.429, 9.75, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 337.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(37.429, 2.5, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 337.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Turtle",
		modelSrc        : "assets/gltf/vehicle.turtle.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(33.851, 9.75, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 352.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(33.851, 2.5, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 352.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.biplane.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(30.148, 9.75, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 367.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(30.148, 2.5, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 367.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.cat.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(26.570, 9.75, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 382.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(26.570, 2.5, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 382.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.donut.hotpink.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(23.363, 9.75, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 397.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(23.363, 2.5, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 397.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.hotwheels.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(20.744, 9.75, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 412.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(20.744, 2.5, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 412.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.hoverboat.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(18.892, 9.75, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 427.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(18.892, 2.5, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 427.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.speedster.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(17.933, 9.75, 27.148), 
			rotation       : Quaternion.fromEulerDegrees(0, 442.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(17.933, 2.5, 27.148), 
			rotation       : Quaternion.fromEulerDegrees(0, 442.5, 0),
			scale          : Vector3.One()
		}
	},
]

export function setupVehicleManager() { 
	console.log("setupVehicleManager")
	
	engine.addSystem(VehicleInputSystem)	
	engine.addSystem(VehicleMovementSystem)	
	
	VEHICLE_MANAGER.status()
}

export const VEHICLE_MANAGER = new VehicleManager(WORLD, vehicles)
