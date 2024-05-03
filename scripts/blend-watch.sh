#!/bin/bash
#
# This is a simple script to trigger onwatch to monitor the assets directory for changes.
# When a change to any *.blend file is detected it will trigger the blender-export-to-gltf.sh
# script located in this directory.
#
# For more information on that script view the comments in its code
#
# To use this blend-watch script, launch it from the terminal as follows:
# 	cd scripts
#	./blend-watch.sh

onchange  -v -p 500 --await-write-finish 1500 '../assets/**/*.blend' -- ./blender-export-to-gltf.sh {{file}}
