export interface ScoreboardState {
	roundInProgress: boolean,           // Current round state, "Match in progress", "Match about to start", etc
	//roundStatus    : string,            // "Match in progress" or "Round finished!"
	roundTimer     : number, 			// elapsed round time in seconds
	updateTime     : number, 			// timestamp of last update time
	scores         : ScoreboardEntry[], // array of ScoreboardEntry's
}

export interface ScoreboardEntry {
	userID  : string,
	userName: string,
	rank    : number,
	score   : number
}
