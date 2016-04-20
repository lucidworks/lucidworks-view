/*eslint-env node*/
var gulp     = require('gulp');
var sequence = require('run-sequence');

gulp.task('watch', function(){
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass-watch']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['javascript']);

  // Watch Components
  gulp.watch(['./client/assets/components/**/*'], ['components']);

  // Watch static files
  gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js,components}/**/*.*'], ['staticfiles']);

  // Watch app templates
  gulp.watch(['./client/templates/**/*.html'], ['template:sequence']);

  // Watch config
  gulp.watch(global.paths.configJS, ['jslint:config','copy:config', 'reloadBrowsers']);

  // Watch config sample
  gulp.watch(global.paths.configJSSample, ['copy:configSample', 'reloadBrowsers']);
});

gulp.task('components', function(cb){
  sequence('uglify:app', ['copy', 'sass'], 'reloadBrowsers', cb);
});

gulp.task('staticfiles', function(cb){
  sequence('copy', 'reloadBrowsers', cb);
});

gulp.task('template:sequence', function(cb){
  sequence('clean:templates', ['copy:foundation', 'copy:templates' /*, 'template:routes'*/], /*'concat:components',*/ 'reloadBrowsers', cb);
});

gulp.task('javascript', function(cb){
  sequence('jslint:app','uglify:app', 'reloadBrowsers', cb);
});

gulp.task('sass-watch', function(cb){
  sequence('sass', 'reloadBrowsers', cb);
});
