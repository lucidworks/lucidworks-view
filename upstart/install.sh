#!/bin/bash

if [[ $EUID -ne 0 ]]; then
  echo "FATAL You must be a root user" 2>&1
  exit 1
fi

[ -z "$VIEW_HOME" ] && VIEW_HOME=/opt/lucidworks/view

if [ ! -d "$VIEW_HOME" ]; then
  echo "FATAL missing fusion home directory $VIEW_HOME"
  exit 1
fi

# determine the owner of the VIEW_HOME directory
VIEW_USER=$(ls -ld /opt/lucidworks/view/ | awk '{print $3}')
if [ "$VIEW_USER" = "root" ]; then
  echo "FATAL directory $VIEW_HOME is owned by root; it should be owned by a non-root user"
  exit 1
fi

# Check if this system is suitable for these Upstart scripts
if pidof systemd > /dev/null; then
  echo "systemd is running; use the ../systemd scripts instead of these upstart scripts"
  exit 1
fi
if ! initctl --version >/dev/null 2>&1; then
  echo Upstart is not installed on this system
  exit 1
fi


# copy the default config
cp $VIEW_HOME/upstart/default/lucidworks-view /etc/default/
sed -i"" -e "s/VIEW_USER=lucidworks/VIEW_USER=${VIEW_USER}/" /etc/default/lucidworks-view
echo installed /etc/default/lucidworks-view


cp $VIEW_HOME/upstart/lucidworks-view.conf /etc/init/
sed -i"" -e "s/setuid lucidworks/setuid ${VIEW_USER}/" /etc/init/lucidworks-view.conf
echo installed /etc/init/lucidworks-view.conf

service lucidworks-view start