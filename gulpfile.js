// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $               = require('gulp-load-plugins')();
var log             = require('connect-logger');
var argv            = require('yargs').argv;
var gulp            = require('gulp');
var rimraf          = require('rimraf');
var router          = require('front-router');
var sequence        = require('run-sequence');
var browserSync     = require('browser-sync').create();
var historyFallback = require('connect-history-api-fallback');
var proxyMiddleware = require('http-proxy-middleware');
var fs              = require('fs');

// Check for --production flag
var isProduction = !!(argv.production);

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
  assets: [
    './client/**/*.*',
    '!./client/templates/**/*.*',
    '!./client/assets/{scss,js,components}/**/*.*'
  ],
  // Sass will check these folders for files when you use @import.
  sass: [
    'client/assets/scss',
    'bower_components/foundation-apps/scss',
    'client/assets/components/**/*.scss'
  ],
  // These files include Foundation for Apps and its dependencies
  foundationJS: [
    'bower_components/lodash/lodash.js',
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/tether/tether.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/foundation-apps/js/vendor/**/*.js',
    'bower_components/foundation-apps/js/angular/**/*.js',
    '!bower_components/foundation-apps/js/angular/app.js',
    'bower_components/ng-orwell/Orwell.js',
  ],
  // These files are for your app's JavaScript
  appJS: [
    'client/assets/js/app.js',
    'client/assets/js/services/*.js',
    'client/assets/js/controllers/*.js',
    'client/assets/js/utils/*.js',
    'client/assets/components/**/*.js',
  ],
  configJS: [
    './FUSION_CONFIG.js'
  ],
  configJSSample: [
    './FUSION_CONFIG.sample.js'
  ]
};

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(paths.assets, {
    base: './client/'
  })
    .pipe(gulp.dest('./build'));
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:templates', function() {
  return gulp.src('./client/templates/**/*.html')
    .pipe(router({
      path: 'build/assets/js/routes.js',
      root: 'client'
    }))
    .pipe(gulp.dest('./build/templates'));
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:config', function() {
  if(fs.existsSync(paths.configJS[0])){ //If the file exists use that, or copy from the sample
    return gulp.src(paths.configJS).pipe(gulp.dest('./build/assets/js/'));
  }
  else {
    return gulp.src(paths.configJSSample).pipe($.rename('FUSION_CONFIG.js')).pipe(gulp.dest('./')).pipe(gulp.dest('./build/assets/js/'));
  }
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:configSample', function() {
  if(fs.existsSync(paths.configJS[0])){ 
    return gulp.src(paths.configJSSample).pipe($.rename('FUSION_CONFIG.js')).pipe(gulp.dest('./'));
  }
});

// Compiles the Foundation for Apps directive partials into a single JavaScript file
gulp.task('copy:foundation', function(cb) {
  gulp.src('bower_components/foundation-apps/js/angular/components/**/*.html')
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./build/assets/js'));

  // Iconic SVG icons
  gulp.src('./bower_components/foundation-apps/iconic/**/*')
    .pipe(gulp.dest('./build/assets/img/iconic/'));

  cb();
});

// Compiles Sass
gulp.task('sass', function () {
  var cssnano = $.if(isProduction, $.cssnano());

  return gulp.src('client/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(cssnano)
    .pipe(browserSync.stream())
    .pipe(gulp.dest('./build/assets/css/'));
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:app']);

gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('uglify:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.appJS)
    .pipe(uglify)
    .pipe($.plumber())
    .pipe($.ngAnnotate())
    .pipe($.directiveReplace({root: 'client'}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});

// Starts a test server, which you can view at http://localhost:8079
gulp.task('server', ['build'], function() {
  gulp.src('./build')
    .pipe($.webserver({
      port: 3000,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }));
});

// Static Server + watching build and live reload accross all the browsers
gulp.task('browsersync', ['build'], function() {
  var fusionConfig    = require('./tmp/fusion_config');
  var openPath = getOpenPath();
  // build middleware.
  var middleware = [
    log(),
    proxyMiddleware('/api', {
        target: fusionConfig.host+':'+fusionConfig.port
    }),
    historyFallback({ index: '/'+openPath+'/index.html' })
  ];

    browserSync.init({
        server: {
          baseDir: "./build/",
          middleware: middleware
        },
        files: [
          openPath + '/**/*.html',
          openPath + '/**/*.css',
          openPath + '/**/*.js'
        ]
    });

    // gulp.watch("app/scss/*.scss", ['sass']);
    // gulp.watch("app/*.html").on('change', browserSync.reload);
});

// gulp.task('writeBuildConfig', function(){
//   var fs = require('fs');
//   fs.readFile('./FUSION_CONFIG.js', 'utf8', function(err, data){
//     if (err) {
//       return console.log(err);
//     }
//     var file = 'var appConfig = (function(){\n var ' + data + 'return appConfig;})();';
//     fs.writeFile('./build/assets/js/fusion_config.js',file);
//   });
// });

gulp.task('writeDevConfig', function(){
  var fs = require('fs');
  fs.readFile('./FUSION_CONFIG.js', 'utf8', function(err, data){
    if (err) {
      return console.log(err);
    }
    var file = 'var ' + data + 'module.exports = appConfig;';
    var dir = './tmp';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFile('./tmp/fusion_config.js',file);
  });
});

//Reloads all the browsers
gulp.task('reloadBrowsers', browserSync.reload);

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', 'writeDevConfig', ['copy', 'copy:foundation', 'sass', 'uglify'], 'copy:templates', 'copy:config', cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('serve', ['browsersync'], function () {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass', 'reloadBrowsers']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify:app', 'reloadBrowsers']);

  // Watch Directives
  gulp.watch(['./client/assets/components/**/*'], ['uglify:app', 'copy', 'reloadBrowsers']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy', 'reloadBrowsers']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html'], ['copy:templates', 'reloadBrowsers']);

  // Watch config
  gulp.watch(paths.configJS, ['copy:config', 'reloadBrowsers']);

  // Watch config sample
  gulp.watch(paths.configJSSample, ['copy:configSample', 'reloadBrowsers']);
});

gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify:app']);

  // Watch Directives
  gulp.watch(['./client/assets/components/**/*'], ['uglify:app', 'copy']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html'], ['copy:templates']);

  // Watch config
  gulp.watch(paths.configJS, ['copy:config']);

  // Watch config sample
  gulp.watch(paths.configJSSample, ['copy:configSample']);
});

function getOpenPath() {
  var src = argv.open || '';
  if (!src) {
    return '.';
  }
  return src;
}
