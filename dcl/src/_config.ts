import { Networking } from "./networking";

const ENV = 'prod'

export const SHOW_DEBUG_TRIGGERS: Record<string, boolean> = {
	local: true,
	prod : false,
};

export const SHOW_DEBUG_PANEL: Record<string, boolean> = {
	local: true,
	prod : false,
};

export const SHOW_DEBUG_3D_BUTTONS: Record<string, boolean> = {
	local: true,
	prod : false,
};

export const COLYSEUS_SERVER: Record<string, Networking.CONNECTION_TYPE> = {
	local: Networking.CONNECTION_TYPE.LOCAL,
	prod:  Networking.CONNECTION_TYPE.REMOTE,
};

export const USE_IMGUR_ASSETS: Record<string, boolean> = {
	local: false,
	prod : true,
};

export const PLAYFAB_TITLEID: Record<string, string> = {
	local: "78E14",
  	prod: "78E14"
};

const AUTH_URL: Record<string, string> = {
	local: "https://vroomway-auth-79f2ca20be45.herokuapp.com",//http://localhost:5001", //only used if PLAYFAB_ENABLED
	prod: "https://vroomway-auth-79f2ca20be45.herokuapp.com"
  };

export class Config {
	public CURRENT_VERSION      : string  = "20240624a" //Current data in YYYYMMDD format. Optional alphabetical suffix can be added for multiple deployments on the same date. Eg: 20240624b
	
	public SHOW_DEBUG_TRIGGERS  : boolean = SHOW_DEBUG_TRIGGERS[ENV]
	public SHOW_DEBUG_PANEL     : boolean = SHOW_DEBUG_PANEL[ENV]

	public SHOW_DEBUG_3D_BUTTONS: boolean = SHOW_DEBUG_3D_BUTTONS[ENV]
	
	public USE_IMGUR_ASSETS     : boolean = USE_IMGUR_ASSETS[ENV]
	
	public COLYSEUS_SERVER      : Networking.CONNECTION_TYPE = COLYSEUS_SERVER[ENV]
	public IN_PREVIEW : boolean = false
	public SHOW_CONNECTION_DEBUG_INFO : boolean = false

	public LOGIN_FLOW_TYPE: string = 'dclSignedFetch'
	public LOGIN_ENDPOINT:string  = AUTH_URL[ENV] + "/player/auth?";
	public PLAYFAB_ENABLED: boolean = true

	public PLAYFAB_TITLEID: string = PLAYFAB_TITLEID[ENV]
}

export const CONFIG = new Config
