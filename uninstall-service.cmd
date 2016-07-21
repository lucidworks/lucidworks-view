@echo off

set NEXT_APP=lwview
nssm stop %NEXT_APP%
nssm remove %NEXT_APP% confirm

