## `dcl-gamejam-2024`

# Decentraland GameJam 2024

This is the working repo for Vroomway's entry to the 2024 Decentraland GameJam!


---

## Contents

-   [Resources](#resources)
-   [Repository Overview](#repository-overview)
-   [Getting Started](#getting-started)
-   [Cloning this repository](#cloning-this-repository)
-   [Running the DCL scene](#running-the-dcl-scene)
-   [Updating DCL dependencies](#updating-dcl-dependencies)
-   [Prerequisites](#prerequisites)
-   [License](#license)

---

## Resources

Some links to various non-Git resources:

| Resource           |  URL |
|--------------------|:----------------------------------------------------|
| Jam details        | https://itch.io/jam/dclgx |
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
-   `/dcl` - the DCL scene to be deployed. Exported glTF files are in `/dcl/assets/gltf` along with a `tex` folder of optimised textures
    -   `/dcl/assets` - various assets in subfolders including gltf files, sfx, images, animations
-   `/reference` - screenshots, previs, reference pictures used during asset creation
-   `/scripts` - various bash utility scripts

# Getting Started

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

## Bash Scripts Prerequisites

The Bash scripts in this repository have been tested on Ubuntu on WSL. See [DEPENDENCIES](DEPENDENCIES.md) for information on installing the following requirements:

-   node.js + npm
-   dcl
-   gltf-pipeline
-   pngquant
-   pngout


---

## License

This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/, see the license included in this repository, or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
