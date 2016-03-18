#! /bin/bash

# Dirty ugly hack to make gulp work
export PATH=$(pwd)/node_modules/.bin:$PATH
echo -e "        o O o\n" "      o \|/ o\n" "   o o \ | / o o\n" "    \ \ \|/ / /\n" "    (+++\@/+++)\n" "    '---------'\n" "Tiara"
./lib/nodejs/bin/npm $1 $2 $3
