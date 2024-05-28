export interface ScoreboardState {
	roundInProgress: boolean,           // Current round state, "Match in progress", "Match about to start", etc
	roundTimer     : number, 			// elapsed round time in seconds
	scores         : ScoreboardEntry[], // array of ScoreboardEntry's
}

export interface ScoreboardEntry {
	userName: string,
	score   : number
}
