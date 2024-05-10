import { engine, Transform,} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import { movePlayerTo } from '~system/RestrictedActions'


export function uiDebug() {
	return (
		<UiEntity
			key={"0"}
			uiTransform = {{
				width  : 400,
				height : 60,
				margin : '16px 0 8px 270px',
				padding: 4,
			}}
			uiBackground = {{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
		>
			<UiEntity
				key={"1"}
				uiTransform = {{
					width         : '100%',
					height        : '100%',
					flexDirection : 'column',
					alignItems    : 'center',
					justifyContent: 'space-between'
				}}
				uiBackground = {{ color: Color4.fromHexString("#70ac76ff") }}
			>
				<Button
					key={"2"}
					uiTransform = {{ width: 240, height: 40, margin: 8 }}
					value       = 'Teleport above arena'
					variant     = 'primary'
					fontSize    = {14}
					onMouseDown = {() => {
						movePlayerTo({
							newRelativePosition: Vector3.create(32, 16, 32),
							cameraTarget       : Vector3.create(8, 1, 8),
						})
					}}
				/>
			</UiEntity>
		</UiEntity>
	)
}