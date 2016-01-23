var gulp = require('gulp');

gulp.task('watch', function(){
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass', 'reloadBrowsers']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['jslint:app','uglify:app', 'reloadBrowsers']);

  // Watch Directives
  gulp.watch(['./client/assets/components/**/*'], ['uglify:app', 'copy', 'reloadBrowsers']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy', 'reloadBrowsers']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html'], ['copy:templates', 'reloadBrowsers']);

  // Watch config
  gulp.watch(global.paths.configJS, ['jslint:config','copy:config', 'reloadBrowsers']);

  // Watch config sample
  gulp.watch(global.paths.configJSSample, ['copy:configSample', 'reloadBrowsers']);
});
