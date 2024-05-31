import { Material, MaterialTransparencyMode, MeshRenderer, TextureFilterMode, TextureWrapMode, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3, Quaternion, Color4, Color3 }	from "@dcl/sdk/math";

export function setupImagePosters(){

    const tallPoster1 = engine.addEntity()
    Transform.create(tallPoster1, {
        position: Vector3.create(61, 1.15, 36),
        scale: Vector3.create(2.25,2.25,2.25),
        rotation: Quaternion.fromEulerDegrees(0,-60,0)
    })
    MeshRenderer.setPlane(tallPoster1)
    Material.setPbrMaterial(tallPoster1, {
        texture: Material.Texture.Common({
          src: 'images/talSign.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/talSign.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
    const tallPoster1b = engine.addEntity()
    Transform.create(tallPoster1b, {
        position: Vector3.create(61.1, 1.73, 35.5),
        scale: Vector3.create(2.25,2.25,2.25),
        rotation: Quaternion.fromEulerDegrees(0,-60,0)
    })
    MeshRenderer.setPlane(tallPoster1b)
    Material.setPbrMaterial(tallPoster1b, {
        texture: Material.Texture.Common({
          src: 'images/talSign2.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/talSign2.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })

    const tallPoster2 = engine.addEntity()
    Transform.create(tallPoster2, {
        position: Vector3.create(3, 1.15, 28),
        scale: Vector3.create(2.25,2.25,2.25),
        rotation: Quaternion.fromEulerDegrees(0,120,0)
    })
    MeshRenderer.setPlane(tallPoster2)
    Material.setPbrMaterial(tallPoster2, {
        texture: Material.Texture.Common({
          src: 'images/talSign.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/talSign.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
    const tallPoster2b = engine.addEntity()
    Transform.create(tallPoster2b, {
        position: Vector3.create(3.1, 1.73, 28.5),
        scale: Vector3.create(2.25,2.25,2.25),
        rotation: Quaternion.fromEulerDegrees(0,120,0)
    })
    MeshRenderer.setPlane(tallPoster2b)
    Material.setPbrMaterial(tallPoster2b, {
        texture: Material.Texture.Common({
          src: 'images/talSign2.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/talSign2.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
    const howToPoster = engine.addEntity()
    Transform.create(howToPoster, {
        position: Vector3.create(31, 3, 32),
        scale: Vector3.create(2,2,2),
        rotation: Quaternion.fromEulerDegrees(0,90,0)
    })
    MeshRenderer.setPlane(howToPoster)
    Material.setPbrMaterial(howToPoster, {
        texture: Material.Texture.Common({
          src: 'images/howTo.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/howTo.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
    const howToPoster2 = engine.addEntity()
    Transform.create(howToPoster2, {
        position: Vector3.create(33, 3, 32),
        scale: Vector3.create(2,2,2),
        rotation: Quaternion.fromEulerDegrees(0,-90,0)
    })
    MeshRenderer.setPlane(howToPoster2)
    Material.setPbrMaterial(howToPoster2, {
        texture: Material.Texture.Common({
          src: 'images/howTo.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/howTo.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
    const disclaimer1 = engine.addEntity()
    Transform.create(disclaimer1, {
        position: Vector3.create(7.46, 3.5, 35),
        scale: Vector3.create(3,3,3),
        rotation: Quaternion.fromEulerDegrees(0,0,0)
    })
    MeshRenderer.setPlane(disclaimer1)
    Material.setPbrMaterial(disclaimer1, {
        texture: Material.Texture.Common({
          src: 'images/disclaimer1.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/disclaimer1.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
    const disclaimer2 = engine.addEntity()
    Transform.create(disclaimer2, {
        position: Vector3.create(57, 3.5, 29),
        scale: Vector3.create(3,3,3),
        rotation: Quaternion.fromEulerDegrees(0,180,0)
    })
    MeshRenderer.setPlane(disclaimer2)
    Material.setPbrMaterial(disclaimer2, {
        texture: Material.Texture.Common({
          src: 'images/disclaimer1.png',
        }),
        emissiveTexture: Material.Texture.Common({
            src: 'images/disclaimer1.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
        emissiveColor: Color3.White(),
        emissiveIntensity: 1
    })
}