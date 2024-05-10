import { Entity, engine, Transform, GltfContainer, ColliderLayer, TextShape, Animator, inputSystem, InputAction, PointerEventType, PointerEvents } from "@dcl/sdk/ecs";
import { Color4, Vector3 } from "@dcl/sdk/math";
import { Dictionary, List, SetState, TextShapeDataObject, TRANSFORM_POSITION_OFF, TRANSFORM_POSITION_ON, TRANSFORM_ROTATION_ORIGIN, TRANSFORM_SCALE_OFF, TRANSFORM_SCALE_ON, TransformDataObject } from "./escentials";

/**     MENU 3D ESCENTIALS
    contains streamlined systems for creating 3D menues in decentraland

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/

/** all model paths for menu frames */
export enum MENU_FRAME_TYPES {
    SQUARE = 'models/utilities/menu-panel-square.glb',
    WIDE = 'models/utilities/menu-panel-wide.glb',
}
/** default header height */
export const MENU_HEADER_POSITION:Vector3 = {x:0,y:1.05,z:0};
/** all model paths for menu headers */
export enum MENU_HEADER_TYPES {
    NONE = 'models/utilities/menu-header-bar.glb',
    STANDARD = 'models/utilities/menu-header-standard.glb',
    TALL = 'models/utilities/menu-header-tall.glb',
}
/** all model paths for menu buttons */
export enum MENU_BUTTON_TYPES {
    SQUARE = 'models/utilities/menu-button-square.glb',
    STANDARD = 'models/utilities/menu-button-standard.glb',
    LONG = 'models/utilities/menu-button-long.glb',
}
/** all animation keys for menu buttons */
export enum MENU_BUTTON_ANIMATION_TYPES {
    NONE = -1,
    IDLE = 0,
    WHITE = 1,
    GREEN = 2,
    RED = 3,
}
export const MENU_BUTTON_ANIMATION_KEYS:string[] = [
    "anim-idle",
    "anim-white",
    "anim-green",
    "anim-red",
];

/** management system for 3D menu panels, including frame & header */
export module MenuPanel {

    /** pool of ALL existing objects */
    var pooledObjectsAll:List<MenuPanelObject> = new List<MenuPanelObject>();
    /** pool of active objects (already being used in scene) */
    var pooledObjectsActive:List<MenuPanelObject> = new List<MenuPanelObject>();
    /** pool of inactive objects (not being used in scene) */
    var pooledObjectsInactive:List<MenuPanelObject> = new List<MenuPanelObject>();
    /** registry of all objects in-use, access key is card's play-data key */
    var pooledObjectsRegistry:Dictionary<MenuPanelObject> = new Dictionary<MenuPanelObject>();

    /** attmepts to find an object of the given key. if no object is registered under the given key then 'undefined' is returned. */
    export function GetByKey(key:string):undefined|MenuPanelObject {
        //check for object's existance
        if(pooledObjectsRegistry.containsKey(key)) {
            //return existing object
            return pooledObjectsRegistry.getItem(key);
        }
        //object does not exist, send undefined
        return undefined;
    }

	/** object interface used to define all data required to create a new object */
	export interface MenuPanelObjectCreationData {
        //parent entity
        Parent:Entity
        //panel details
        FrameModel:MENU_FRAME_TYPES;
        HeaderModel:MENU_HEADER_TYPES;
        FrameTransform:TransformDataObject;
        //header text details
        HeaderTransform:TransformDataObject;
        HeaderTextshape:TextShapeDataObject;
	}
    
    /** container for menu panels (including frame, header, and header text) */
    export class MenuPanelObject {
        //keying
        public get Key() { return this.ParentEntity.toString(); }
        //entities
        public ParentEntity:Entity = engine.addEntity();
        public FrameEntity:Entity = engine.addEntity();
        public HeaderEntity:Entity = engine.addEntity();
        public HeaderText:Entity = engine.addEntity();

