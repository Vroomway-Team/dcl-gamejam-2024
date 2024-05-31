import ReactEcs, { Button, Label, 
	ReactEcsRenderer, UiEntity 
} 								from '@dcl/sdk/react-ecs'
import { parseTime } 			from '../classes/class.Scoreboard'
import { Color4 } from '@dcl/sdk/math'

const uiRoundTime   = 'images/ui.RoundTime.png'
const uiSpeedometer = 'images/ui.Speedometer.png'
const uiTicketCount = 'images/ui.TicketCount.png'
const spriteSheet  = 'images/ui-spritesheet.2048.png'//'https://i.imgur.com/80twxbD.png'
const uiYouGothit   = 'images/ui.YouGotHit.png'
const uiBumperzLogo = 'images/ui.BumperzLogo.png'

import { AnnouncemntUI, UI_MANAGER } 			from '../classes/class.UIManager'
import { Announcement } from 'dcl-ui-toolkit'

const showHitNotify = false
const speedValue = 0
const scoreValue = 0
const roundTime = 0

const ATLAS_SIZE_HEIGHT=2048
const ATLAS_SIZE_WIDTH=2048

const MATCH_IN_PROGRESS=[0,3]
const MATCH_STARTED=[0,2]
const YOU_GOT_HIT_INDEX=[0,1]
const SOO_CLOSE_INDEX=[0,0]

const LOOSER_INDEX=[1,0]
const WINNER_INDEX=[1,1]
const MATCH_FINISHED_INDEX=[1,2]
const MATCH_ABOUT_TO_START_INDEX=[1,3]


const SPRITE_SIZE_HEIGHT=(ATLAS_SIZE_HEIGHT/2)
const SPRITE_SIZE_WIDTH=(ATLAS_SIZE_WIDTH/4)

const SPRITE_SIZE_HEIGHT_UV=(ATLAS_SIZE_HEIGHT/2)/ATLAS_SIZE_HEIGHT
const SPRITE_SIZE_WIDTH_UV=(ATLAS_SIZE_WIDTH/4)/ATLAS_SIZE_WIDTH
 
function getUVsFor(idx:number[]){
	// const goodUvs = [
	// 	0,0,
	// 	0,.25,
	// 	.5,.25,
	// 	.5,0
	// ]
	const row = idx[0]
	const column = idx[1]
	const uv = [
		SPRITE_SIZE_HEIGHT_UV*(row), SPRITE_SIZE_WIDTH_UV*(column),
		SPRITE_SIZE_HEIGHT_UV*(row), SPRITE_SIZE_WIDTH_UV*(column+1), 
		SPRITE_SIZE_HEIGHT_UV*(row+1), SPRITE_SIZE_WIDTH_UV*(column+1),
		SPRITE_SIZE_HEIGHT_UV*(row+1), SPRITE_SIZE_WIDTH_UV*(column)
		// 0,0,
		// 0,.25,
		// .5,.25,
		// .5,0
		// props.left, props.bottom,
		// props.left, props.top,
		// props.right, props.top,
		// props.right, props.bottom
 
	]
	
	//debugger 
	//console.log("getUVsFor", uv) 
	return uv
}

