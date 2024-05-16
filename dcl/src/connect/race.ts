import { Vector3 } from "@dcl/sdk/math";


//cached object, reduce object creation
const VECTOR_UP = Vector3.Up()

export class RaceData {
  //numberOfPlayers:number
  //ranking:number //TODO move to player ?

  //id of the level being played
  id!: string;
  name!: string;
  maxLaps!: number;
  newLapSegmentId: number = 0;
  //overlap trackPathLenSub1 also stores this???
  lastTrackSegmentId: number = 0;

  maxPlayers!: number; //does this belong here?
  minTotalTeamPlayers!: number;
  totalPlayers!: number; //total players
  maxTotalTeamPlayers!: number; //maxTotalTeam players

  checkpointSegmentId!: number[]; //come from level??
  //trackItems:TrackItem[]

  //nextCheckpointIndex:number
  started!: boolean;
  ended!: boolean;
  startTime!: number;
  startTimeOnServer!: number;
  endTime!: number;

  //lap:number //TODO move to player ?
  //currentCheckpointIndex:number  //TODO move to player ?

  constructor() {
    this.reset();
  }
  reset() {
    this.id = "Demo1";
    this.name = "_Untitled Race_" + this.id;
    this.started = false;
    this.ended = false;
    this.startTime = -1;
    this.startTimeOnServer = -1
    this.maxPlayers = -1;
    this.minTotalTeamPlayers = -1;
    this.totalPlayers = -1;
    //this.numberOfPlayers = 1
    //this.ranking = 0
    this.maxLaps = 1;
    this.newLapSegmentId = 0;
    this.lastTrackSegmentId = 99999//make very large as default
    this.checkpointSegmentId = [];
    //this.nextCheckpointIndex = 1
  }
  startRace() {
    this.started = true;
    //TAG:server-client-time-drift, need to include latency
    //note: this does redefine the start time that was initially set by the 
    this.startTime = Date.now();
  }
  endRace() {
    this.started = false;
    this.ended = true;
    this.endTime = Date.now();
  }
}
