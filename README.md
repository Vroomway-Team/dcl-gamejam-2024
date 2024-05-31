## `dcl-gamejam-2024`

# Bumperz 
## DCL GameJam 2024

This is the repo for Vroomway's entry to the 2024 Decentraland GameJam!

This game was designed and created in four weeks for the Decentraland Game Jam 2024. 

All programming was done using Typescript and Decentralands SDK7 package. Colyseus and Heroku servers were used for multiplayer components. 

All 3D and 2D components were made by our team 100% from scratch for this Game Jam. 

Our team consists of 4 people:

* Programmers: @AlexCodesGames, @stom66, and @wacaine
* Artists: @Nikki-Fuego and @stom66 


![alt text](https://github.com/Vroomway-Team/dcl-gamejam-2024/blob/main/assets/images/itch-banner-transparent.png?raw=true)

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
| Itch.io page       | https://vroomway.itch.io/bumperz-bumper-cars-in-decentraland |
| Game Design Doc    | https://docs.google.com/document/d/121B1S32TNgfl0ZR_-b1Skm3fCHIiHiqV3wGUqbeIyrY |


## Repository Overview

> Note that the actual DCL scene is in the subfolder `dcl` to avoid having extra junk in the deployed scene. This repository is split in the following folders:

-   `/assets` - contains all assets and textures before being exported to `glTF`: blend files, textures,  etc.
    -   `/assets/models` - source files for each model in the scene, including full res textures
    -   `/assets/fonts` - any fonts used in the scene and accompanying media
    -   `/assets/tex` - asset agnostic textures used across the scene
-   `/dcl` - the DCL scene to be deployed. Exported glTF files are in `/dcl/assets/gltf` along with a `tex` folder of optimised textures
    -   `/dcl/assets` - various assets in subfolders including gltf files, sfx, images, animations
-   `/reference` - screenshots, previs, reference pictures used during asset creation
-   `/scripts` - various bash & blender utility scripts

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

> Note: the dcl scene is in the `/dcl` folder

1. Open the repository folder in VSCode
1. Open a terminal with: `Ctrl + '`
1. Type in the terminal: 
```
cd dcl
npm install
npm run start
```

---

## License

This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/, see the license included in this repository, or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
