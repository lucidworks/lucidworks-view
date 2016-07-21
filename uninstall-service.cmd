@echo off

set NEXT_APP=lucidworks-view
nssm stop %NEXT_APP%
nssm remove %NEXT_APP% confirm

