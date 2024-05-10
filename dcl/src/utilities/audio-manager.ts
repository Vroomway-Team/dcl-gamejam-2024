import { AudioSource, AvatarAnchorPointType, AvatarAttach, Entity, Transform, engine } from "@dcl/sdk/ecs";

/*      AUDIO MANAGER
    controls audio components in-scene, mainly lobby (game idle) and
    battle (during wave) music.

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
export module AudioManager {
    
    //### SOUND EFFECTS ###
    /** all sound effects */
    export enum AUDIO_SFX {
        //interaction buttons
        BUTTON_CLICKED = "audio/utilities/sfx-button-clicked.mp3",
        BUTTON_SUCCESS = "audio/utilities/sfx-button-success.mp3",
        BUTTON_FAIL = "audio/utilities/sfx-button-fail.mp3",
        //notifications
        NOTIFICATION_PING = "audio/utilities/sfx-notification-ping.mp3",
        NOTIFICATION_NEUTRAL = "audio/utilities/sfx-notification-neutral.mp3",
        NOTIFICATION_ERROR = "audio/utilities/sfx-notification-error.mp3",
        //results
        RESULT_WIN = "audio/utilities/sfx-result-win.mp3",
        RESULT_LOSE = "audio/utilities/sfx-result-lose.mp3",
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
            audioClipUrl: AUDIO_SFX.BUTTON_CLICKED,
            loop: false,
            playing: false,
            global: true,
            volume: 0.5,
        });
        SFX_POOL.push(entity);
    }
    
    /** plays a sound effect */
    export function PlaySoundEffect(clipID:AUDIO_SFX) {
        //console.log("Audio Manager: playering SFX, clip="+clipID);
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
        SCENE_IDLE = "audio/td-framework/WhiteBatAudio_VHS_Memory.mp3",
        SCENE_COMBAT = "audio/td-framework/WhiteBatAudio_Hackers.mp3",
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
        audioClipUrl: BACKGROUND_MUSIC.SCENE_IDLE,
        loop: true,
        playing: false,
        global: true,
        volume: 0,
    });
    
    /** plays a sound effect */
    export function PlayBackgroundMusic(clipID:BACKGROUND_MUSIC) {
        //console.log("Audio Manager: playering BGM, clip="+clipID);
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