import ReactEcs, { Button, Label, 
		ReactEcsRenderer, UiEntity 
} 								from '@dcl/sdk/react-ecs'
import { engine, Transform,} 	from '@dcl/sdk/ecs'
import { Color4, Vector3 } 		from '@dcl/sdk/math'

import { movePlayerTo } 		from '~system/RestrictedActions'
import { VEHICLE_MANAGER } 		from '../arena/setupVehicleManager'
import { SCOREBOARD_MANAGER } 	from '../arena/setupScoreboards'
import { UI_MANAGER } from '../classes/class.UIManager'

const ENABLE_DEBUG_UI = true

export function uiDebug() {
	if (ENABLE_DEBUG_UI) {
		return (
			<UiEntity
				key         = "foo1"
				uiTransform = {{
					width       : 260,
					height      : 230,
					margin      : '16px 20px 0 0',
					padding     : 4,
					position    : {left: 0, top: 300},
					positionType: "absolute"
				}}
				uiBackground = {{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
				
			>
				<UiEntity
					key         = "foo2"
					uiTransform = {{
						width         : '100%',
						height        : '100%',
						flexDirection : 'column',
						alignItems    : 'flex-start',
						justifyContent: 'space-between'
					}}
					uiBackground = {{ color: Color4.fromHexString("#70ac76ff") }} 
				>
				<Button
					key         = "bar1"
					uiTransform = {{ width: 240, height: 40, margin: 8 }}
					value       = 'Teleport above arena'
					variant     = 'primary'
					fontSize    = {14}
					onMouseDown = {() => {
						movePlayerTo({
							newRelativePosition: Vector3.create(32, 10, 32),
							cameraTarget       : Vector3.create(8, 1, 8),
						})
					}}
				/>
				
				<Button
					key         = "bar1a"
					uiTransform = {{ width: 240, height: 40, margin: 8 }}
					value       = 'Teleport to lobby'
					variant     = 'primary'
					fontSize    = {14}
					onMouseDown = {() => {
						movePlayerTo({
							newRelativePosition: Vector3.create(22, 2.5, 28),
							cameraTarget       : Vector3.create(20, 0, 27),
						})
					}}
				/>
					
					<Button
						key         = "bar2"
						uiTransform = {{ width: 240, height: 40, margin: 8 }}
						value       = 'Round start'
						variant     = 'primary'
						fontSize    = {14}
						onMouseDown = {() => {
							VEHICLE_MANAGER.onRoundStart()
							UI_MANAGER.startTimer()
						}}
					/>
					
					<Button
						key         = "bar3"
						uiTransform = {{ width: 240, height: 40, margin: 8 }}
						value       = 'Round end'
						variant     = 'primary'
						fontSize    = {14}
						onMouseDown = {() => {
							VEHICLE_MANAGER.onRoundEnd()
							UI_MANAGER.stopTimer()
						}}
					/>
					
					<Button
						key         = "bar4"
						uiTransform = {{ width: 240, height: 40, margin: 8 }}
						value       = 'AddFakePlayer'
						variant     = 'primary'
						fontSize    = {14}
						onMouseDown = {() => {
							VEHICLE_MANAGER.debugTestFunc()
						}}
					/>
					
					<Button
						key         = "bar5"
						uiTransform = {{ width: 240, height: 40, margin: 8 }}
						value       = 'Scoreboard TestFunc'
						variant     = 'primary'
						fontSize    = {14}
						onMouseDown = {() => {
							SCOREBOARD_MANAGER.debugTestFunc()
						}}
					/>
					
					<Button
						key         = "bar5"
						uiTransform = {{ width: 240, height: 40, margin: 8 }}
						value       = 'Show Hit Notify'
						variant     = 'primary'
						fontSize    = {14}
						onMouseDown = {() => {
							UI_MANAGER.showHitNotify()
						}}
					/>
				</UiEntity>
			</UiEntity>
		)
	} else {
		return
	}
}
