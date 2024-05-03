import bpy
import os
from xml.etree.ElementTree import tostring

def export2gltf():
	# Set the export path to be the /dcl/models folder.
	# This assumes this script is located in /scripts/ and has not been moved
	path = os.path.abspath('../dcl/models')

	# Check if the path exists. If it doesn't, throw an error
	if not os.path.exists(path):
		path = os.path.abspath('dcl/models')

		if not os.path.exists(path):
			print("--------------------------------------------")
			print("ERROR: the path above does not exist")
			print("ERROR: this script should be run from the /scripts/ directory and expects ../dcl/models/ to exist")
			print("--------------------------------------------")
			return

	print("Export path is determined as: " + path)

	# Set the export file name
	fPath = str((path + '/' + bpy.path.display_name_from_filepath(bpy.context.blend_data.filepath) + '.gltf'))


	# Collection and object checking/selection

	# Check that the "_export" collection exists
	exportCollectionExists = False
	for col in bpy.data.collections:
		if col.name == "_export":
			exportCollectionExists = True
			break

	if not exportCollectionExists:
		print("--------------------------------------------")
		print("ERROR: a collection called '_export' could not be found. Nothing to do...")
		print("--------------------------------------------")
		return

	# Deselect all the objects
	#bpy.ops.object.select_all(action='DESELECT')

	# set the _export collection as the active collection (for the export below)
	#layer_collection = bpy.context.view_layer.layer_collection
	#layerColl = recurLayerCollection(layer_collection, '_export')
	#bpy.context.view_layer.active_layer_collection = layerColl


	#Select all objects in the _export collection
	count=0
	for obj in bpy.data.collections['_export'].all_objects:
		count+=1
		obj.select_set(True)

	print("_export contains " + str(count) + " objects")

	# Do the actual export, with big block of settings
	bpy.ops.export_scene.gltf(\
		filepath                             = fPath,\
		export_all_influences                = True,\
		export_animations                    = True,\
		export_apply                         = True,\
		export_cameras                       = False,\
		export_colors                        = False,\
		export_copyright                     = '',\
		export_current_frame                 = False,\
		export_def_bones                     = False,\
		export_displacement                  = False,\
		export_draco_mesh_compression_enable = False,\
		export_extras                        = False,\
		export_force_sampling                = True,\
		export_format                        = 'GLTF_SEPARATE',\
		export_frame_range                   = True,\
		export_frame_step                    = 1,\
		export_image_format                  = 'AUTO',\
		export_keep_originals                = False,\
		export_lights                        = False,\
		export_materials                     = 'EXPORT',\
		export_morph                         = False,\
		export_morph_normal                  = True,\
		export_morph_tangent                 = False,\
		export_nla_strips                    = True,\
		export_normals                       = True,\
		export_skins                         = True,\
		export_tangents                      = True,\
		export_texcoords                     = True,\
		export_texture_dir                   = 'tex',\
		export_yup                           = True,\
		optimize_animation_size              = True,\
		use_active_collection                = False,\
		use_mesh_edges                       = False,\
		use_mesh_vertices                    = False,\
		use_renderable                       = False,\
		use_selection                        = True,\
		use_visible                          = False
	)

def recurLayerCollection(layerColl, collName):
    found = None
    if (layerColl.name == collName):
        return layerColl
    for layer in layerColl.children:
        found = recurLayerCollection(layer, collName)
        if found:
            return found

export2gltf()