        //prepare initial object
        constructor() {
            //transform
            Transform.create(this.ParentEntity);
            Transform.create(this.FrameEntity, {parent:this.ParentEntity});
            Transform.create(this.HeaderEntity, {parent:this.ParentEntity});
            Transform.create(this.HeaderText, {parent:this.ParentEntity});
            //textshape
            TextShape.create(this.HeaderText);
        }

        /** initializes this object based on the provided data */
        public Initialize(data:MenuPanelObjectCreationData) {
            //parent
            var transform = Transform.getMutable(this.ParentEntity);
            transform.parent = data.Parent;
            transform.position = TRANSFORM_POSITION_ON;
            transform.scale = TRANSFORM_SCALE_ON;
            transform.rotation = TRANSFORM_ROTATION_ORIGIN;
            //frame
            var transform = Transform.getMutable(this.FrameEntity);
            transform.position = data.FrameTransform.position??TRANSFORM_POSITION_ON;
            transform.scale = data.FrameTransform.scale??TRANSFORM_SCALE_ON;
            transform.rotation = data.FrameTransform.rotation??TRANSFORM_ROTATION_ORIGIN;
            GltfContainer.createOrReplace(this.FrameEntity, {
                src: data.FrameModel,
                visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                invisibleMeshesCollisionMask: undefined
            });
            //header
            var transform = Transform.getMutable(this.HeaderEntity);
            transform.position = data.FrameTransform.position??TRANSFORM_POSITION_ON;
            transform.scale = data.FrameTransform.scale??TRANSFORM_SCALE_ON;
            transform.rotation = data.FrameTransform.rotation??TRANSFORM_ROTATION_ORIGIN;
            GltfContainer.createOrReplace(this.HeaderEntity, {
                src: data.HeaderModel,
                visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                invisibleMeshesCollisionMask: undefined
            });
            //label
            var transform = Transform.getMutable(this.HeaderText);
            transform.position = data.HeaderTransform.position??MENU_HEADER_POSITION;
            transform.scale = data.HeaderTransform.scale??TRANSFORM_SCALE_ON;
            transform.rotation = data.HeaderTransform.rotation??TRANSFORM_ROTATION_ORIGIN;
            TextShape.createOrReplace(this.HeaderText, {
                text:data.HeaderTextshape.text??"",
                fontSize:data.HeaderTextshape.size??12,
                textColor:data.HeaderTextshape.color??Color4.White()
            });
        }

        /** disables this object */
        public Disable() {
            var transform = Transform.getMutable(this.ParentEntity);
            transform.parent = undefined;
            transform.position = TRANSFORM_POSITION_OFF;
            transform.scale = TRANSFORM_SCALE_OFF;
            transform.rotation = TRANSFORM_ROTATION_ORIGIN;
        }
    }

    /** creates a new object (possibily reusing an inactive object) and initializes it with the provided creation data */
    export function Create(data:MenuPanelObjectCreationData):MenuPanelObject {
        //attempt to get an existing inactive object
        var object:undefined|MenuPanelObject = undefined;
        if(pooledObjectsInactive.size() > 0) {
            //get object from listing of inactive objects
            object = pooledObjectsInactive.getItem(pooledObjectsInactive.size()-1);
            pooledObjectsInactive.removeItem(object);
        }
        //if no inactive object was found
        if(object == undefined) {
            //create new object and add it to pooling management
            object = new MenuPanelObject();
            pooledObjectsAll.addItem(object);
        }
        //initialize object with provided creation data
        object.Initialize(data);

        //add object to active collection
        pooledObjectsActive.addItem(object);
        //add object to key-access registry
        pooledObjectsRegistry.addItem(object.Key, object);
        
        //provide object reference
        return object;
    }

    /** disables all objects, hiding them from the scene but retaining them in data & pooling */
    export function DisableAll() {
        //ensure all objects are parsed
        while(pooledObjectsActive.size() > 0) { 
            //small opt by starting at the back b.c of how list is implemented (list keeps order by swapping next item up)
            Disable(pooledObjectsActive.getItem(0));
        }
    }

