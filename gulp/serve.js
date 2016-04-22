/*eslint-env node*/
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
    historyFallback({ index: '/' + openPath + '/index.html' })
  ];

  var browserSyncConfig = {
    baseDir: './build/',
    middleware: middleware
  };

  if(fusionConfig.use_https === true){
    browserSyncConfig['https'] = true;
  }

  browserSync.init({
    server: browserSyncConfig
  });

  // gulp.watch("app/scss/*.scss", ['sass']);
  // gulp.watch("app/*.html").on('change', browserSync.reload);
});

//Reloads all the browsers
gulp.task('reloadBrowsers', function(cb){
  browserSync.reload();
  //callback so sequences are aware when this is done
  cb();
});

gulp.task('serve', ['browsersync', 'watch']);

gulp.task('default', ['browsersync', 'watch']);

function getOpenPath() {
  var src = argv.open || '';
  if (!src) {
    return '.';
  }
  return src;
}
