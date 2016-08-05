echo You can safely ignore any warnings on the console and close the console when this process completes.

set NEXT_APP=lucidworks-view
echo Installing service using View installed at %~dp0
%~dp0nssm stop %NEXT_APP%
%~dp0nssm remove %NEXT_APP% confirm
%~dp0nssm install %NEXT_APP% %~dp0view.cmd start
%~dp0nssm set %NEXT_APP% AppDirectory %~dp0
%~dp0nssm set %NEXT_APP% DisplayName Lucidworks View
%~dp0nssm set %NEXT_APP% Description Lucidworks View Windows Service
%~dp0nssm set %NEXT_APP% AppStdout %~dp0service.log
%~dp0nssm set %NEXT_APP% AppStderr %~dp0service.log
%~dp0nssm set %NEXT_APP% AppStdoutCreationDisposition 4
%~dp0nssm set %NEXT_APP% AppStderrCreationDisposition 4
%~dp0nssm set %NEXT_APP% AppRotateFiles 1
%~dp0nssm set %NEXT_APP% AppRotateOnline 0
%~dp0nssm set %NEXT_APP% AppRotateSeconds 86400
%~dp0nssm set %NEXT_APP% AppRotateBytes 1048576

cd %~dp0

%~dp0lib\nodejs\npm install && %~dp0lib\nodejs\npm install -g gulp bower && %~dp0lib\nodejs\node %~dp0node_modules\bower\bin\bower install && %~dp0lib\nodejs\npm rebuild node-sass && %~dp0lib\nodejs\npm install -g gulp bower

echo Reminder: You can safely ignore any warnings on the console and close the console when this process completes.

%~dp0nssm set %NEXT_APP% DisplayName Lucidworks View
