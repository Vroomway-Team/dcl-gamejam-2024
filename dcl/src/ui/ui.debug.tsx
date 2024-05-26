import ReactEcs, { Button, Label, 
		ReactEcsRenderer, UiEntity 
} 								from '@dcl/sdk/react-ecs'
import { engine, Transform,} 	from '@dcl/sdk/ecs'
import { Color4, Vector3 } 		from '@dcl/sdk/math'

import { movePlayerTo } 		from '~system/RestrictedActions'
import { VEHICLE_MANAGER } 		from '../arena/setupVehicleManager'


export function uiDebug() {
	return (
		<UiEntity
			key         = "foo1"
			uiTransform = {{
				width  : 400,
				height : 230,
				margin : '16px 0 8px 270px',
				padding: 4,
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
						newRelativePosition: Vector3.create(32, 7, 32),
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
			</UiEntity>
		</UiEntity>
	)
}