    /** disables the given object, hiding it from the scene but retaining it in data & pooling */
    export function Disable(object:MenuPanelObject) {
        //remove object from active listings
        pooledObjectsActive.removeItem(object);
        if(pooledObjectsRegistry.containsKey(object.Key)) pooledObjectsRegistry.removeItem(object.Key);
        
        //add object to inactive listing (ensure add is required)
        const posX = pooledObjectsInactive.getItemPos(object);
        if(posX == -1) pooledObjectsInactive.addItem(object);
        
        //disable object
        object.Disable();
    }
}

/** management system for 3D menu buttons, contains a system that automates most of the interaction callback process */
export module MenuButton {

    /** pool of ALL existing objects */
    var pooledObjectsAll:List<MenuButtonObject> = new List<MenuButtonObject>();
    /** pool of active objects (already being used in scene) */
    var pooledObjectsActive:List<MenuButtonObject> = new List<MenuButtonObject>();
    /** pool of inactive objects (not being used in scene) */
    var pooledObjectsInactive:List<MenuButtonObject> = new List<MenuButtonObject>();
    /** registry of all objects in-use, access key is card's play-data key */
    var pooledObjectsRegistry:Dictionary<MenuButtonObject> = new Dictionary<MenuButtonObject>();

    /** attmepts to find an object of the given key. if no object is registered under the given key then 'undefined' is returned. */
    export function GetByKey(key:string):undefined|MenuButtonObject {
        //check for object's existance
        if(pooledObjectsRegistry.containsKey(key)) {
            //return existing object
            return pooledObjectsRegistry.getItem(key);
        }
        //object does not exist, send undefined
        return undefined;
    }

    /** */
    export interface MenuButtonCallback { (instance?:MenuButton.MenuButtonObject):void; }

	/** object interface used to define all data required to create a new object */
	export interface MenuButtonObjectCreationData {
        //parent entity
        Parent:Entity
        //callbacks
        ButtonIndex?:number;
        CursorEnter?:MenuButton.MenuButtonCallback;
        CursorExit?:MenuButton.MenuButtonCallback;
        CursorClick?:MenuButton.MenuButtonCallback;
        //button details
        ButtonModel:MENU_BUTTON_TYPES;
        ButtonTransform:TransformDataObject;
        //label details
        LabelTransform:TransformDataObject;
        LabelTextshape:TextShapeDataObject;
	}
    
    /** container for menu panels (including frame, header, and header text) */
    export class MenuButtonObject {
        //keying
        public get Key() { return this.ParentEntity.toString(); }
        //button data
        public Index:number = -1;
        public State:number = -1;
        //entities
        public ParentEntity:Entity = engine.addEntity();
        public FrameEntity:Entity = engine.addEntity();
        public LabelText:Entity = engine.addEntity();
        //callbacks
        public CallbackCursorEnter = MenuButton.ButtonInteraction_MouseEnter;
        public CallbackCursorExit = MenuButton.ButtonInteraction_MouseExit;
        public CallbackCursorClick = MenuButton.ButtonInteraction_MouseClick;

        //prepare initial object
        constructor() {
            //parent
            Transform.create(this.ParentEntity);
            //frame
            Transform.create(this.FrameEntity, {parent:this.ParentEntity});
            //label
            Transform.create(this.LabelText, {parent:this.ParentEntity});
            TextShape.create(this.LabelText);
        }

