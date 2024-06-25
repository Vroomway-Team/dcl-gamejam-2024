import { Material, MaterialTransparencyMode, MeshRenderer, TextureFilterMode, TextureWrapMode, Transform, VideoPlayer, engine } from "@dcl/sdk/ecs";
import { Vector3, Quaternion, Color4, Color3 }	from "@dcl/sdk/math";

export function setupImagePosters(){

	// This Tall To Clown posters
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
	
	
	// How to play posters
	const htpScale = 2.4
	
	const howToPoster = engine.addEntity()
	Transform.create(howToPoster, {
		position: Vector3.create(31.5, 3.75, 32),
		scale: Vector3.create(htpScale, htpScale, htpScale),
		rotation: Quaternion.fromEulerDegrees(-20,90,0)
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
		position: Vector3.create(32.60, 3.75, 32),
		scale: Vector3.create(htpScale, htpScale, htpScale),
		rotation: Quaternion.fromEulerDegrees(-20,-90,0)
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
	//Promos
	const promo1 = engine.addEntity()
	Transform.create(promo1, {
		position: Vector3.create(59.5, 4.15, 21.42),
		scale: Vector3.create(11,5,5),
		rotation: Quaternion.fromEulerDegrees(0,-90,0)
	})
	MeshRenderer.setPlane(promo1)
	Material.setPbrMaterial(promo1, {
		texture: Material.Texture.Common({
		  src: 'images/header2.png',
		}),
		emissiveTexture: Material.Texture.Common({
			src: 'images/header2.png',
		}),
		transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
		emissiveColor: Color3.White(),
		emissiveIntensity: 1
	})
	const promo2 = engine.addEntity()
	Transform.create(promo2, {
		position: Vector3.create(4.5, 4.15, 42.60),
		scale: Vector3.create(11,5,5),
		rotation: Quaternion.fromEulerDegrees(0,90,0)
	})
	MeshRenderer.setPlane(promo2)
	Material.setPbrMaterial(promo2, {
		texture: Material.Texture.Common({
		  src: 'images/header2.png',
		}),
		emissiveTexture: Material.Texture.Common({
			src: 'images/header2.png',
		}),
		transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
		emissiveColor: Color3.White(),
		emissiveIntensity: 1
	})
	
	const screen = engine.addEntity()
		MeshRenderer.setPlane(screen)
		Transform.create(screen, { 
			position: { x: 4.5, y: 4.25, z: 23 },
			scale: {x: 6.5, y: 4, z:4},
			rotation: Quaternion.fromEulerDegrees(0,90,0)
		}
	)
	VideoPlayer.create(screen, {
	  src: 'videos/promo1.mp4',
	  playing: true,
	  loop: true
	})
	const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })
	Material.setPbrMaterial(screen, {
	  texture: videoTexture,
	  roughness: 1.0,
	  specularIntensity: 0,
	  metallic: 0,
	})
	const screen2 = engine.addEntity()
		MeshRenderer.setPlane(screen2)
		Transform.create(screen2, { 
			position: { x: 59.5, y: 4.25, z: 41.5 },
			scale: {x: 6.5, y: 4, z:4},
			rotation: Quaternion.fromEulerDegrees(0,-90,0)
		}
	)
	VideoPlayer.create(screen2, {
	  src: 'videos/promo1.mp4',
	  playing: true,
	  loop: true
	})
	Material.setPbrMaterial(screen2, {
	  texture: videoTexture,
	  roughness: 1.0,
	  specularIntensity: 0,
	  metallic: 0,
	})
	//Controls image
	const controlsImage1 = engine.addEntity()
	Transform.create(controlsImage1, {
		position: Vector3.create(32.15, 1.85, 32),
		scale: Vector3.create(3,1.2,1),
		rotation: Quaternion.fromEulerDegrees(0,-90,0)
	})
	MeshRenderer.setPlane(controlsImage1)
	Material.setPbrMaterial(controlsImage1, {
		texture: Material.Texture.Common({
		  src: 'images/itch-info-controls.png',
		}),
		emissiveTexture: Material.Texture.Common({
			src: 'images/itch-info-controls.png',
		}),
		transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
		emissiveColor: Color3.White(),
		emissiveIntensity: 1
	})
	const controlsImage2 = engine.addEntity()
	Transform.create(controlsImage2, {
		position: Vector3.create(31.95, 1.85, 32),
		scale: Vector3.create(3,1.2,1),
		rotation: Quaternion.fromEulerDegrees(0,90,0)
	})
	MeshRenderer.setPlane(controlsImage2)
	Material.setPbrMaterial(controlsImage2, {
		texture: Material.Texture.Common({
		  src: 'images/itch-info-controls.png',
		}),
		emissiveTexture: Material.Texture.Common({
			src: 'images/itch-info-controls.png',
		}),
		transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
		emissiveColor: Color3.White(),
		emissiveIntensity: 1
	})
}