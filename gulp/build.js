/* globals require, global, console */

var $               = require('gulp-load-plugins')();
var log             = require('connect-logger');
var argv            = require('yargs').argv;
var gulp            = require('gulp');
var router          = require('front-router');
var sequence        = require('run-sequence');
var browserSync     = require('browser-sync').create();
var historyFallback = require('connect-history-api-fallback');
var proxyMiddleware = require('http-proxy-middleware');
var fs              = require('fs');

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', 'writeDevConfig', ['copy', 'copy:foundation', 'sass', 'uglify'], 'copy:templates', 'copy:config', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(global.paths.assets, {
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

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:app']);

gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(global.isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(global.paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});

gulp.task('uglify:app', function() {
  var uglify = $.if(global.isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(global.paths.appJS)
    .pipe(uglify)
    .pipe($.plumber())
    .pipe($.ngAnnotate())
    .pipe($.directiveReplace({root: 'client'}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'));
});
