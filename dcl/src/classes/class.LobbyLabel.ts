import { 
	ColliderLayer,
	engine, Entity, Font, 
	GltfContainer, 
	InputAction, 
	MeshCollider, 
	MeshRenderer, 
	PointerEvents, 
	pointerEventsSystem, 
	PointerEventType, 
	TextAlignMode, 
	TextShape, Transform, TransformType
} 									from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } 		from '@dcl/sdk/math'
import { getPlayer } 				from '@dcl/sdk/src/players'
import { VEHICLE_MANAGER } 			from '../arena/setupVehicleManager'
import { AudioManager } 			from '../arena/audio-manager'


//interfaces for colyseus
//	player attempts to claim vehicle
export type PlayerClaimCallbackType = (vehicle:number) => void;
//	player attempts to unclaim vehicle
export type PlayerUnclaimCallbackType = () => void;

/** object placed in scene, players interact to claim ownership of a vehicle */
export class LobbyLabel {
	entityOrigin : Entity
	entityOffset : Entity
	entityGltf   : Entity
	entityText   : Entity
	
	labelIndex   : number
	ownerID      : string = "npc"
	ownerName    : string = "npc"
	isLocalPlayer: boolean = false
	
    /** server call to claim a vehicle */
    public static PlayerClaimCallback:undefined|PlayerClaimCallbackType;
    /** server to unclaim a vehicle */
    public static PlayerUnclaimCallback:undefined|PlayerUnclaimCallbackType;
	
	constructor(
		labelIndex: number,
		origin    : TransformType,
		modelName : string
	) {
		this.labelIndex = labelIndex
		
		// Add the origin entity (this is the same as the LobbyTransform for each vehicle)
		this.entityOrigin = engine.addEntity()
		Transform.create(this.entityOrigin, origin)
		
		// Add another entity for the offset (brings it forward into the lobby area)
		this.entityOffset = engine.addEntity()
		Transform.create(this.entityOffset, {
			position: Vector3.create(0, 0, 2.25),
			rotation: Quaternion.fromEulerDegrees(45, 180, 0),
			parent  : this.entityOrigin,
		})
		
		// Add the entity used for the text
		
		this.entityText     = engine.addEntity()
		Transform.create(this.entityText, {
			position: Vector3.create(-1.0, 0, 0),
			parent  : this.entityOffset,
		})
		
		// Add the TextShape
		TextShape.create(this.entityText, {
			text        : "Claim      \n" + modelName,
			textColor   : { r: 1, g: 1, b: 1, a: 1 },
			textAlign   : TextAlignMode.TAM_MIDDLE_CENTER,
			fontSize    : 2,
			font        : Font.F_MONOSPACE,
			lineSpacing : 100,
			paddingLeft: 1,
			shadowBlur  : 4,
			shadowColor : { r: 55/255, g: 173/255, b: 175/255 },
			outlineWidth: 0.1,
			outlineColor: { r: 55/255, g: 173/255, b: 175/255 },
		})		
		
		// Add the glTF shape
		this.entityGltf = engine.addEntity()
		Transform.create(this.entityGltf, {
			position: Vector3.create(0, 0, 0),
			parent  : this.entityOffset,
		})
		GltfContainer.create(this.entityGltf, {
			src: "assets/gltf/claimpad.03.gltf",
			visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
			invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER
		})
		
		// Add the onPointerDown 
		pointerEventsSystem.onPointerDown({
			entity: this.entityGltf,
			opts  : {
				button   : InputAction.IA_POINTER,
				hoverText: "Claim " + modelName
			}
		}, () => {
			this.onButtonPress()
		})
	}
	
	onButtonPress(): void {
		const vehicle = VEHICLE_MANAGER.getVehicle(this.labelIndex)
		
		//play sound effect
		AudioManager.PlaySoundEffect(AudioManager.AUDIO_SFX.INTERACTION_CART_CLAIM);

		const playerData = getPlayer()
		if (!playerData) return
		
		if (vehicle.isClaimed && vehicle.isLocalPlayer) {
			//VEHICLE_MANAGER.userUnclaimVehicle(this.labelIndex);
			if(LobbyLabel.PlayerUnclaimCallback) LobbyLabel.PlayerUnclaimCallback();
		} else { 
			//VEHICLE_MANAGER.userClaimVehicle(this.labelIndex, playerData.userId, playerData.name, true);
			if(LobbyLabel.PlayerClaimCallback) LobbyLabel.PlayerClaimCallback(this.labelIndex);
		}
	}
	
	updateState(
		isClaimed    : boolean,
		ownerID      : string,
		ownerName    : string,
		isLocalPlayer: boolean,
		modelName    : string,
	): void {
		this.ownerID       = ownerID
		this.ownerName     = ownerName
		this.isLocalPlayer = isLocalPlayer
		
		if (!isClaimed) {
			// UNclaimed vehicle
			this.setPointerHoverText("Claim " + modelName)
			this.setText("Claim      \n" + modelName)
		} else {
			if (isLocalPlayer) {
				// Claimed by local player
				this.setPointerHoverText("Remove Claim")
				this.setText("Remove Claim\n" + modelName)
			} else {
				// Claimed by remote player
				this.setPointerHoverText(" ")
				this.setText(ownerName + "     \n" + modelName)
			}
		}
	}
	
	setPointerHoverText(
		text: string
	): void {
		PointerEvents.createOrReplace(this.entityGltf, { pointerEvents: [
			{
			  eventType: PointerEventType.PET_DOWN,
			  eventInfo: {
				button      : InputAction.IA_POINTER,
				showFeedback: true,
				hoverText   : text
			  }
			}
		  ]})
	}
	
	setText(
		text: string = "Claim     "
	): void {
		const textShape = TextShape.getMutable(this.entityText)
		textShape.text  = text
	}
}
