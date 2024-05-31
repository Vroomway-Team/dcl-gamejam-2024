import { Networking } from "./networking";

const ENV = 'prod'

export const SHOW_DEBUG_TRIGGERS: Record<string, boolean> = {
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


export class Config {
	public SHOW_DEBUG_TRIGGERS: boolean = SHOW_DEBUG_TRIGGERS[ENV]
	
	public USE_IMGUR_ASSETS   : boolean = USE_IMGUR_ASSETS[ENV]
	
	public COLYSEUS_SERVER    : Networking.CONNECTION_TYPE = COLYSEUS_SERVER[ENV]
}

export const CONFIG = new Config
