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
			position       : Vector3.create(46.066, 8.0, 36.851), 
			rotation       : Quaternion.fromEulerDegrees(0, 262.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(46.066, 1.0, 36.851), 
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
			position       : Vector3.create(45.107, 8.0, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 247.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(45.107, 1.0, 40.429), 
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
			position       : Vector3.create(43.255, 8.0, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 232.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(43.255, 1.0, 43.636), 
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
			position       : Vector3.create(40.636, 8.0, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 217.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(40.636, 1.0, 46.255), 
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
			position       : Vector3.create(37.429, 8.0, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 202.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(37.429, 1.0, 48.107), 
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
			position       : Vector3.create(33.851, 8.0, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 187.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(33.851, 1.0, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 187.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.hotwheels.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(30.148, 8.0, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 172.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(30.148, 1.0, 49.066), 
			rotation       : Quaternion.fromEulerDegrees(0, 172.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.speedster.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(26.570, 8.0, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 157.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(26.570, 1.0, 48.107), 
			rotation       : Quaternion.fromEulerDegrees(0, 157.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.hoverboat.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(23.363, 8.0, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 142.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(23.363, 1.0, 46.255), 
			rotation       : Quaternion.fromEulerDegrees(0, 142.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.speedster.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(20.744, 8.0, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 127.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(20.744, 1.0, 43.636), 
			rotation       : Quaternion.fromEulerDegrees(0, 127.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.hotwheels.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(18.892, 8.0, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 112.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(18.892, 1.0, 40.429), 
			rotation       : Quaternion.fromEulerDegrees(0, 112.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.hoverboat.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(17.933, 8.0, 36.851), 
			rotation       : Quaternion.fromEulerDegrees(0, 97.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(17.933, 1.0, 36.851), 
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
			position       : Vector3.create(46.066, 8.0, 27.148), 
			rotation       : Quaternion.fromEulerDegrees(0, 277.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(46.066, 1.0, 27.148), 
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
			position       : Vector3.create(45.107, 8.0, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 292.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(45.107, 1.0, 23.570), 
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
			position       : Vector3.create(43.255, 8.0, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 307.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(43.255, 1.0, 20.363), 
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
			position       : Vector3.create(40.636, 8.0, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 322.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(40.636, 1.0, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 322.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "Ladybug",
		modelSrc        : "assets/gltf/vehicle.laaybug.02.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(37.429, 8.0, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 337.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(37.429, 1.0, 15.892), 
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
			position       : Vector3.create(33.851, 8.0, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 352.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(33.851, 1.0, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 352.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.hotwheels.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(30.148, 8.0, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 367.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(30.148, 1.0, 14.933), 
			rotation       : Quaternion.fromEulerDegrees(0, 367.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.hoverboat.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(26.570, 8.0, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 382.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(26.570, 1.0, 15.892), 
			rotation       : Quaternion.fromEulerDegrees(0, 382.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.speedster.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(23.363, 8.0, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 397.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(23.363, 1.0, 17.744), 
			rotation       : Quaternion.fromEulerDegrees(0, 397.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hotwheels",
		modelSrc        : "assets/gltf/vehicle.hotwheels.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(20.744, 8.0, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 412.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(20.744, 1.0, 20.363), 
			rotation       : Quaternion.fromEulerDegrees(0, 412.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "hoverboat",
		modelSrc        : "assets/gltf/vehicle.hoverboat.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(18.892, 8.0, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 427.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(18.892, 1.0, 23.570), 
			rotation       : Quaternion.fromEulerDegrees(0, 427.5, 0),
			scale          : Vector3.One()
		}
	},
	{
		name            : "speedster",
		modelSrc        : "assets/gltf/vehicle.speedster.01.gltf", 
		acceleration    : 8, 
		maxSpeed        : 16, 
		maxTurn         : 200,
		arenaTransform  : { 
			position       : Vector3.create(17.933, 8.0, 27.148), 
			rotation       : Quaternion.fromEulerDegrees(0, 442.5, 0),
			scale          : Vector3.One()
		}, 
		lobbyTransform  : { 
			position       : Vector3.create(17.933, 1.0, 27.148), 
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
