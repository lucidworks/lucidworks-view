#! /bin/bash

echo -e "        o O o\n" "      o \|/ o\n" "   o o \ | / o o\n" "    \ \ \|/ / /\n" "    (+++\@/+++)\n" "    '---------'\n" "  Lucidworks View"

FILE="$(pwd)/lib/nodejs/bin/npm"
if ! [ -f "$FILE" ];
then
  echo "Use npm instead of view.sh when not using packaged version of Lucidworks View." >&2
  exit
fi

if [ -z "$1" ];
then
  echo "" >&2
  echo "Usage: view.sh <command>" >&2
  echo "" >&2
  echo "where <command> is one of:" >&2
  echo "    start, build" >&2
  exit
fi


# Put nodejs in the path for the duration of the script execution.
export PATH=$(pwd)/lib/nodejs/bin:$PATH

./lib/nodejs/bin/npm $1 $2 $3
