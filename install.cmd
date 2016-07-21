echo You can safely ignore any warnings on the console and close the console when this process completes.

set NEXT_APP=lwview
echo Installing service using View installed at %~dp0
nssm stop %NEXT_APP%
nssm remove %NEXT_APP% confirm
nssm install %NEXT_APP% %~dp0view.cmd start
nssm set %NEXT_APP% AppDirectory %~dp0
nssm set %NEXT_APP% DisplayName Lucidworks View
nssm set %NEXT_APP% Description Lucidworks View Windows Service
nssm set %NEXT_APP% AppStdout %~dp0service.log
nssm set %NEXT_APP% AppStderr %~dp0service.log
nssm set %NEXT_APP% AppStdoutCreationDisposition 4
nssm set %NEXT_APP% AppStderrCreationDisposition 4
nssm set %NEXT_APP% AppRotateFiles 1
nssm set %NEXT_APP% AppRotateOnline 0
nssm set %NEXT_APP% AppRotateSeconds 86400
nssm set %NEXT_APP% AppRotateBytes 1048576

npm install
npm install -g gulp bower
start bower install

