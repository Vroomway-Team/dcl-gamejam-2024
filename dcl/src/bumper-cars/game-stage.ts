import { Entity, engine, MeshRenderer, MeshCollider, GltfContainer, Transform, Material, inputSystem, InputAction, PointerEventType, TransformType } from '@dcl/sdk/ecs';
import { Vector3, Color4, Quaternion } from '@dcl/sdk/math';
import * as CANNON from 'cannon/build/cannon'

export module GameStage {

  const options = {
    radius: 0.5,
    directionLocal: new CANNON.Vec3(0, 0, -1),
    suspensionStiffness: 30,
    suspensionRestLength: 0.4,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, 1, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true
  }


  let forwardForce: number = 0.0;
  let steerValue: number = 0.0;

  const TURN_RATE_MAX: number = 0.5;

  const SPEED_UP:number = 125;
  const SPEED_DOWN:number = 350;
  const SPEED_MAX:number = 120;
  
  const BRAKE_FORCE: number = 175;
  
  export function MoveVehicle(pos:Vector3) {
    cannonVehicleBody.position.set(pos.x, pos.y, pos.z);
  }
  

  //demo boxes
  //  create box entities/meshes
  const boxStart:Vector3 = { x:27, y:11, z:52 };
  const blue = Color4.fromInts(21, 105, 195, 255);
  const black = Color4.fromInts(35, 35, 35, 255);
  const boxes: Entity[] = [] // Store boxes
  const boxBodies: CANNON.Body[] = [] // Store box bodies
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 6; j++) {
      //create entity
      const box: Entity = engine.addEntity();
      MeshRenderer.setBox(box);
      MeshCollider.setBox(box);
      Transform.create(box, {
        position: Vector3.create(boxStart.x+(j*2), boxStart.y+(i*2), boxStart.z),
        scale: Vector3.create(2, 2, 2)
      });
      //define box colour
      if (i % 2 == 0) {
        if (j % 2 == 0) {
          Material.setPbrMaterial(box, {
            albedoColor: blue,
            roughness: 0.5
          });
        } else {
          Material.setPbrMaterial(box, {
            albedoColor: black,
            roughness: 0.5
          });
        }
      } else {
        if (j % 2 == 0) {
          Material.setPbrMaterial(box, {
            albedoColor: black,
            roughness: 0.5
          });
        } else {
          Material.setPbrMaterial(box, {
            albedoColor: blue,
            roughness: 0.5
          });
        }
      }
      //add to collections
      boxes.push(box);
    }
  }

  //vehicle setup
  /** vehicle body */
  const entityVehicleBody: Entity = engine.addEntity()
  GltfContainer.create(entityVehicleBody, {
    src: ''//'models/carBody.glb'
  })
  Transform.create(entityVehicleBody)
  /** vehicle wheels */
  const entityVehicleWheels: Entity[] = []
  const vehicleWheelPositions: Vector3[] = [
    Vector3.create(2, 1.5, 0),
    Vector3.create(2, -1.5, 0),
    Vector3.create(-2.1, 1.5, 0),
    Vector3.create(-2.1, -1.5, 0)
  ]
  for (let i = 0; i < vehicleWheelPositions.length; i++) {
    const wheel: Entity = engine.addEntity()
    if (i % 2 == 0) {
      GltfContainer.create(wheel, {
        src: 'models/carWheelRight.glb'
      })
    } else {
      GltfContainer.create(wheel, {
        src: 'models/carWheelLeft.glb'
      })
    }

    Transform.create(wheel, { position: vehicleWheelPositions[i] })
    entityVehicleWheels.push(wheel)
  }

  //setup cannon's world
  const world: CANNON.World = new CANNON.World()
  world.broadphase = new CANNON.SAPBroadphase(world)
  world.gravity.set(0, -9.82, 0) // m/s²
  world.defaultContactMaterial.friction = 0

  const groundMaterial: CANNON.Material = new CANNON.Material('groundMaterial')
  const wheelMaterial: CANNON.Material = new CANNON.Material('wheelMaterial')
  const wheelGroundContactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    friction: 0.5,
    restitution: 0,
    contactEquationStiffness: 1000
  })
  world.addContactMaterial(wheelGroundContactMaterial)

  const boxMaterial: CANNON.Material = new CANNON.Material('boxMaterial')
  const boxToGroundContactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(groundMaterial, boxMaterial, {
    friction: 1,
    restitution: 1
  })
  world.addContactMaterial(boxToGroundContactMaterial)
  const boxToBoxContactMaterial: CANNON.ContactMaterial = new CANNON.ContactMaterial(boxMaterial, boxMaterial, {
    friction: 0.7,
    restitution: 0.5
  })
  world.addContactMaterial(boxToBoxContactMaterial)

  // Create bodies to represent each of the box
  for (let i = 0; i < boxes.length; i++) {
    let boxTransform: TransformType = Transform.get(boxes[i])
    const boxBody: CANNON.Body = new CANNON.Body({
      mass: 2, // kg
      position: new CANNON.Vec3(boxTransform.position.x, boxTransform.position.y, boxTransform.position.z), // m
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)) // m
    })

    boxBody.material = boxMaterial
    boxBody.linearDamping = 0.5
    boxBody.angularDamping = 0.5

    world.addBody(boxBody) // Add body to the world
    boxBodies.push(boxBody)
  }

  // Create a ground plane and apply physics material
  const groundBody: CANNON.Body = new CANNON.Body({
    position: new CANNON.Vec3(0, 8.75, 0),
    mass: 0 // mass == 0 makes the body static
  })
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis

  const groundShape: CANNON.Plane = new CANNON.Plane()
  groundBody.addShape(groundShape)
  groundBody.material = groundMaterial
  world.addBody(groundBody)

  const chassisShape: CANNON.Box = new CANNON.Box(new CANNON.Vec3(7.2 / 2, 3.3 / 2, 1.7 / 2)) // Dimensions is from the center
  const cannonVehicleBody: CANNON.Body = new CANNON.Body({ mass: 150 })
  cannonVehicleBody.addShape(chassisShape)
  cannonVehicleBody.position.set(8, 4, 8) //vehicle start pos
  //const rot = Quaternion.fromEulerDegrees(-90,180,0);
  //cannonVehicleBody.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  cannonVehicleBody.angularVelocity.set(-1.5, 0.0, 1.5)

  // Create the vehicle
  const vehicle: CANNON.RaycastVehicle = new CANNON.RaycastVehicle({
    chassisBody: cannonVehicleBody
  })

  // Set the wheel bodies positions
  for (let i = 0; i < vehicleWheelPositions.length; i++) {
    options.chassisConnectionPointLocal.set(vehicleWheelPositions[i].x, vehicleWheelPositions[i].y, vehicleWheelPositions[i].z)
    vehicle.addWheel(options)
  }
  vehicle.addToWorld(world)

  //create cannon links for wheels
  const wheelBodies: CANNON.Body[] = []
  for (let i = 0; i < vehicle.wheelInfos.length; i++) {
    let wheel = vehicle.wheelInfos[i]
    let cylinderShape: CANNON.Cylinder = new CANNON.Cylinder(
      wheel.radius ?? options.radius,
      wheel.radius ?? options.radius,
      wheel.radius ?? options.radius / 2,
      20
    )
    let wheelBody: CANNON.Body = new CANNON.Body({
      mass: 0
    })
    wheelBody.type = CANNON.Body.KINEMATIC
    wheelBody.collisionFilterGroup = 0 // turn off collisions
    let q: CANNON.Quaternion = new CANNON.Quaternion()
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
    wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q)
    wheelBodies.push(wheelBody)
    world.addBody(wheelBody)
  }

  const fixedTimeStep: number = 1.0 / 60.0 // seconds
  const maxSubSteps: number = 3

  /**  */
  function updateSystem(dt: number) {
    // Instruct the world to perform a single step of simulation.
    // It is generally best to keep the time step and iterations fixed.
    world.step(fixedTimeStep, dt, maxSubSteps)

    // Position and rotate the boxes in the scene to match their cannon world counterparts
    for (let i = 0; i < boxes.length; i++) {
      let boxTransform = Transform.getMutable(boxes[i])
      boxTransform.position = boxBodies[i].position
      boxTransform.rotation = boxBodies[i].quaternion
    }

    //update wheel transforms
    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i)
      let t: CANNON.Transform | undefined = vehicle.wheelInfos[i].worldTransform
      let wheelBody: CANNON.Body = wheelBodies[i]
      if (t) {
        wheelBody.position.copy(t.position)
        wheelBody.quaternion.copy(t.quaternion)
      }
      let wheelTransform = Transform.getMutable(entityVehicleWheels[i])
      wheelTransform.position = wheelBody.position
      wheelTransform.rotation = wheelBody.quaternion
    }

    // Modifying the wheels position and rotation needs to happen before the chassis
    let vehicleTransform = Transform.getMutable(entityVehicleBody)
    vehicleTransform.position = cannonVehicleBody.position
    vehicleTransform.rotation = cannonVehicleBody.quaternion
  }
  engine.addSystem(updateSystem)

  function updateDriveSystem() {
    // Forward force
    vehicle.applyEngineForce(forwardForce, 2)
    vehicle.applyEngineForce(forwardForce, 3)

    // Steering
    vehicle.setSteeringValue(steerValue, 0)
    vehicle.setSteeringValue(steerValue, 1)

    // Braking
    // Press E and F Keys together
    if (isPressed_E && isPressed_F) {
      vehicle.setBrake(BRAKE_FORCE, 0)
      vehicle.setBrake(BRAKE_FORCE, 1)
      vehicle.setBrake(BRAKE_FORCE, 2)
      vehicle.setBrake(BRAKE_FORCE, 3)
    } else {
      vehicle.setBrake(0, 0)
      vehicle.setBrake(0, 1)
      vehicle.setBrake(0, 2)
      vehicle.setBrake(0, 3)
    }
  }
  engine.addSystem(updateDriveSystem)

  //user input controls
  let isPressed_Pointer = false
  let isPressed_E = false
  let isPressed_F = false
  //time processing for user inputs
  engine.addSystem(() => {
    const pointerDown = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
    if (pointerDown) {
      isPressed_Pointer = true
    }

    const pointerUp = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_UP)
    if (pointerUp) {
      isPressed_Pointer = false
    }

    const primaryDown = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
    if (primaryDown) {
      isPressed_E = true
    }

    const primaryUp = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_UP)
    if (primaryUp) {
      isPressed_E = false
    }

    const secondaryDown = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)
    if (secondaryDown) {
      isPressed_F = true
    }

    const secondaryUp = inputSystem.getInputCommand(InputAction.IA_SECONDARY, PointerEventType.PET_UP)
    if (secondaryUp) {
      isPressed_F = false
    }
  })

  /** button controls */
  function ButtonChecker(dt: number) {
    //console.log(forwardForce)
    if (isPressed_Pointer) {
      // Accelerate
      if (forwardForce > - SPEED_MAX) forwardForce -= SPEED_UP * dt
    } else {
      // Decelerate
      if (forwardForce < 0) {
        forwardForce += SPEED_DOWN * dt
      } else {
        forwardForce = 0
      }
    }

    //'E' key => turn left
    if (isPressed_E && steerValue > -TURN_RATE_MAX) {
      steerValue -= 1 * dt
    }
    //'F' key => turn right
    if (isPressed_F && steerValue < TURN_RATE_MAX) {
      steerValue += 1 * dt
    }
    //neither key => return to forward
    if(!isPressed_E && !isPressed_F) {
      if(steerValue>0) steerValue -= 0.1 * dt
      if(steerValue<0) steerValue += 0.1 * dt
    }
  }
  engine.addSystem(ButtonChecker)

  //add a character lock to vehicle body
  const playerLock:Entity = engine.addEntity();
  MeshCollider.setBox(playerLock);
  Transform.create(playerLock, {
    parent: entityVehicleBody,
    position: {x:-0.3,y:-0.5,z:1},
    scale: {x:0,y:0,z:0},
    rotation: Quaternion.fromEulerDegrees(0,0,0)
  });

  //lock display obj
  const playerLockDisplay:Entity = engine.addEntity();
  MeshRenderer.setBox(playerLockDisplay);
  Transform.create(playerLockDisplay, {
    parent: entityVehicleBody,
    position: {x:-0.3,y:-0.5,z:3},
    scale: {x:0.1,y:0.1,z:0.1},
    rotation: Quaternion.fromEulerDegrees(0,0,0)
  });

  //control board
  const playerControls:Entity = engine.addEntity();
  MeshCollider.setBox(playerControls);
  MeshRenderer.setBox(playerControls);
  Transform.create(playerControls, {
    parent: entityVehicleBody,
    position: {x:0.2,y:0,z:0.2},
    scale: {x:3.2,y:1.6,z:0.01},
    rotation: Quaternion.fromEulerDegrees(0,0,0)
  });

  //add player control system
  engine.addSystem(getPlayerPosition)
}

/** */
function getPlayerPosition() {
  if (!Transform.has(engine.PlayerEntity)) return
  if (!Transform.has(engine.CameraEntity)) return

  //console.log("playerPos: "+Transform.get(engine.PlayerEntity).position.x)

  //player details
  const transPlayer = Transform.get(engine.PlayerEntity)
  const playerPos = transPlayer.position
  const playerRot = transPlayer.rotation

  //camera details
  const transCamera = Transform.get(engine.CameraEntity)
  const CameraPos = transCamera.position
  const CameraRot = transCamera.rotation

  //console.log('playerPos: ', playerPos)
  //console.log('playerRot: ', playerRot)
  //console.log('cameraPos: ', CameraPos)
  //console.log('cameraRot: ', CameraRot)
}