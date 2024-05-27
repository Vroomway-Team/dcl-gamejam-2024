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
OUTPUT_PATH = "//../../../dcl/assets/gltf"

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
        if col.name.count(MATCH_STRING) and not col.exclude:

            # Log success: found a collection to export and flip found flag
            log("Found collection to export: " + col.name)
            exportCollectionExists = True

            # Set the export file name to match the collection name (minus the MATCH_STRING)
            file_name = col.name.replace(MATCH_STRING, '')
            file_path = str((path + '/' + file_name + '.gltf'))

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
    bpy.ops.export_scene.gltf( #Export settings:
        # Selection
        use_active_collection                        = True,
        use_active_collection_with_nested            = True,
        use_active_scene                             = False,
        use_mesh_edges                               = False,
        use_mesh_vertices                            = False,
        use_renderable                               = False,
        use_selection                                = False,
        use_visible                                  = False,

        # Basic export settings
        filepath                                = path,
        export_format                           = 'GLTF_SEPARATE',

        # Draco settings
        export_draco_color_quantization              = 10,
        export_draco_generic_quantization            = 12,
        export_draco_mesh_compression_enable         = True,
        export_draco_mesh_compression_level          = 6,
        export_draco_normal_quantization             = 10,
        export_draco_position_quantization           = 14,
        export_draco_texcoord_quantization           = 12,

        # Other stuff
		export_action_filter                         = False,
		export_all_influences                        = True,
		export_anim_scene_split_object               = True,
		export_anim_single_armature                  = True,
		export_anim_slide_to_zero                    = True,
		#export_animation_mode                        = 'NLA_TRACKS',
		export_animations                            = True,
		export_apply                                 = True,
		export_armature_object_remove                = False,
		export_attributes                            = False,
		export_bake_animation                        = False,
		export_cameras                               = False,
		export_colors                                = False,
		export_copyright                             = '',
		export_current_frame                         = True,
		export_def_bones                             = True,
		export_extras                                = False,
		export_force_sampling                        = True,
		export_frame_range                           = True,
		export_frame_step                            = 1,
		export_gltfpack_noq                          = True,
		export_gltfpack_sa                           = False,
		export_gltfpack_si                           = 1.0,
		export_gltfpack_slb                          = False,
		export_gltfpack_tc                           = True,
		export_gltfpack_tq                           = 8,
		export_gltfpack_vc                           = 8,
		export_gltfpack_vn                           = 8,
		export_gltfpack_vp                           = 14,
		export_gltfpack_vpi                          = 'Integer',
		export_gltfpack_vt                           = 12,
		export_gn_mesh                               = False,
		export_gpu_instances                         = False,
		export_hierarchy_flatten_bones               = False,
		export_hierarchy_flatten_objs                = False,
		export_hierarchy_full_collections            = False,
		export_image_add_webp                        = False,
		export_image_format                          = 'AUTO',
		export_image_quality                         = 75,
		export_image_webp_fallback                   = False,
		export_import_convert_lighting_mode          = 'SPEC',
		export_influence_nb                          = 4,
		export_jpeg_quality                          = 75,
		export_keep_originals                        = False,
		export_lights                                = False,
		export_materials                             = 'EXPORT',
		export_morph                                 = False,
		export_morph_animation                       = True,
		export_morph_normal                          = True,
		export_morph_reset_sk_data                   = True,
		export_morph_tangent                         = False,
		export_negative_frame                        = 'SLIDE',
		export_nla_strips                            = True,
		#export_nla_strips_merged_animation_name      = 'Animation',
		export_normals                               = True,
		export_optimize_animation_keep_anim_armature = True,
		export_optimize_animation_keep_anim_object   = False,
		export_optimize_animation_size               = True,
		export_original_specular                     = False,
		export_reset_pose_bones                      = False,
		export_rest_position_armature                = True,
		export_shared_accessors                      = False,
		export_skins                                 = True,
		export_tangents                              = True,
		export_texcoords                             = True,
		export_texture_dir                           = 'tex',
		export_try_omit_sparse_sk                    = False,
		export_try_sparse_sk                         = True,
		export_unused_images                         = False,
		export_unused_textures                       = False,
		export_use_gltfpack                          = False,
		export_yup                                   = True,
		gltf_export_id                               = '',
		#ui_tab                                       = 'GENERAL',
		#will_save_settings                           = True,
 
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
