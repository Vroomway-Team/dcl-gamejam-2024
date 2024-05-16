import {  LoginResult } from '../../connect/playfab_sdk/playfab.types'; 

export type LoginFlowCallback={
    onSuccess?:()=>void
    onFailure?:()=>void
}
export type LoginFlowResult={
    chain:string[]
    playfabResult?:LoginResult|null
    customId?:string
}