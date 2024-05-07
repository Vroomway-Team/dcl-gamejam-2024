## `dcl-gamejam-2024`

# Decentraland GameJam 2024

This is the working repo for Vroomway's entry to the 2024 Decentraland GameJam!


---

## Contents

-   [Resources](#resources)
-   [Repository Overview](#repository-overview)
-   [Getting Started](#getting-started)
-   [Prerequisites](#prerequisites)
-   [Cloning this repository](#cloning-this-repository)
-   [Running the DCL scene](#running-the-dcl-scene)
-   [Updating DCL dependencies](#updating-dcl-dependencies)
-   [Enabling automatic deployments](#enabling-automatic-deployment)
-   [Asset Pipline Overview](#asset-pipline-overview)
-   [Asset and Program configs](/config)
    -   [Textures](#textures)
    -   [Shaders](#shaders)

---

## Resources

Some links to various non-Git resources:

| Resource           |  URL |
|--------------------|:----------------------------------------------------|
| Jame details       | https://itch.io/jam/dclgx |
| Kanban             | https://kanboard.stom66.co.uk/board/14 |
| Miro board         | https://miro.com/app/board/uXjVKPVY2a0=/ |
| Game Design Doc    | https://docs.google.com/document/d/121B1S32TNgfl0ZR_-b1Skm3fCHIiHiqV3wGUqbeIyrY/edit |


## Repository Overview

Note that the actual DCL scene is in the subfolder `dcl` to avoid having extra junk in the deployed scene. This repository is split in the following folders:

-   `/assets` - contains all assets and textures before being exported to `glTF`. This includes all `blend` and `FBX` files, as well as full-size source textures.
    -   `/assets/models` - source files for each model in the scene, including full res textures
    -   `/assets/fonts` - any fonts used in the scene and accompanying media
    -   `/assets/tex` - asset agnostic textures used across the scene
-   `/config` - useful info such as import/export settings, UVPackMaster Presets, shader templates
-   `/dcl` - the DCL scene to be deployed. Exported glTF files are in `/dcl-scene/models` along with a `tex` folder of optimised textures
-   `/reference` - screenshots, previs, reference pictures used during asset creation
-   `/scripts` - various bash utility scripts

# Getting Started

## Prerequisites

The Bash scripts in this repository have been tested on Ubuntu on WSL. See [DEPENDENCIES](DEPENDENCIES.md) for information on installing the following requirements:

-   node.js + npm
-   dcl
-   gltf-pipeline
-   pngquant
-   pngout

---

## Cloning this repository

1. Clone this repo in your favourite way: via GitHub Desktop, or by running the following in a terminal
    ```
    git clone https://github.com/stom66/dcl-gamejam-2024
    ```
1. Once complete, open the folder in a terminal or in VSCode and run the following:
    ```
     cd dcl && npm install
    ```

---

## Running the DCL scene

1. Open the repository folder in VSCode
1. Open a terminal with: `Ctrl + '`
1. Type in the terminal: `cd dcl && npm run start`, press `Enter`

---

## Updating DCL dependencies

Run the following in a terminal:

```
cd dcl
npm rm decentraland -g
npm install -g decentraland
npm i decentraland-ecs@latest
```

---

## Enabling Automatic Deployment

-   Ensure that `package.json` includes a script named `deploy` which runs `dcl deploy`
-   Ensure the branch specified in `.github\workflows\main.yml` matches the branch you wish to deploy to; the default is `deploy`
-   In GitHub repository **Settings -> Secrets and variables -> Actions**, create a key `DCL_PRIVATE_KEY` in the \*_Repository secrets_ containing the Private key of a wallet authorised to deploy.

**Warning**: it's very important to use a different wallet than that which owns the plot. Create a single-use wallet with deployment rights which can be revoked if this repository is compromised and the private key is leaked.

---

### Asset Pipline Overview

1. Make model in Blender:
    - Unwrap **UVs**, aiming for > 75% use
    - See [UVPackMaster profiles](/config#uvpackmaster3-profiles).
    - Use multiple tiles where a material requires more detail
    - Paint suitable **Vertex colors**
    - Add enough **Material slots** for the number of textures required (all slots initially set to use the same material, to facilitate painting in Substance)
2. Export the model as `FBX`
    - Use the settings described under [FBX exports](/config#fbx-exports)
3. Import and paint the model in Substance
    - Use the project settings described under [Substance Painter](/config#substance-painter)
4. Export the textures from Substance to `/assets/models/<model_name>/tex`
    - See notes below in [Textures](#textures)
5. Assign the textures to the materials in Blender, and assign the materials to the correct slots
    - See notes below in [Shaders](#shaders)
6. Export as a `glTF` to `/dcl-scene/models/<model_name>/<model_name>.gltf`
    - Use the settings described under [glTF Exports](/config#gltf-exports).
7. (Optional) Optimise the glTF textures with `scripts/png-optimise.sh`

## There is a watch script at `scripts/blend-watch.sh` that will watch the `assets` directory for updates to blend file and export them automatically.

### Textures

Exported textures should be no larger than 1024px. The following names should be used:

-   \*\_BaseColor.png
-   \*\_ORM.png
-   \*\_Normal.png
-   \*\_Emissive.png (optional)

There are example export templates for Substance in the `config` folder, [see here](/config#substance-painter).

---

### Shaders

There is an example material with correctly configured shaders for exporting to glTF in `assets/gltf-material.blend`. Append this to your file, or re-create it as shown in the example below.

> Note: the AO map is optional.

Shaders must follow the setup shown here, due to the way the glTF exporter works. More information about it can be found in the Blender Wiki: [Import-Export glTF 2.0](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)

![Blender export gltf settings](/config/gltf_shader.png)


---

## License

This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/, see the license included in this repository, or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
