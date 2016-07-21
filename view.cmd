@echo off

set NODEJS_EXE=node.exe
echo Checking node js version:
%NODEJS_EXE% -v

set thecmd=%1
if [%1]==[] set thecmd=start

npm %thecmd%
