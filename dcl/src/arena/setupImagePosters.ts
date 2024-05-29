import { Material, MaterialTransparencyMode, MeshRenderer, TextureFilterMode, TextureWrapMode, Transform, engine } from "@dcl/sdk/ecs";
import { Vector3, Quaternion, Color4, Color3 }	from "@dcl/sdk/math";

export function setupImagePosters(){

    const tallPoster = engine.addEntity()
    Transform.create(tallPoster, {
        position: Vector3.create(61, 1.15, 36),
        scale: Vector3.create(2.25,2.25,2.25),
        rotation: Quaternion.fromEulerDegrees(0,-60,0)
    })
    MeshRenderer.setPlane(tallPoster)
    Material.setPbrMaterial(tallPoster, {
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
}