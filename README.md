# Fusion Seed App
  This is the Fusion Seed App project perfect for getting started with Fusion, powered by Lucidworks Fusion, Gulp, Angular, and libsass. It provides you with a basic search template, and some easy config to get you started.

  This application will help you get up and running with Fusion.

  This app uses Foundation for Apps. Learn more about foundation for apps.

    http://foundation.zurb.com/apps/docs/

## Requirements

  You'll need the following software installed to get started.

- [Node.js](http://nodejs.org): Use the installer for your OS.
- [Git](http://git-scm.com/downloads): Use the installer for your OS.
- Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
- [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `npm install -g gulp bower`
- Depending on how Node is configured on your machine, you may need to run `sudo npm install -g gulp bower` instead, if you get an error with the first command.

## Get Started

  Clone this repository, where `app` is the name of your app.

  ```bash
  git clone https://github.com/LucidWorks/lucidworks-seed-app app
  ```

Change into the directory.

```bash
cd app
```

Install the dependencies. If you're running Mac OS or Linux, you may need to run `sudo npm install` instead, depending on how your machine is configured.

```bash
npm install
bower install
```

While you're working on your project, run:

```bash
npm start
```

This will compile the Sass and assemble your Angular app. **Now go to `localhost:3000` in your browser to see it in action.** When you change any file in the `client` folder, the appropriate Gulp task will run to build new files.

To run the compiling process once, without watching any files, use the `build` command.

```bash
npm build
```

This uses [`browser-sync`](https://www.browsersync.io/) for instant reload upon change of source files. Visit `http://localhost:3001` (or whatever your terminal shows as the browser-sync UI) for `browser-sync` dashboard.

## Unit testing
```
npm build
npm test
```

## Configuration
In order to configure the application you can use the settings in the FUSION_CONFIG.js in this file.