        /** initializes this object based on the provided data */
        public Initialize(data:MenuButtonObjectCreationData) {
            //set callback index
            this.Index = data.ButtonIndex??-1;
            this.CallbackCursorEnter = data.CursorEnter??MenuButton.ButtonInteraction_MouseEnter;
            this.CallbackCursorExit = data.CursorExit??MenuButton.ButtonInteraction_MouseExit;
            this.CallbackCursorClick = data.CursorClick??MenuButton.ButtonInteraction_MouseClick;
            //parent
            var transform = Transform.getMutable(this.ParentEntity);
            transform.parent = data.Parent;
            transform.position = TRANSFORM_POSITION_ON;
            transform.scale = TRANSFORM_SCALE_ON;
            transform.rotation = TRANSFORM_ROTATION_ORIGIN;
            //frame
            var transform = Transform.getMutable(this.FrameEntity);
            transform.position = data.ButtonTransform.position??TRANSFORM_POSITION_ON;
            transform.scale = data.ButtonTransform.scale??TRANSFORM_SCALE_ON;
            transform.rotation = data.ButtonTransform.rotation??TRANSFORM_ROTATION_ORIGIN;
            GltfContainer.createOrReplace(this.FrameEntity, {
                src: data.ButtonModel,
                visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                invisibleMeshesCollisionMask: undefined
            });
            Animator.create(this.FrameEntity, {
                states: [
                    {clip:MENU_BUTTON_ANIMATION_KEYS[0], playing:true, speed:1, shouldReset:false, loop:false},
                    {clip:MENU_BUTTON_ANIMATION_KEYS[1], playing:false, speed:1, shouldReset:false, loop:true},
                    {clip:MENU_BUTTON_ANIMATION_KEYS[2], playing:false, speed:1, shouldReset:false, loop:true},
                    {clip:MENU_BUTTON_ANIMATION_KEYS[3], playing:false, speed:1, shouldReset:false, loop:false},
                ]
            });
            PointerEvents.createOrReplace(this.FrameEntity, {
                pointerEvents: [
                  { //mouse enter
                    eventType: PointerEventType.PET_HOVER_ENTER,
                    eventInfo: { button: InputAction.IA_POINTER }
                  },
                  { //mouse leave
                    eventType: PointerEventType.PET_HOVER_LEAVE,
                    eventInfo: { button: InputAction.IA_POINTER }
                  },
                  { //mouse click
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: { button: InputAction.IA_POINTER }
                  },
                  { //key press 'F'
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: { button: InputAction.IA_PRIMARY }
                  },
                ]
            });
            //label
            var transform = Transform.getMutable(this.LabelText);
            transform.position = data.LabelTransform.position??TRANSFORM_POSITION_ON;
            transform.scale = data.LabelTransform.scale??TRANSFORM_SCALE_ON;
            transform.rotation = data.LabelTransform.rotation??TRANSFORM_ROTATION_ORIGIN;
            TextShape.createOrReplace(this.LabelText, {
                text:data.LabelTextshape.text??"",
                fontSize:data.LabelTextshape.size??12,
                textColor:data.LabelTextshape.color??Color4.White()
            });
            //reset button state
            this.SetAnimationState(MENU_BUTTON_ANIMATION_TYPES.IDLE);
        }

        /** sets this object's animation state */
        public SetAnimationState(state:MENU_BUTTON_ANIMATION_TYPES) {
            if(this.State == state) return;

            //iterate through all animations
            for(let i = 0; i < MENU_BUTTON_ANIMATION_KEYS.length; i++) {
                Animator.getClip(this.FrameEntity, MENU_BUTTON_ANIMATION_KEYS[i]).playing = false;
            }

            //turn on targeted animation
            if(state != MENU_BUTTON_ANIMATION_TYPES.NONE) {
                Animator.getClip(this.FrameEntity, MENU_BUTTON_ANIMATION_KEYS[state]).playing = true;
            }

            this.State = state;
        }

        /** disables this object */
        public Disable() {
            var transform = Transform.getMutable(this.ParentEntity);
            transform.parent = undefined;
            transform.position = TRANSFORM_POSITION_OFF;
            transform.scale = TRANSFORM_SCALE_OFF;
            transform.rotation = TRANSFORM_ROTATION_ORIGIN;
        }
    }

