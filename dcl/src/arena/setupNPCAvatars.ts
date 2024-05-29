import { AvatarShape, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3, Quaternion, Color3 }	from "@dcl/sdk/math";
import { getPlayer } from "@dcl/sdk/src/players";

export function setupNPCAvatars(){
    let userData = getPlayer()
    const red = Color3.fromHexString('E83D29')
    const myAvatar1 = engine.addEntity()
    AvatarShape.create(myAvatar1, {
		id: 'Manequin',
		emotes: [],
		wearables: [`urn:decentraland:matic:collections-v2:0xf05e461eac1f54cd62c3059bcb56016cb9a47ac8:0`,`urn:decentraland:matic:collections-v2:0xf05e461eac1f54cd62c3059bcb56016cb9a47ac8:1`,
        `urn:decentraland:matic:collections-v2:0xff6d2c1544e4af0796879d37f36af60973b4be2d:0`,
        `urn:decentraland:matic:collections-v2:0xa8a4e51633c50dcb81e64a16a04b71b69c813868:0`,
        `urn:decentraland:matic:collections-v2:0x86cbd72333fee1c39ede8648e63c9ab2a42fbdcf:1`,
        `urn:decentraland:matic:collections-v2:0x943a1a9c2fe782eca6bd35e5fed8d3dcb172c1c8:0`,
        `urn:decentraland:matic:collections-v2:0x4113973870d529f4c0a938102144412d8596613d:2`
        ],
        //expressionTriggerId: 'clap',
        name: 'Nikki Fuego',
        bodyShape: `urn:decentraland:off-chain:base-avatars:BaseFemale`,
        hairColor: red

	})
    
    Transform.create(myAvatar1, {
        position: Vector3.create(62, .1, 27.5),
        rotation: Quaternion.fromEulerDegrees(0,45,0),
        scale: Vector3.create(1,1,1),
    })

    const myAvatar2 = engine.addEntity()
    AvatarShape.create(myAvatar2, {
		id: 'Manequin',
		emotes: [],
		wearables: [`urn:decentraland:matic:collections-v2:0xfe91e9cec6e477c7275a956b6995ea0ca571abb8:0`,`urn:decentraland:matic:collections-v2:0x2f069e329e9bf89d3f108661414ebe22294df145:0`,
        `urn:decentraland:matic:collections-v2:0x8a47b5605338a00fc63b6b9c8c9682473d7089be:0`,
        `urn:decentraland:matic:collections-v2:0xd84257fc6cde426adb0c5e11244a7b19117977cb:0`,
        `urn:decentraland:matic:collections-v2:0xee8ae4c668edd43b34b98934d6d2ff82e41e6488:4`,
        `urn:decentraland:matic:collections-v2:0xbd2a6292c95cd6a7ecdf57b569dfccfe328a743c:0`
        ],
        expressionTriggerId: 'dance',
        name: 'Skeeter',
        bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseMale'
	})
    
    Transform.create(myAvatar2, {
        position: Vector3.create(30, 0.1, 25.5),
        rotation: Quaternion.fromEulerDegrees(0,0,0),
        scale: Vector3.create(1,1,1),
    })

    const myAvatar3 = engine.addEntity()
    AvatarShape.create(myAvatar3, {
		id: 'Manequin',
		emotes: [],
		wearables: [`urn:decentraland:matic:collections-v2:0xcd39a53893e8323b17beae02dd38649a2a6ba820:0`,`urn:decentraland:matic:collections-v2:0x85db00d72ae4810b9708f1b913d7652035f1b0c6:0`,
        `urn:decentraland:matic:collections-v2:0x92698f59b66431f0f858a43b817d03c637b57cb4:0`,
        `urn:decentraland:matic:collections-v2:0x6f4b9bc4a0410e762cd27c21c2976bf770888409:0`
        ],
        expressionTriggerId: 'dance',
        name: 'Doll',
	})
    
    Transform.create(myAvatar3, {
        position: Vector3.create(41, 1.5, 44),
        rotation: Quaternion.fromEulerDegrees(0,-140,0),
        scale: Vector3.create(1,1,1),
    })
}