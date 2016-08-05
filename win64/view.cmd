@echo off

set NODEJS_EXE=%~dp0lib\nodejs\node.exe
echo Checking node js version:
%NODEJS_EXE% -v

set thecmd=%1
if [%1]==[] set thecmd=start

%NODEJS_EXE% %~dp0node_modules\gulp\bin\gulp.js --production
