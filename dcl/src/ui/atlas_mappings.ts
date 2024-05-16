
const atlasHeight = 4080  
const atlasWidth = 4080

const inventoryAtlasHeight = 1325  
const inventoryAtlasWidth = 1932

export default {
  atlasData:{
    customAtlas:{
      atlasHeight: atlasHeight,
      atlasWidth:  atlasWidth
    },
    inventory:{
      atlasHeight: inventoryAtlasHeight,
      atlasWidth:  inventoryAtlasWidth
    }
  },
  icons: {
    website: {
      sourceWidth: 124,
      sourceHeight: 116,
      sourceLeft: 3192,
      sourceTop: 3328,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    discord: {
      sourceWidth: 124,
      sourceHeight: 116,
      sourceLeft: 3068,
      sourceTop: 3328,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    twitter: {
      sourceWidth: 124,
      sourceHeight: 116,
      sourceLeft: 2944,
      sourceTop: 3328,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    coin: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432+6,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    dimond: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 - 130 - 6,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },


    LeaderBoardicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    LeaderBoardicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    }
  },
  backgrounds: {
    staminaPanel:{
      sourceLeft : 0,
      sourceTop : 3586,
      sourceWidth : 1271,
      sourceHeight : 330,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    expandPanel: {
      sourceWidth: 504,
      sourceHeight: 176,
      sourceLeft: 2368,
      sourceTop: 3316,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    rewardsPanel: {
      sourceWidth: 1210,
      sourceHeight: 1271,
      sourceLeft: 2002,
      sourceTop: 0,//is this right?????
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    
    emptyPanel:{
      sourceWidth: 2024,
      sourceHeight: 1400,
      sourceLeft: 0,
      sourceTop: 0,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    claimPanel:{
      sourceWidth: 1986,
      sourceHeight: 1271,
      sourceLeft: 0,
      sourceTop: 1601,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    transparent:{
      sourceWidth: 1,
      sourceHeight: 1,
      sourceLeft: 0,
      sourceTop: 0,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    }
  },
  buttons:{
    
    primaryRound:{
      sourceLeft : 2035,
      sourceWidth : 660,
      sourceTop : 2585 + 30,
      sourceHeight : 140,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    grayRound:{
      sourceLeft : 2824,
      sourceWidth :360,
      sourceTop : 2414,
      sourceHeight : 140,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    }
  }
};
