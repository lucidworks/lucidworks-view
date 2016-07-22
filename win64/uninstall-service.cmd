@echo off

set NEXT_APP=lucidworks-view
nssm stop %NEXT_APP%
sc.exe delete lucidworks-view
