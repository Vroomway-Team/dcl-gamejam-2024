import ReactEcs, { Button, Label, 
	ReactEcsRenderer, UiEntity 
} 								from '@dcl/sdk/react-ecs'
import { engine, Transform,} 	from '@dcl/sdk/ecs'
import { Color4, Vector3 } 		from '@dcl/sdk/math'
import { movePlayerTo } 		from '~system/RestrictedActions'

const uiRoundTime = 'images/ui.RoundTime.png'
const uiSpeedometer = 'images/ui.Speedometer.png'
const uiTicketCount = 'images/ui.TicketCount.png'
const uiYouGothit = 'images/ui.YouGotHit.png'
const uiBumperzLogo = 'images/ui.BumperzLogo.png'


export function uiHud() {
	return (
		<UiEntity
			key         = "uie_foo1"
			uiTransform = {{
				width  : 300,
				height : 172,
				margin : { top: '0', left: '-175',  },
				padding: 4,
				position: { top: '0%', right: '0%', bottom:'0%', left: '0%'},
				justifyContent: 'center',
			}}
			uiBackground = {{ 
				textureMode: 'nine-slices',
				texture: { src: uiRoundTime },
				textureSlices: { top: -0.0, bottom: -0.0, left: -0.0, right: -0.0 }, 
			}}
		>
			<UiEntity
			key         = "uie_foo2"
			uiTransform = {{
				width  : 300,
				height : 172,
				margin : { top: '0', left: '0',  },
				padding: 4,
				position: { top: '0%', right: '0%', bottom:'0%', left: '250%'},
				justifyContent: 'center',
			}}
			uiBackground = {{ 
				textureMode: 'nine-slices',
				texture: { src: uiTicketCount },
				textureSlices: { top: -0.0, bottom: -0.0, left: -0.0, right: -0.0 }, 
			}}
		></UiEntity>
		</UiEntity>
	)
}
export function uiSpeedometerHud() {
	return(
		<UiEntity
			key         = "uie_foo3"
			uiTransform = {{
				width  : 175,
				height : 175,
				maxHeight: 175,
				maxWidth: 175,
				margin : { top: '0', left: '0',  },
				padding: 0,
				position: { top: '85%', right: '0%', bottom:'0%', left: '0%'},
				justifyContent: 'center',
				positionType: 'absolute'
			}}
			uiBackground = {{ 
				textureMode: 'nine-slices',
				texture: { src: uiSpeedometer },
				textureSlices: { top: -0.0, bottom: -0.0, left: -0.0, right: -0.0 }, 
			}}
		></UiEntity>
	)
}
export function uiYouGotHitHud(){
	return(
		<UiEntity
			key         = "uie_foo4"
			uiTransform = {{
				width  : 1000,
				height : 200,
				margin : { top: '0', left: '0',  },
				padding: 0,
				position: { top: '40%', right: '0%', bottom:'0%', left: '0%'},
				justifyContent: 'center',
				positionType: 'absolute'
			}}
			uiBackground = {{ 
				textureMode: 'nine-slices',
				texture: { src: uiYouGothit },
				textureSlices: { top: -0.0, bottom: -0.0, left: -0.0, right: -0.0 }, 
			}}
		></UiEntity>
	)
}