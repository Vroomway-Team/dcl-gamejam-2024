import "../polyfill";
import { MessageBus } from '@dcl/sdk/message-bus';
import { getUserData } from '~system/UserIdentity';
import { Client, Room } from 'colyseus.js';
/*      NETWORKING
    contains all networking interfaces and settings

    PrimaryAuthors: TheCryptoTrader69 (Alex Pazder)
    TeamContact: thecryptotrader69@gmail.com
*/
export module Networking {
    /** when true debug logs are generated (toggle off when you deploy) */
    const isDebugging:boolean = true;
    /** wrapper for debugging logs */
    function addLog(log:string) { if(isDebugging) console.log("Networking: "+log); }
    /** controls whether scene requires a player to be logged in with a web3 account */
    const TestingOverride:boolean = true;
    
    /** peer-to-peer message bus */
    export const MESSAGE_BUS = new MessageBus();

    /** instanced client connection to server */
    export const CLIENT_CONNECTION = new Client("http://127.0.0.1:2567");
    
    /** instanced room from server */
    export var ServerRoom:void|Room<unknown>;

    /** local player's account type */
    var accountType:Networking.PLAYER_ACCOUNT_TYPE = Networking.PLAYER_ACCOUNT_TYPE.UNINITIALIZED;
    /** returns the local player's account type */
    export function GetAccountType():Networking.PLAYER_ACCOUNT_TYPE { return accountType; }
    /** sets the local player's account type */
    function setAccountType(value:Networking.PLAYER_ACCOUNT_TYPE) {
        accountType = value;
    }
    /** account types for a player */
    export enum PLAYER_ACCOUNT_TYPE {
        UNINITIALIZED, //player's account has not loaded yet
        GUEST, //guest/not logged in with a wallet
        STANDARD, //logged in with a web3 wallet
    }
    /** display strings for player accounts */
    export const PLAYER_ACCOUNT_TYPE_STRINGS:string[] = [
        "Loading...",
        "Guest",
        "Standard",
    ];

    /** local player's web3 state */
    var isWeb3:boolean = false;
    /** returns the local player's web3 state */
    export function IsWeb3():boolean { return isWeb3; }
    /** sets the local player's web3 state */
    function SetWeb3(value:boolean) {
        isWeb3 = value;
    }

    /** local player's web3 address */
    var userWeb3Public:string;
    /** returns the local player's uid */
    export function GetUserWeb3Public():string { return userWeb3Public; }
    /** sets the local player's uid */
    function SetUserWeb3Public(value:string) {
        userWeb3Public = value;
    }
    Networking.GetUserWeb3Public = GetUserWeb3Public;

    /** local player's uid */
    var userID:string;
    /** returns the local player's uid */
    export function GetUserID():string { return userID; }
    /** sets the local player's uid */
    function SetUserID(value:string) { 
        userID = value;
    }

    /** local player's display name */
    var userName:string;
    /** returns the local player's display name */
    export function GetUserName():string { return userName; }
    /** sets the local player's uid */
    function SetUserName(value:string) { 
        userName = value; 
    }

    /** attempts to load the local player's data by logging into the server */
    export async function LoadPlayerData() {
        addLog("loading player data...");

        //attempt to get player's decentraland profile data
        let userData = await getUserData({});
        
        //halt if player has no decentraland profile data
        if(!userData || !userData.data) {
            addLog("failed to load player's decentraland profile data");
            return;
        }
        //populate user details
        SetWeb3(userData.data.hasConnectedWeb3);
        SetUserID(userData.data.userId);
        SetUserWeb3Public(userData.data.publicKey ?? "");
        SetUserName(userData.data.displayName);
        
        //if player's public key is not found, player is not logged in using web3
        if(userData.data.publicKey) {
            addLog("player is a logged account (has web3 key)");
            setAccountType(Networking.PLAYER_ACCOUNT_TYPE.STANDARD);
        } 
        //public key is found, player logged in through web3 wallet 
        else {
            addLog("player is a guest account (no web3 key)");
            setAccountType(Networking.PLAYER_ACCOUNT_TYPE.GUEST);
        }

        addLog("loaded player data!"+
            "\n\taccountType="+Networking.PLAYER_ACCOUNT_TYPE_STRINGS[accountType]+
            "\n\tisWeb3="+isWeb3+
            "\n\tuserID="+userID+
            "\n\tdisplayName="+userName
        );
    };
}