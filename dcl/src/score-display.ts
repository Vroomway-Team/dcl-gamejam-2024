import { ColliderLayer, Entity, GltfContainer, TextAlignMode, TextShape, Transform, engine } from "@dcl/sdk/ecs";
import { Color4 } from "@dcl/sdk/math";
import { LobbyPlayer } from "./lobby-player";

export module ScoreDisplay {
    //scoreboard parent
    export const ScoreBoardParent:Entity = engine.addEntity();
    Transform.create(ScoreBoardParent);

    export class DisplayElementObject {
        public EntityParent:Entity = engine.addEntity();
        public BackgroundFrame:Entity = engine.addEntity();
        public TextName:Entity = engine.addEntity();
        public TextScore:Entity = engine.addEntity();
        
        //initialize
        constructor(parent:Entity) {
            //parent entity
            Transform.create(this.EntityParent, {
                parent: parent,
            });
            //background
            this.BackgroundFrame = engine.addEntity();
            Transform.create(this.BackgroundFrame,{
                parent: this.EntityParent,
                position: {x:0, y:0, z:0},
                scale: {x:1.1, y:1, z:1}
            });
            GltfContainer.createOrReplace(this.BackgroundFrame, {
                src: "models/bumper-cars/menu-input-box-long.glb",
                visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                invisibleMeshesCollisionMask: undefined
            });
            //  player's name
            Transform.create(this.TextName, {
                parent:this.EntityParent,
                position: {x:-0.6, y:0, z:0},
                scale: {x:0.05, y:0.05, z:0.05}
            });
            TextShape.create(this.TextName,{
                text:"PLAYER_DISPLAY_NAME",
                fontSize:15,
                textAlign:TextAlignMode.TAM_MIDDLE_LEFT,
                textColor:Color4.White(),
            });
            //  starting date
            Transform.create(this.TextScore, {
                parent:this.EntityParent,
                position: {x:0.6, y:0, z:0},
                scale: {x:0.05, y:0.05, z:0.05}
            });
            TextShape.create(this.TextScore,{
                text:"88888",
                fontSize:12,
                textAlign:TextAlignMode.TAM_MIDDLE_RIGHT,
                textColor:Color4.White(),
            });
        }

        public UpdateDisplay(name:string, score:string) {
            TextShape.getMutable(this.TextName).text = name;
            TextShape.getMutable(this.TextScore).text = score;
            console.log("name="+name+", score="+score)
        }

        public ClearDisplay() {
            TextShape.getMutable(this.TextName).text = "";
            TextShape.getMutable(this.TextScore).text = "";
        }
    }

    /** all display elements */
    var displayElements:DisplayElementObject[] = [];
    //create elements
    const COUNT = 10;
    const OFFSET = 0.15;
    for(var i:number=0; i<COUNT; i++) {
        const element = new DisplayElementObject(ScoreBoardParent);
        Transform.getMutable(element.EntityParent).position = {x:0, y:(COUNT/2*OFFSET)-(i*OFFSET), z:0}
        displayElements.push(element);
    } 

    export function UpdateDisplays() {
        //sort scores
        LobbyPlayer.SortPlayerScores();
        //process all displays
        for(var i:number=0; i<displayElements.length; i++) {
            if(i < LobbyPlayer.GetPlayerCount()) {
                const player = LobbyPlayer.GetPlayer(i);
                displayElements[i].UpdateDisplay(player.DisplayName, player.Score.toString());
            } else {
                displayElements[i].ClearDisplay();
            }   
        }
    }
}