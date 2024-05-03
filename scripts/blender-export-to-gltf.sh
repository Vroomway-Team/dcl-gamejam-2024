#!/bin/bash
#
# This expects to be passed a blend file with a relative path.
# For best results, keep this script located in the ./scripts folder
#
# It triggers a background instance of blender to run the blender-export-to-gltf.py
# against the supplied blend file
#
# How to use:
# Best to run the belend.watch.sh script instead and let it handle things.
#
# You may also run it as follows:
#	./blender-export-to-gltf.sh ../assets/models/example.blend

if [ $1 ]; then
	echo "Specified file: $1"
else
	echo "ERROR: no blend file supplied."
	exit 1
fi

DIR=${PWD##*/}
echo "CWD is $DIR"

if [ "$DIR" == "scripts" ]; then
	blender31 -b $1 -P blender-export-to-gltf.py
else
	blender31 -b $1 -P scripts/blender-export-to-gltf.py
fi
