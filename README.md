# Lucidworks View
  [Lucidworks View](https://lucidworks.com/products/view/) is a consumer-facing front end for Lucidworks Fusion.  It provides a basic search interface with simple configuration, so you can quickly deliver a Fusion-based search solution with minimal development.  View is powered by Fusion, Gulp, Angular, and libSaSS.

  You can also use View as the basis for developing a more sophisticated Web interface, using Foundation for Apps: http://foundation.zurb.com/apps/docs/

  If you need help setting up Fusion, see https://doc.lucidworks.com/.  To ask questions about View, see the [Lucidworks View Q&A](https://support.lucidworks.com/hc/en-us/community/topics/200922728-Lucidworks-View-Q-A) site.

## Requirements

If you downloaded a [platform-specific package](https://github.com/lucidworks/lucidworks-view/releases), all dependencies are included. Skip to Get Started step 4.

If you start by cloning the repository, you'll need the following software:

- [Node.js](http://nodejs.org): Use the installer for your OS. Use version 5.xxx.
- [Git](http://git-scm.com/downloads) (if you're cloning the repo): Use the installer for your OS.
- Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
- [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `npm install -g gulp bower`
- Depending on how Node is configured on your machine, you may need to run `sudo npm install -g gulp bower` instead, if you get an error with the first command.

## Get Started

1. Clone the repository, where `app` is the name of your app:

  ```bash
  git clone https://github.com/lucidworks/lucidworks-view app
  ```

1. Change into the directory:

  ```bash
  cd app
  ```

1. Install the dependencies:

  ```bash
  npm install
  bower install
  ```

1. While you're working on your project, run:

  * If you downloaded a tar package:

    ```bash
    ./view.sh start
    ```

  * If you cloned the repository:

    ```bash
    npm start
    ```

  This will compile the SaSS, assemble your Angular app, and create `FUSION_CONFIG.js` (if you haven't created it already).  You'll see output that tells you which port was selected:

  ```
  [BS] Access URLs:
   ------------------------------------
         Local: http://localhost:3000
      External: http://<external IP>:3000
   ------------------------------------
   ```

   The default is port 3000, but if that port is already in use then the app selects the next highest available port.

1. **Now go to `http://localhost:<port>` in your browser to see it in action.**

  The first time you browse to the app, you'll see a login page.  Use your Fusion username and password.  To enable anonymous access, edit the `anonymous_access` keys in FUSION_CONFIG.js.

  When you change FUSION_CONFIG.js or any file in the `client` folder, the appropriate Gulp task will run to build new files. This uses [`browser-sync`](https://www.browsersync.io/) for instant reload upon change of source files. Visit `http://localhost:3001` (or whatever your terminal shows as the browser-sync UI) for the `browser-sync` dashboard.

To run the compiling process once, without watching any files, use the `build` command:
```bash
npm run build
```
this command creates a built version of View which can be copied from the build folder to another folder/machine and served on your own webserver.

For development purposes, you can develop without a minified build by using the command
```bash
npm run start-dev
```

this command runs a node server, with minimized packages, and works similarly to  the `npm start` command.

## Unit testing

```
npm run build
npm test
```

## Basic Configuration

The first time you run `npm start`, FUSION_CONFIG.sample.js is copied to FUSION_CONFIG.js.  Modify this file to configure View's basic options.  Documentation about the configuration keys is included in the file.

At a minimum, you _must_ configure the `collection` key to match the name of your Fusion collection.

In a production environment, you must also configure `host` and `port` to point to the UI service of your Fusion deployment.  The default is `localhost:8764` for development purposes.

When the app is running with BrowserSync, it reloads the configuration every time you save FUSION_CONFIG.js.  You can modify the configuration and watch the app change in real time in your browser.

## Basic Customization

The title and logo for your interface are configured in FUSION_CONFIG.js as `search_app_title` and `logo_location`.

CSS options are configured in the files in client/assets/scss.

Templates for various UI components are located in client/assets/components.

Search results from different document types can use different templates.  The `client/assets/components/document` directory contains templates for some common document types, plus default templates for all others.  Data types correspond to Connectors in Fusion.  See [Customizing Documents](docs/Customizing_Documents.md) for details about working with these.

## View on Windows

  Download the latest view installer from <https://lucidworks.com/products/view> and run it **as an administrator**.

## What's Next

For more details about configuring and customizing View, see the [docs](docs/) directory.

## Contributions

View is open source! Pull requests welcome. This is a great way to give back to the community and help others build a better search app.
