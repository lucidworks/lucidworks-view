# Lucidworks View Windows Installer Creation Guide

## How to build the lucidworks view windows installer:

Do the following steps from a windows box

1. Pull the latest changes from lucidworks-view repository and build the tar.gz file from Linux. (See the README.md for build instructions on how to build lucidworks-view tar ball)

2. Download nodejs x64 MSI installer version <https://nodejs.org/en/download/> for windows same version you are using and install to some directory. We will call this **WINDOW_NODEJS_INSTALL_HOME**.

3. Move the tar build on Linux and Untar on Windows to a directory we will refer to as **VIEW_HOME** and from the untar'd result,

	- Delete everything in **VIEW_HOME**\lib\nodejs\\*
	- Copy all the files from **WINDOW_NODEJS_INSTALL_HOME** into **VIEW_HOME**\lib\nodejs
	- From the lucidworks-view git directory, copy the **installer** directory to **VIEW_HOME**
	- From the lucidworks-view git directory, copy `*.exe`, `*.cmd` and `*.md `to **VIEW_HOME**
	

4. Get latest version of **inno setup** installed <http://www.jrsoftware.org/isdl.php#stable>

5. Delete **VIEW_HOME**\installer\Output\\*

6. Launch **VIEW_HOME**\installer\create-installer.cmd
	- This will create the Installer in **VIEW_HOME**\installer\Output directory.

## How to use the Windows Installer:

 * Launch the Lucidworks-view.exe **as an administrator**.

**Note:** At the end of the installer, it attempts to run npm installs. If the install cmd script closes too fast, you probably didn't have admin permissions and it abruptly failed. Right click on the install.cmd and run as administrator if that happens.

## How to Uninstall the Lucidworks-view service

 * To uninstall the service simply run the **VIEW_HOME**\uninstall-service.cmd as administrator

## Common issues:

- When i run installer, get "cannot find bower"

  - You forgot step 2.

- File could not be access, file in use

  - You forgot to delete the existing installer file, step 5.

  - Or you have one of the installer files open with a CMD or locked somewhere. Close it and try again.

- Services didn't install.

  - You probably forgot to Run installer "as administrator"

- Services won't start.

  - Did you enter correct password when prompted for the user that is launch the service?

    - Don't forget windows domain if needed. If my domain is **CORPORATE** then **"CORPORATE\nicholas"**