    /** creates a new object (possibily reusing an inactive object) and initializes it with the provided creation data */
    export function Create(data:MenuButtonObjectCreationData):MenuButtonObject {
        //attempt to get an existing inactive object
        var object:undefined|MenuButtonObject = undefined;
        if(pooledObjectsInactive.size() > 0) {
            //get object from listing of inactive objects
            object = pooledObjectsInactive.getItem(pooledObjectsInactive.size()-1);
            pooledObjectsInactive.removeItem(object);
        }
        //if no inactive object was found
        if(object == undefined) {
            //create new object and add it to pooling management
            object = new MenuButtonObject();
            pooledObjectsAll.addItem(object);
        }
        //initialize object with provided creation data
        object.Initialize(data);

        //add object to active collection
        pooledObjectsActive.addItem(object);
        //add object to key-access registry
        pooledObjectsRegistry.addItem(object.Key, object);
        
        //provide object reference
        return object;
    }

    /** disables all objects, hiding them from the scene but retaining them in data & pooling */
    export function DisableAll() {
        //ensure all objects are parsed
        while(pooledObjectsActive.size() > 0) { 
            //small opt by starting at the back b.c of how list is implemented (list keeps order by swapping next item up)
            Disable(pooledObjectsActive.getItem(0));
        }
    }

    /** disables the given object, hiding it from the scene but retaining it in data & pooling */
    export function Disable(object:MenuButtonObject) {
        //remove object from active listings
        pooledObjectsActive.removeItem(object);
        if(pooledObjectsRegistry.containsKey(object.Key)) pooledObjectsRegistry.removeItem(object.Key);
        
        //add object to inactive listing (ensure add is required)
        const posX = pooledObjectsInactive.getItemPos(object);
        if(posX == -1) pooledObjectsInactive.addItem(object);
        
        //disable object
        object.Disable();
    }

    /** called when the player's mouse touches a button collider */
    export function ButtonInteraction_MouseEnter(instance:MenuButton.MenuButtonObject) {
        //halt if target is already selected
        if(instance.State == MENU_BUTTON_ANIMATION_TYPES.GREEN) return;

        //update button animation
        instance.SetAnimationState(MENU_BUTTON_ANIMATION_TYPES.WHITE);
    }
    /** called when the player's mouse exits a button collider */
    export function ButtonInteraction_MouseExit(instance:MenuButton.MenuButtonObject) {
        //halt if target is already selected
        if(instance.State == MENU_BUTTON_ANIMATION_TYPES.GREEN) return;

        //update button animation
        instance.SetAnimationState(MENU_BUTTON_ANIMATION_TYPES.IDLE);
    }
    /** called when the player's mouse clicks a button collider */
    export function ButtonInteraction_MouseClick(instance:MenuButton.MenuButtonObject) {
        //toggle button by default
        if(instance.State == MENU_BUTTON_ANIMATION_TYPES.GREEN) instance.SetAnimationState(MENU_BUTTON_ANIMATION_TYPES.IDLE);
        else instance.SetAnimationState(MENU_BUTTON_ANIMATION_TYPES.GREEN);
    }

    /** processes all buttons, executing interactions */
    function processingEnemyMovement() {
        //process every active button 
        for(var i:number=0; i<pooledObjectsActive.size(); i++) {
            //get button entity
            const button = pooledObjectsActive.getItem(i);
            if(button == undefined) continue;
            
            //mouse enter
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER, button.FrameEntity)) {
                button.CallbackCursorEnter(button);
            }
            //mouse exit
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE, button.FrameEntity)) {
                button.CallbackCursorExit(button);
            }
            //mouse click
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, button.FrameEntity)) {
                button.CallbackCursorClick(button);
            }
            //key press 'F'
            if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, button.FrameEntity)) {
                button.CallbackCursorClick(button);
            }
        }
    }
    //add system to engine
    engine.addSystem(processingEnemyMovement);
}