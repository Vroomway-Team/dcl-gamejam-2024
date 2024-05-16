import { engine, Transform,} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import { movePlayerTo } from '~system/RestrictedActions'

import { cannonVehicle } from '../cannonWorld'
import { GAME_STATE } from '../state'


import * as clientState from "../connect/state/client-state-spec";
import * as serverStateSpec from "../connect/state/server-state-spec";
import { wordWrap } from '../utils'

function getColyseusData(){
	const _room = GAME_STATE.getGameRoom();
	if(_room){
		const roomState =  _room.state as clientState.RaceRoomState
		//return wordWrap( JSON.stringify(roomState),100,100);

		let str = "";
		str += "players.size: " + roomState.players.size + "\n";
		str += "enrollment: " + JSON.stringify(roomState.enrollment) + "\n";
		str += "raceData: " + JSON.stringify(roomState.raceData) + "\n";
		roomState.players.forEach((player, key) => {
			str += "player." + key +":[" + player.userData.name + "]:[" + player.connStatus +"]"
				+ "\n----------"+":pos-" + JSON.stringify(player.racingData.worldPosition) 
				+ "\n----------"+":cam-" + JSON.stringify(player.racingData.cameraDirection) 
				+ ":buttons-" + JSON.stringify(player.buttons) 
				+ "\n";
		});
		return str;
	}else{
		return "No room"
	}
}
export function uiDebug() {
	return (
		<UiEntity
			uiTransform = {{
				width  : 400,
				height : 230,
				margin : '16px 0 8px 270px',
				padding: 4,
			}}
			uiBackground = {{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
		>
			<UiEntity
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
				<Label
					onMouseDown={() => {console.log('Player Position clicked !')}}
					value={`Colyseus Data: ${getColyseusData()}`}
					textAlign='middle-left'
					fontSize={12}
					uiTransform={{ width: '100%', height: '80%' } }
				/>
				<Button
					uiTransform = {{ width: 240, height: 40, margin: 8 }}
					value       = 'Reset vehicle'
					variant     = 'primary'
					fontSize    = {14}
					onMouseDown = {() => {
						cannonVehicle.resetTransform()
					}}
				/>
			</UiEntity>
		</UiEntity>
	)
}
