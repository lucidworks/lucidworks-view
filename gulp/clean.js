
var gulp    = require('gulp');
var rimraf  = require('rimraf');

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});
