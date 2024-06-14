//import { CONFIG } from "../../config";
import {
  GetPlayerCombinedInfoResultPayload,
  LoginResult,
  StatisticValue,
} from "../playfab_sdk/playfab.types";

//export const PLAYER_DATA_CACHE: Record<string,UserData|null> = {}

//holds a cache of playFabUserInfo values
//to reduce need to parse if/when unclear populated

function firstNotNull(v1:number,v2:number){
  if(v1 !== undefined && v1 !== null){
    return v1;
  }
  return v2
}

type StatsCache={
  allTimeCoins:number
  dailyCoins:number
  raffleCoinBag:number
}
type VirtualCurrencyCache={
  gc:number
  mc:number

}

type CatalogItemCache={
  bronzeShoe:number
  ticketRaffleCoinBag:number
  coinBagRaffleRedeem:number
}


export class GetPlayerCombinedInfoResultHelper{
  virtualCurrency!: VirtualCurrencyCache
  inventory!: CatalogItemCache
  stats!: StatsCache
  constructor(){
    this.reset()
  }
  reset(){
    this.virtualCurrency = {
      gc:0,
      mc:0
    }
    this.inventory = {
      bronzeShoe:0,
      ticketRaffleCoinBag:0,
      coinBagRaffleRedeem:0
    }
    this.stats = {
      allTimeCoins:0,
      dailyCoins:0,
      raffleCoinBag:0
    }
  }
  update(playFabUserInfo: PlayFabClientModels.GetPlayerCombinedInfoResultPayload | undefined | null){
    
    let mc = -1;
    let gc = -1;
    
    let bronzeShoe = 0//need to be 0 as inventory is not garenteed to have it
    let coinBagRaffleRedeem = 0
    
    if (
      playFabUserInfo?.UserVirtualCurrency !==
      undefined
    ) {
      mc = firstNotNull(playFabUserInfo?.UserVirtualCurrency.MC,mc);
      gc = firstNotNull(playFabUserInfo?.UserVirtualCurrency.GC,gc);
      
    }
    if (
      playFabUserInfo?.UserInventory !==
      undefined
    ) {
      
    }

    //coinLobbyGCCounter.set(gc);
    //coinLobbyMCCounter.set(mc);
    //subCoinGCCounter.set(vb);

    let playerStatics = playFabUserInfo?.PlayerStatistics;
    let coinCollectingEpochStat:PlayFabClientModels.StatisticValue|undefined
    let coinCollectingDailyStat:PlayFabClientModels.StatisticValue|undefined
    let raffleCoinBagDailyStat:PlayFabClientModels.StatisticValue|undefined
    
    if (playerStatics) {
      for (const p in playerStatics) {
        const stat: PlayFabClientModels.StatisticValue = playerStatics[p];
        //log("stat ", stat);
        if (
          stat.StatisticName == "coinsCollectedEpoch"
        ) {
          coinCollectingEpochStat = stat;
        }
        if (
          stat.StatisticName == "coinsCollectedDaily"
        ) {
          coinCollectingDailyStat = stat;
        }
        if (
          stat.StatisticName == "raffle_coin_bag"
        ) {
          raffleCoinBagDailyStat = stat;
        }
      }
      
    }
    //playFabUserInfo.PlayerStatistics
    this.stats.allTimeCoins = coinCollectingEpochStat!==undefined ? coinCollectingEpochStat.Value : 0
    this.stats.dailyCoins = coinCollectingDailyStat!==undefined ? coinCollectingDailyStat.Value : 0
    this.stats.raffleCoinBag = raffleCoinBagDailyStat!==undefined ? raffleCoinBagDailyStat.Value : 0
    
    this.virtualCurrency.gc = gc
    this.virtualCurrency.mc = mc


    this.inventory.bronzeShoe = bronzeShoe
    this.inventory.coinBagRaffleRedeem = coinBagRaffleRedeem

    
  }
}