var $               = require('gulp-load-plugins')();
var log             = require('connect-logger');
var argv            = require('yargs').argv;
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var historyFallback = require('connect-history-api-fallback');
var proxyMiddleware = require('http-proxy-middleware');

// Static Server + watching build and live reload accross all the browsers
gulp.task('browsersync', ['build'], function() {
  var fusionConfig    = require('../tmp/fusion_config');
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

//Reloads all the browsers
gulp.task('reloadBrowsers', browserSync.reload);

gulp.task('watch', function(){
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

gulp.task('serve', ['browsersync', 'watch']);

function getOpenPath() {
  var src = argv.open || '';
  if (!src) {
    return '.';
  }
  return src;
}