function createCenterMsg(IDX:number[],announcement:AnnouncemntUI){
	const val = (
		// Yougothit!
		<UiEntity
			key         = {`${announcement.key}`}
			uiTransform = {{
				//width       : SPRITE_SIZE_WIDTH,
				// minWidth	: SPRITE_SIZE_WIDTH*2,
				// height      : SPRITE_SIZE_HEIGHT,
				width       : '60vw',
				minWidth	: '400',
				height      : '50vh',

				// width: '100%',
				//     height: '100%',
				display: announcement.visible ?'flex' : 'none',
				alignSelf   : 'center',
				alignContent: 'center',
				positionType: 'absolute',
				margin       : { left: '50%' },
				position    : { left: '-10%', top: '30%'},
			}}
			uiBackground = {{ 
				textureMode  : 'stretch',
				texture      : { src: spriteSheet },
				//textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
				uvs: getUVsFor(IDX),
				//color: announcement.visible ? Color4.White() : Color4.Clear()
			}}
		/>
	)
	
	return val
}
export function hudCenterMsgs() {
	return [
		createCenterMsg(YOU_GOT_HIT_INDEX, UI_MANAGER.hitNotify),
		createCenterMsg(MATCH_STARTED,UI_MANAGER.matchStarted),
		createCenterMsg(SOO_CLOSE_INDEX,UI_MANAGER.sooClose),
		createCenterMsg(MATCH_IN_PROGRESS,UI_MANAGER.matchInProgress),
		
		createCenterMsg(LOOSER_INDEX,UI_MANAGER.looser),
		createCenterMsg(WINNER_INDEX,UI_MANAGER.winner),
		createCenterMsg(MATCH_FINISHED_INDEX,UI_MANAGER.matchFinished),
		createCenterMsg(MATCH_ABOUT_TO_START_INDEX,UI_MANAGER.matchAboutToStart),

	];
}
// export function hudMatchStarted() {
// 	const key = 'uiHud_matchStarted'
// 	const IDX = MATCH_STARTED
// 	return createCenterMsg(key,IDX,()=>{return UI_MANAGER.hitNotifyVisible})
// }
// export function hudYouGotHit() {
// 	const key = 'uiHud_youGotHit'
// 	const IDX = YOU_GOT_HIT_INDEX
// 	return createCenterMsg(key,IDX,()=>{return UI_MANAGER.hitNotifyVisible})
// }
// export function hudSooClose() {
// 	return createCenterMsg('uiHud_sooClose',SOO_CLOSE_INDEX,()=>{return UI_MANAGER.hitNotifyVisible})
// }
export function hudTimer() {
	return (	
			// Round Timer
			<UiEntity
				key         = 'uiHud_timer'
				uiTransform = {{
					width  : 300,
					height : 172,
					margin : { top: '0', left: '0', right: 0 },
					padding: 4,
					//position: { top: '0%', right: '0%', bottom:'0%', left: '250'},//non 4k
					position: { top: '0%', right: '0%', bottom:'0%', left: '25%'},//4k
					justifyContent: 'center',
					positionType: 'absolute'
				}}
				uiBackground = {{ 
					textureMode  : 'nine-slices',
					texture      : { src: uiRoundTime },
					textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
				}}
				uiText = {{
					value    : UI_MANAGER.getTimerValueString(),
					fontSize : 48,
					textAlign: "middle-center"
				}}
			/>
			
	)
}
export function hudTicketScore() {
	return (
		
			
			// Score: Ticket count
			<UiEntity
				key         = 'uiHud_score'
				uiTransform = {{
					width  : 300,
					height : 172,
					margin : { top: '0', left: -350 },
					padding: 4,
					//position: { top: '0%', bottom:'0%', left: '90%'}, //non 2k
					position: { top: '0%', bottom:'0%', left: '90%'}, //4k
					justifyContent: 'center',
					positionType: 'absolute',//,
					alignItems: "flex-end"
				}}
				uiBackground = {{ 
					textureMode  : 'nine-slices',
					texture      : { src: uiTicketCount },
					textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
				}}
			>
			<UiEntity
				key         = 'uiHud_score_text'
				uiTransform = {{
					width         : 300,
					height        : 172,
					margin : { top: '0', left: -150 },
					justifyContent: 'flex-end',
				}}
				uiText = {{
					value    : UI_MANAGER.getScoreValue().toString(),
					fontSize : 48,
					textAlign: "middle-right",
					
				}}
			/>
			</UiEntity>

	)
}


//had to make it seperate to make it position center bottom
export function hudSpeedometer(){
	
	return <UiEntity //parent / modal decoration
			uiTransform={{
			width: 175,
			height: 175,
			//display: 'flex',
			positionType: 'absolute',
			position: { bottom: '50px', left: '50%' } ,
			//flexDirection:'column',
			//flexWrap:'wrap',
			//alignSelf:'flex-end'
			}}
			//uiBackground={{ texture: {src: "images/leaderboardbg.png"}, textureMode: 'stretch'}}
			uiBackground = {{ 
				textureMode  : 'nine-slices',
				texture      : { src: uiSpeedometer },
				textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
			}}
			uiText = {{
				value    : (Math.round(UI_MANAGER.getSpeedValue()*10)/10).toString(),
				fontSize : 48,
				textAlign: "middle-center"
			}}
		>
			
		</UiEntity>
	
	
  }
  


  