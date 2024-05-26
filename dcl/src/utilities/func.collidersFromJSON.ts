import CANNON from 'cannon';

import { CannonCollider } from '../interfaces/interface.CannonCollider'

// Main JSON -> mesh parser
export function collidersFromJSON(
	colliders: CannonCollider[],
	world    : CANNON.World
): void {

	// Loop through each collider in the array and create the appropriate shape
	colliders.forEach((collider, index) => {

		console.log("Creating collider ", index, collider.obj_name, collider)

		// ██████╗  █████╗ ███████╗██╗ ██████╗███████╗
		// ██╔══██╗██╔══██╗██╔════╝██║██╔════╝██╔════╝
		// ██████╔╝███████║███████╗██║██║     ███████╗
		// ██╔══██╗██╔══██║╚════██║██║██║     ╚════██║
		// ██████╔╝██║  ██║███████║██║╚██████╗███████║
		// ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝╚══════╝
		//
		
		const cannonObj = new CANNON.Body({
			mass    : collider.mass,
			position: new CANNON.Vec3(collider.position[0], collider.position[1], collider.position[2]),
		});

		// Passive RB's are done by setting mass to 0.
		if (collider.type == "PASSIVE") {
			cannonObj.mass = 0
			cannonObj.type = CANNON.Body.STATIC
		}

		
		// ███╗   ███╗ █████╗ ████████╗███████╗██████╗ ██╗ █████╗ ██╗     
		// ████╗ ████║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗██║     
		// ██╔████╔██║███████║   ██║   █████╗  ██████╔╝██║███████║██║     
		// ██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  ██╔══██╗██║██╔══██║██║     
		// ██║ ╚═╝ ██║██║  ██║   ██║   ███████╗██║  ██║██║██║  ██║███████╗
		// ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝
		//
		// Set up physics material. Note this means a unique material is created for each object, even when they share the same properties.
		// Not sure if this is bad practice in cannon, will address if it becomes a problem
		const material       = new CANNON.Material(collider.obj_name + "_physicsMaterial");
		material.friction    = collider.friction;
		material.restitution = collider.restitution;
		cannonObj.material   = material;

		// Handle the various possible shapes:

		
		// ██████╗  ██████╗ ██╗  ██╗
		// ██╔══██╗██╔═══██╗╚██╗██╔╝
		// ██████╔╝██║   ██║ ╚███╔╝ 
		// ██╔══██╗██║   ██║ ██╔██╗ 
		// ██████╔╝╚██████╔╝██╔╝ ██╗
		// ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
		//
		
		if (collider.shape == "BOX" && collider.dimensions && collider.rotation) {

			// Create the box shape. Note Box constructor takes half lengths
			const boxShape = new CANNON.Box(new CANNON.Vec3(
				collider.dimensions[0] / 2,
				collider.dimensions[1] / 2,
				collider.dimensions[2] / 2
			));

			// Convert and apply rotation
			const quat = new CANNON.Quaternion(collider.rotation[0],
				collider.rotation[1],
				collider.rotation[2],
				collider.rotation[3]);
			cannonObj.quaternion.copy(quat)

			// Add it to the object, and add the object to the world
			cannonObj.addShape(boxShape);
			world.addBody(cannonObj);
		}
		

		// ███████╗██████╗ ██╗  ██╗███████╗██████╗ ███████╗
		// ██╔════╝██╔══██╗██║  ██║██╔════╝██╔══██╗██╔════╝
		// ███████╗██████╔╝███████║█████╗  ██████╔╝█████╗  
		// ╚════██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗██╔══╝  
		// ███████║██║     ██║  ██║███████╗██║  ██║███████╗
		// ╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
		//
		
		if (collider.shape == "SPHERE" && collider.radius) {

			// Create a sphere - pretty simple.
			const sphereShape = new CANNON.Sphere(collider.radius);

			// Add it to the object, and add the object to the world
			cannonObj.addShape(sphereShape);
			world.addBody(cannonObj);
		}

		
		// ███╗   ███╗███████╗███████╗██╗  ██╗
		// ████╗ ████║██╔════╝██╔════╝██║  ██║
		// ██╔████╔██║█████╗  ███████╗███████║
		// ██║╚██╔╝██║██╔══╝  ╚════██║██╔══██║
		// ██║ ╚═╝ ██║███████╗███████║██║  ██║
		// ╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
		//
		
		else if (collider.shape == "MESH" && collider.vertices && collider.indices) {

			// Set up the trimesh
			const trimesh = new CANNON.Trimesh(collider.vertices, collider.indices)

			// Add it to the object, and add the object to the world
			cannonObj.addShape(trimesh);
			world.addBody(cannonObj);
		}
	});
}
