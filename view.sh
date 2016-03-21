#! /bin/bash

echo -e "        o O o\n" "      o \|/ o\n" "   o o \ | / o o\n" "    \ \ \|/ / /\n" "    (+++\@/+++)\n" "    '---------'\n" "  Lucidworks View"

FILE="$(pwd)/lib/nodejs/bin/npm"
if ! [ -f "$FILE" ];
then
  echo "Use npm instead of view.sh when not using packaged version of Lucidworks View." >&2
  exit
fi


# Dirty ugly hack to make gulp work
export PATH=$(pwd)/lib/nodejs/bin:$PATH

./lib/nodejs/bin/npm $1 $2 $3
