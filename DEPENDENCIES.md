
## Dependencies

The Bash scripts in this repository have been tested on Ubuntu on WSL and have the following dependencies:

* ### Kitchen sink:
	This is an all-in-one command to install every dependency listed below

	```
	sudo apt install -y nodejs npm pngquant screen
	npm install -g gltf-pipeline onchange dcl
	wget https://www.jonof.id.au/files/kenutils/pngout-20200115-linux.tar.gz &&
	tar -xf pngout-20200115-linux.tar.gz &&
	rm pngout-20200115-linux.tar.gz &&
	sudo cp pngout-20200115-linux/x86_64/pngout /bin/pngout &&
	rm -rf pngout-20200115-linux
	```

	Install Blender:
	```
	wget https://download.blender.org/release/Blender3.1/blender-3.1.2-linux-x64.tar.xz &&
	tar -xf blender-3.1.2-linux-x64.tar.xz &&
	rm blender-3.1.2-linux-x64.tar.xz &&
	sudo cp -r blender-3.1.2-linux-x64 /usr/local/bin/ &&
	rm -rf blender-3.1.2-linux-x64 &&
	sudo mv /usr/local/bin/blender /usr/local/bin/blender32
	sudo ln -s /usr/local/bin/blender-3.1.2-linux-x64/blender /usr/local/bin/blender31
	```



* #### [Node.js](https://nodejs.org/en/_)
	```
	sudo apt install -y nodejs npm
	```

* #### gltf-pipeline
	```
	npm install -g gltf-pipeline
	```
	
* #### dcl
	```
	npm install -g dcl
	```
	
* #### onchange
	```
	npm install -g onchange
	```

* #### pngquant
	```
	sudo apt-get install -y pngquant
	```
* #### pngout
	```
	wget https://www.jonof.id.au/files/kenutils/pngout-20200115-linux.tar.gz &&
	tar -xf pngout-20200115-linux.tar.gz &&
	rm pngout-20200115-linux.tar.gz &&
	sudo cp pngout-20200115-linux/x86_64/pngout /bin/pngout &&
	rm -rf pngout-20200115-linux
	```

* #### Blender 3.1+
	Note: at this time Blender 3.2.0 has a bug with the gltf exporter which canr esult in incorrect rotations.

	```
	wget https://download.blender.org/release/Blender3.1/blender-3.1.2-linux-x64.tar.xz &&
	tar -xf blender-3.1.2-linux-x64.tar.xz &&
	rm blender-3.1.2-linux-x64.tar.xz &&
	sudo cp -r blender-3.1.2-linux-x64 /usr/local/bin/ &&
	rm -rf blender-3.1.2-linux-x64 &&
	sudo mv /usr/local/bin/blender /usr/local/bin/blender32
	sudo ln -s /usr/local/bin/blender-3.1.2-linux-x64/blender /usr/local/bin/blender31
	```
	
	Run `blender -v` to check it is correctly installed

