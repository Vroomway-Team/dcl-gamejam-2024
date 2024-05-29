import { engine } 		from "@dcl/sdk/ecs"
import { parseTime } 	from "./class.Scoreboard"
import * as utils 		from '@dcl-sdk/utils'

export class UIManager {

	timerRunning    : boolean = false
	hitNotifyVisible: boolean = false
	speedValue      : number  = 0
	scoreValue      : number  = 0
	roundTime       : number  = 0
	
	showHitNotifyDuration = 1000
	
	constructor() {
		engine.addSystem(UIIncrementTimerSystem)
	}
	
	// Timer funcs
	
	getTimerValueString(): string {
		return parseTime(this.roundTime)
	}
	
	setTimerValue(time: number): void {
		this.roundTime = time 
	}
	
	incrementTimerValue(time: number): void {
		this.roundTime += time 
	}
	
	resetTimer(): void {
		this.roundTime = 0
	}
	
	startTimer(): void {
		this.resetTimer()
		this.timerRunning = true
	}
	
	stopTimer(): void {
		this.timerRunning = false
		this.resetTimer()
	}
	
	// Speedometer funcs
	setSpeedValue(speed: number): void {
		this.speedValue = speed 
	}
	getSpeedValue(): number {
		return this.speedValue
	}
	
	// Ticket funcs
	setScoreValue(value: number): void {
		this.scoreValue = value
	}
	getScoreValue(): number {
		return this.scoreValue
	}
	
	// Hit notify
	showHitNotify(duration: number = this.showHitNotifyDuration) {
		this.hitNotifyVisible = true
		utils.timers.setTimeout(() => {
			this.hideHitNotify()
		}, duration)
	}
	
	hideHitNotify() {
		this.hitNotifyVisible = false
	}
}

function UIIncrementTimerSystem(dt: number) {
	if (UI_MANAGER.timerRunning) {
		UI_MANAGER.incrementTimerValue(dt)
		
	}
}

export const UI_MANAGER = new UIManager()

export function setupUiManager(){
	return UI_MANAGER
}