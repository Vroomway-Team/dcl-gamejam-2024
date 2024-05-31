import { AudioSource, AvatarAnchorPointType, AvatarAttach, Entity, MeshCollider, MeshRenderer, PBMeshCollider_BoxMesh, Transform, engine } from "@dcl/sdk/ecs";

/*      AUDIO MANAGER
    controls audio components in-scene, mainly lobby (game idle) and
    battle (during wave) music.

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
export module AudioManager {
    
    const VOLUME_SFX:number = 0.75;
    const VOLUME_BGM:number = 0.5;
        
    //### SOUND EFFECTS ###
    /** all sound effects */
    export enum AUDIO_SFX {
        INTERACTION_CART_CLAIM = "assets/sfx/cart_select.mp3",
        INTERACTION_CART_BUMP = "assets/sfx/cart_bump.mp3",
        INTERACTION_TICKET_COLLECT = "assets/sfx/ticket_collect.mp3",
        INTERACTION_TICKET_DROP = "assets/sfx/ticket_drop.mp3",
        //results
        RESULT_WIN = "assets/sfx/voice_winner.mp3",
        RESULT_LOSE = "assets/sfx/voice_loser.mp3",
    }

    /** pooling side for the number sound effect objects */
    const SFX_POOL_SIZE:number = 12;
    /** iterator for current sound effect object */
    var indexSFX:number = 0;
    /** pooled set of all sound effect objects */
    const SFX_POOL:Entity[] = [];
    //populate sfx object pool
    for(let i:number=0; i<SFX_POOL_SIZE; i++) {
        const entity = engine.addEntity();
        Transform.create(entity);
        AvatarAttach.create(entity, {
            anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
        });
        AudioSource.create(entity, {
            audioClipUrl: "",
            loop: false,
            playing: false,
            global: true,
            volume: VOLUME_SFX,
        });
        SFX_POOL.push(entity);
    }
    
    /** plays a sound effect */
    export function PlaySoundEffect(clipID:AUDIO_SFX) {
        console.log("Audio Manager: playering SFX, clip="+clipID);
        //get next sfx object
        indexSFX++;
        if(indexSFX >= SFX_POOL.length) indexSFX = 0;
        //set audio details
        const audio = AudioSource.getMutable(SFX_POOL[indexSFX]);
        audio.playing = false;
        audio.currentTime = 0;
        audio.audioClipUrl = clipID;
        //play sound
        audio.playing = true;
    }

    //### BACKGROUND MUSIC ###
    /** all background music */
    export const enum BACKGROUND_MUSIC {
        SCENE_NONE = "",
        SCENE_IDLE = "assets/sfx/lobby_music.mp3",
        SCENE_PLAYING = "assets/sfx/game_background.mp3",
    }

    /** current background music being played */
    var curBackgroundMusic:BACKGROUND_MUSIC = BACKGROUND_MUSIC.SCENE_NONE;
    /** entity used to play background music */
    const BackgroundMusicEntity:Entity = engine.addEntity();
    Transform.create(BackgroundMusicEntity);
    AvatarAttach.create(BackgroundMusicEntity, {
        anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG,
    });
    AudioSource.create(BackgroundMusicEntity, {
        audioClipUrl: "",
        loop: true,
        playing: true,
        global: true,
        volume: VOLUME_BGM,
    });
    
    /** plays a sound effect */
    export function PlayBackgroundMusic(clipID:BACKGROUND_MUSIC) {
        console.log("Audio Manager: playering BGM, clip="+clipID);
        //halt if already playing requested clip
        if(curBackgroundMusic == clipID) return;
        curBackgroundMusic = clipID;
        //set audio details
        const audio = AudioSource.getMutable(BackgroundMusicEntity);
        audio.playing = false;
        audio.currentTime = 0;
        audio.audioClipUrl = clipID;
        //play sound
        audio.playing = true;
    }
}