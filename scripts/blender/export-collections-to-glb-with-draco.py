# WhatDo:
#
# This script is setup to export all of the _export collections to the folder decalred below
#
# How it works:
# 	Loops through the current collection structure
#		If a collection contains the string '_export.'
#			Export all objects within it as a glTF
#
#
# How to use:
# 	Move all items that are to be exported together into a collection
# 	Name the collection, including the MATCH_STRING below, eg: `_export.floor.01`
# 	(Optionally) Go to Window -> Toggle System Console
# 	Click the play button to run the script
# 	Wait while it runs (approx 10s per object)

# Define the string to search for in collection names
MATCH_STRING = '_export.'

# Define the output path here:
# Note that blender uses "//" for relative paths
# Relative paths start from the blend file directory not the location of the script
OUTPUT_PATH = "//../../../dcl-scene/models/glb"

# Set the name of the log file
# This will create a text window with this name to get some output without having to open the
# system console
LOG_PATH = "output.log"

#
# --------------------------------------------------------------------------------------------
#

import bpy
import os
from xml.etree.ElementTree import tostring

# ██╗      ██████╗  ██████╗  ██████╗ ██╗███╗   ██╗ ██████╗
# ██║     ██╔═══██╗██╔════╝ ██╔════╝ ██║████╗  ██║██╔════╝
# ██║     ██║   ██║██║  ███╗██║  ███╗██║██╔██╗ ██║██║  ███╗
# ██║     ██║   ██║██║   ██║██║   ██║██║██║╚██╗██║██║   ██║
# ███████╗╚██████╔╝╚██████╔╝╚██████╔╝██║██║ ╚████║╚██████╔╝
# ╚══════╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝
#

if LOG_PATH not in bpy.data.texts:
	LOG_TXT = bpy.data.texts.new(LOG_PATH)
else:
	LOG_TXT = bpy.data.texts[LOG_PATH]
	LOG_TXT.clear()

def log(message):
	print(message)
	LOG_TXT.write(message + '\n')



# ███████╗██╗  ██╗██████╗  ██████╗ ██████╗ ████████╗    ██╗      ██████╗  ██████╗ ██████╗
# ██╔════╝╚██╗██╔╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██║     ██╔═══██╗██╔═══██╗██╔══██╗
# █████╗   ╚███╔╝ ██████╔╝██║   ██║██████╔╝   ██║       ██║     ██║   ██║██║   ██║██████╔╝
# ██╔══╝   ██╔██╗ ██╔═══╝ ██║   ██║██╔══██╗   ██║       ██║     ██║   ██║██║   ██║██╔═══╝
# ███████╗██╔╝ ██╗██║     ╚██████╔╝██║  ██║   ██║       ███████╗╚██████╔╝╚██████╔╝██║
# ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝
#
# Now onto the main functions
def export2gltf(path):

	# Check that the "_export" collection exists
	exportCollectionExists = False

	# Loop through all collections in the current view layer
	for col in bpy.context.view_layer.layer_collection.children:

		# Check if the colelction name contains the MATCH_STRING
		if col.name.count(MATCH_STRING):

			# Log success: found a collection to export and flip found flag
			log("Found collection to export: " + col.name)
			exportCollectionExists = True

			# Set the export file name to match the collection name (minus the MATCH_STRING)
			file_name = col.name.replace(MATCH_STRING, '')
			file_path = str((path + '/' + file_name + '.glb'))

			# Set the collection as the active collection
			bpy.context.view_layer.active_layer_collection = col

			# Run the export
			log("Exporting as " + file_name + " to path: " + file_path)
			doExport(col.name, file_path)

	if not exportCollectionExists:
		log("--------------------------------------------")
		log("ERROR: a collection with '_export.' in the name could not be found. Nothing to do...")
		log("--------------------------------------------")


# ███████╗██╗  ██╗██████╗  ██████╗ ██████╗ ████████╗███████╗██████╗
# ██╔════╝╚██╗██╔╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
# █████╗   ╚███╔╝ ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██████╔╝
# ██╔══╝   ██╔██╗ ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██╔══██╗
# ███████╗██╔╝ ██╗██║     ╚██████╔╝██║  ██║   ██║   ███████╗██║  ██║
# ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
#

def doExport(name, path):

	# Deselect all the objects
	bpy.ops.object.select_all(action='DESELECT')

	#Count all objects in the currently selected _export collection
	count=0

	for obj in bpy.data.collections[name].all_objects:
		count+=1

	log(name + " contains " + str(count) + " objects")


	# Do the actual export, with big block of settings
	bpy.ops.export_scene.gltf(\
		# Selection
		use_renderable                          = False, \
		use_selection                           = False, \
		use_visible                             = False, \
		use_active_collection                   = True, \
		use_active_collection_with_nested       = True, \

		# Basic export settings
		filepath                                 = path, \
		export_format                           = 'GLB', \

		# Texture settings
		export_keep_originals                   = False, \
		export_image_format                     = 'AUTO', \
		export_texture_dir                      = 'tex', \
		export_materials                        = 'EXPORT', \

		# Compression settings
		export_draco_mesh_compression_enable    = True, \
		export_draco_mesh_compression_level     = 10, \
		export_optimize_animation_size          = True, \

		# Object data
		export_apply                            = True, \
		export_colors                           = False, \
		export_copyright                        = '', \
		export_extras                           = False, \
		export_morph                            = False, \
		export_morph_normal                     = False, \
		export_morph_tangent                    = False, \
		export_normals                          = True, \
		export_skins                            = False, \
		export_tangents                         = True, \
		export_texcoords                        = True, \
		export_yup                              = True, \
		use_mesh_edges                          = False, \
		use_mesh_vertices                       = False, \

		# Animation settings
		export_animations                       = True, \
		export_current_frame                    = False, \
		export_force_sampling                   = False, \
		export_frame_range                      = True, \
		export_frame_step                       = 1, \
		export_nla_strips                       = True, \
		#export_nla_strips_merged_animation_name = "action", \

		# Armature settings
		export_all_influences                   = True, \
		export_anim_single_armature             = True, \
		export_def_bones                        = False, \
		export_reset_pose_bones                 = True, \

		# Extra objects
		export_cameras                          = False, \
		export_lights                           = False

	)
	log("Finished attempting to export: " + name)
	log("------------------------------------------------")



# ███╗   ███╗ █████╗ ██╗███╗   ██╗
# ████╗ ████║██╔══██╗██║████╗  ██║
# ██╔████╔██║███████║██║██╔██╗ ██║
# ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
# ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
# ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
#

# Get absolute path:
path = bpy.path.abspath(OUTPUT_PATH)

if not os.path.exists(path):
	log("--------------------------------------------")
	log("ERROR: " + path)
	log("ERROR: the path above does not exist")
	log("--------------------------------------------")
else:
	log("Export path is determined as: " + path)

	# Trigger the export
	export2gltf(path)
	log("Export complete!")
