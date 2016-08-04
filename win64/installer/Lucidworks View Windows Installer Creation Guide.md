# Lucidworks View Windows Installer Creation Guide

## How to build the lucidworks view windows installer:

Do the following steps from a windows box

1. Pull the latest changes from lucidworks-view repository and build the tar.gz file from Linux with option `--buildTarget=win64`. (See the README.md for build instructions on how to build lucidworks-view tar ball or download the latest tar at <https://lucidworks.com/products/view>)

2. Move the tar build on Linux and Untar on Windows to a directory we will refer to as **VIEW_HOME**.

3. Run the nodejs x64 MSI installer located at **VIEW_HOME**\lib\nodejs. Install (or copy all installed results) at the same localtion.

4. Get latest version of **inno setup** installed <http://www.jrsoftware.org/isdl.php#stable>

5. Launch **VIEW_HOME**\installer\create-installer.cmd
	- This will create the Installer `Lucidworks-View-Installer.exe` in **VIEW_HOME**\installer\Output directory.

## How to use the Windows Installer:

 * Launch the `Lucidworks-View-Installer.exe` **as an administrator**.

**Note:** At the end of the installer, it attempts to run npm installs. If the install cmd script closes too fast, you probably didn't have admin permissions and it abruptly failed. Right click on the install.cmd and run as administrator if that happens.

## How to Uninstall the Lucidworks-view service

 * To uninstall the service simply run the **VIEW_HOME**\uninstall-service.cmd as administrator

## Common issues:

- When I run installer, get "cannot find bower"

  - You forgot step 3.

- File could not be access, file in use

  - Or you have one of the installer files open with a CMD or locked somewhere. Close it and try again.

- Services didn't install.

  - You probably forgot to Run installer "as administrator"

- Services won't start.

  - Did you enter correct password when prompted for the user that is launch the service?

    - Don't forget windows domain if needed. If my domain is **CORPORATE** then **"CORPORATE\nicholas"**
