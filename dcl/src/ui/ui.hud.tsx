import ReactEcs, { Button, Label, 
	ReactEcsRenderer, UiEntity 
} 								from '@dcl/sdk/react-ecs'
import { parseTime } 			from '../classes/class.Scoreboard'
import { Color4 } from '@dcl/sdk/math'

const uiRoundTime   = 'images/ui.RoundTime.png'
const uiSpeedometer = 'images/ui.Speedometer.png'
const uiTicketCount = 'images/ui.TicketCount.png'
const uiYouGothit   = 'images/ui.YouGotHit.png'
const uiBumperzLogo = 'images/ui.BumperzLogo.png'

import { UI_MANAGER } 			from '../classes/class.UIManager'

const showHitNotify = false
const speedValue = 0
const scoreValue = 0
const roundTime = 0

export function uiHud() {
	return (
		// Root element
		<UiEntity
			key         = 'uiHud_root'
			uiTransform = {{
				width    : '100vw',
				height   : '100vh',
				minHeight: '100vh',
				position : { top: 0, left: 0, bottom: 0 },
			}}		
			>
				
			// Round Timer
			<UiEntity
				key         = 'uiHud_timer'
				uiTransform = {{
					width         : 300,
					height        : 172,
					position      : { top: 0, left  : "15vw" },
					justifyContent: 'center',
					padding       : { top: 12, right: 64 },
					positionType  :  'absolute',
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
			
			
			// Score: Ticket count
			<UiEntity
				key         = 'uiHud_score'
				uiTransform = {{
					width         : 300,
					height        : 172,
					justifyContent: 'center',
					position      : { top: 0, right: "5vw"},
					positionType  : 'absolute',
					padding       : { right: 72, bottom: 4 },
					alignItems: "flex-end"
				}}
				uiBackground = {{ 
					textureMode  : 'nine-slices',
					texture      : { src: uiTicketCount },
					textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
				}}
			>
			<UiEntity
				key         = 'uiHud_score'
				uiTransform = {{
					width         : 300,
					height        : 172,
					justifyContent: 'flex-end',
				}}
				uiText = {{
					value    : UI_MANAGER.getScoreValue().toString(),
					fontSize : 48,
					textAlign: "middle-right",
					
				}}
			/>
				
			</UiEntity>
			
			// Speedometer
			<UiEntity
				key         = 'uiHud_speedometer'
				uiTransform = {{
					width         : 175,
					height        : 175,
					maxHeight     : 175,
					maxWidth      : 175,
					padding       : { right: 10, bottom: 2 },
					position      : { bottom: 0, left: '42vw' },
					alignSelf     : 'flex-start',
					positionType  : 'absolute',
					justifyContent: 'center',
					alignItems    : 'center',
				}}
				uiBackground = {{ 
					textureMode  : 'nine-slices',
					texture      : { src: uiSpeedometer },
					textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
				}}
				uiText = {{
					value    : UI_MANAGER.getSpeedValue().toString(),
					fontSize : 48,
					textAlign: "middle-center"
				}}
			/>
			
			
			// Yougothit!
			<UiEntity
				key         = 'uiHud_hitNotify'
				uiTransform = {{
					width       : '50vw',
					height      : '200',
					alignSelf   : 'center',
					alignContent: 'center',
					positionType: 'absolute',
					position    : { left: '25vw' },
				}}
				uiBackground = {{ 
					textureMode  : 'nine-slices',
					texture      : { src: uiYouGothit },
					textureSlices: { top: 0, bottom: 0, left: 0, right: 0 }, 
					color: UI_MANAGER.hitNotifyVisible ? Color4.White() : Color4.Clear()
				}}
			/>
			
		</UiEntity>
	)
}
