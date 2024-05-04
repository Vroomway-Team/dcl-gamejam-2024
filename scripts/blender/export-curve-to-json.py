# WhatDo:
#
# Looks for an active curve
# 	Loops through the points on the curve
# 		Prints out interpolated points to a text file
#
# HowToUse:
#   Select your curve and run
#   View results in the log file
import bpy
import json
from mathutils import geometry

# Specify the number of interpolated points to be used
INT_COUNT = 2

# Specify the accuracy of coordinates
DEC_PLACES = 3

# Specify a log file to use for the output - this will appear in Blender's internal memory
LOG_PATH = "result"

###

# Check for the Log file
if LOG_PATH not in bpy.data.texts:
    LOG_TXT = bpy.data.texts.new(LOG_PATH)
else:
    LOG_TXT = bpy.data.texts[LOG_PATH]
    LOG_TXT.clear()

# Define a simple log function to print to both the Blender console and the log file specified above
def log(message):
    print(message)
    LOG_TXT.write(message + '\n')

# Acquire a reference to the bezier points.
bez_curve = bpy.context.active_object
bez_points = bez_curve.data.splines[0].bezier_points

bez_len = len(bez_points)
i_range = range(1, bez_len-1, 1)

points_data = []

for i in i_range:
    # Get a list of points distributed along the curve.
    points_on_curve = geometry.interpolate_bezier(
        bez_points[i].co,
        bez_points[i].handle_right,
        bez_points[i+1].handle_left,
        bez_points[i+1].co,
        INT_COUNT)

    # Interpolate weight, radius, and tilt values between control points
    weight_start = bez_points[i].weight_softbody
    weight_end = bez_points[i+1].weight_softbody
    radius_start = bez_points[i].radius
    radius_end = bez_points[i+1].radius
    tilt_start = bez_points[i].tilt
    tilt_end = bez_points[i+1].tilt

    for j, point in enumerate(points_on_curve):
        x = round(point.x, DEC_PLACES)
        y = round(point.y, DEC_PLACES)
        z = round(point.z, DEC_PLACES)
        if abs(x) < 0.01:
            x = 0
        if abs(y) < 0.01:
            y = 0
        
        # Linear interpolation of weight, radius, and tilt
        weight = weight_start + (weight_end - weight_start) * j / INT_COUNT
        radius = radius_start + (radius_end - radius_start) * j / INT_COUNT
        tilt = tilt_start + (tilt_end - tilt_start) * j / INT_COUNT
        
        points_data.append({'x': x, 'y': y, 'z': z, 'weight': weight, 'radius': radius, 'tilt': tilt})

# Export points data to JSON
json_data = json.dumps(points_data, indent=4)

# Write JSON data to the log file
LOG_TXT.write(json_data)
