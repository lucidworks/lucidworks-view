/*eslint-env node*/
var gulp     = require('gulp');
var sequence = require('run-sequence');

gulp.task('watch', function(){
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass', 'reloadBrowsers']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['jslint:app','uglify:app', 'reloadBrowsers']);

  // Watch Components
  gulp.watch(['./client/assets/components/**/*.{scss,js}'], ['uglify:app', 'copy', 'sass', 'reloadBrowsers']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy', 'reloadBrowsers']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html', 'client/assets/components/**/*.html'], ['template:sequence']);

  // Watch config
  gulp.watch(global.paths.configJS, ['jslint:config','copy:config', 'reloadBrowsers']);

  // Watch config sample
  gulp.watch(global.paths.configJSSample, ['copy:configSample', 'reloadBrowsers']);
});

gulp.task('template:sequence', function(cb){
  sequence('clean:templates', ['copy:components', 'template:routes'], 'concat:components', 'reloadBrowsers', cb);
});
