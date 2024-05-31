import { engine } 		from "@dcl/sdk/ecs"
import { parseTime } 	from "./class.Scoreboard"
import * as utils 		from '@dcl-sdk/utils'


const timerIdRecords = new Map<string, number>()

export class AnnouncemntUI{
	key:string
	visible:boolean = false
	duration:number = 1000
	constructor(key:string,visible:boolean, duration:number){
		this.key = key
		this.visible = visible
		this.duration = duration
	}
	// Hit notify
	show(duration: number = this.duration) {
		this.visible = true
		let timerId = timerIdRecords.get(this.key)
		if(timerId) utils.timers.clearTimeout(timerId)
		timerId = utils.timers.setTimeout(() => {
			this.hide()
		}, duration)
		timerIdRecords.set(this.key,timerId)
	}
	
	hide() {
		this.visible = false
	}
}
export class UIManager {

	timerRunning    : boolean = false

	hitNotify: AnnouncemntUI = new AnnouncemntUI('hitNotify',false,1000)
	matchStarted: AnnouncemntUI = new AnnouncemntUI('matchStarted',false,2000)
	sooClose: AnnouncemntUI = new AnnouncemntUI('sooClose',false,5000)
	matchInProgress: AnnouncemntUI = new AnnouncemntUI('matchInProgress',false,4000)

	looser: AnnouncemntUI = new AnnouncemntUI('looser',false,5000)
	winner: AnnouncemntUI = new AnnouncemntUI('winner',false,5000)
	matchFinished: AnnouncemntUI = new AnnouncemntUI('matchFinished',false,3000)
	matchAboutToStart: AnnouncemntUI = new AnnouncemntUI('matchAboutToStart',false,3000)

	speedValue      : number  = 0
	scoreValue      : number  = 0
	roundTime       : number  = 0
	
	//showHitNotifyDuration = 1000
	
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