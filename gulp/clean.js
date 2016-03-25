/*eslint-env node*/
var gulp    = require('gulp');
var rimraf  = require('rimraf');

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

gulp.task('clean:templates', function(cb){
  rimraf('./build/assets/js/templates.js', cb);
});

gulp.task('clean:package', function(cb){
  rimraf('./tmp/lucidworks-view', cb);
});
