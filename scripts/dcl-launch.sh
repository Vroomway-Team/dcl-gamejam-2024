#!/bin/bash
#
# A simple script to launch the DCL preview scene on stom's CentOS test env
# - Runs on port 8008 (instead of default 8000)
# - Doesn't include debugger
# - Doesn't open browser automatically
# - Doesn't watch for changes

(cd ../dcl-scene && tmux new-session -d -s dcl "dcl start --port 8008 --no-debug --no-browser --no-watch")

