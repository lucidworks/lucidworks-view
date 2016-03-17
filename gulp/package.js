/*eslint-env node*/
/*global global*/
/*eslint no-console:0*/

var $               = require('gulp-load-plugins')();
var gulp            = require('gulp');
var argv            = require('yargs').argv;
var sequence        = require('run-sequence');

var nodeversion     = 'v5.2.0';

var buildTargets  = {
  mac: {
    nodeVersion: nodeversion,
    target: 'darwin',
    bits: 64,
    extension: 'tar.gz'
  },
  linux: {
    nodeVersion: nodeversion,
    target: 'linux',
    bits: 64,
    extension: 'tar.gz'
  },
  linux32: {
    nodeVersion: nodeversion,
    target: 'linux',
    bits: 32,
    extension: 'tar.gz'
  },
  sunos: {
    nodeVersion: nodeversion,
    target: 'sunos',
    bits: 32,
    extension: 'tar.gz'
  }
};

// Builds the entire app for deployment
gulp.task('package', function(cb) {
  sequence('clean', 'copy:configSample', 'writeDevConfig', 'copy:config', 'template:routes', ['copy', 'copy:components', 'copy:foundation', 'sass', 'uglify'], 'concat:components', cb);
});

var buildUrl = function (nodeVersion, targetPlatform, bits, extension){
  if(typeof bits !== 'number'){
    bits = 64;
  }
  //https://nodejs.org/dist/v5.8.0/node-v5.8.0-darwin-x64.tar.gz
  return 'http://nodejs.org/dist/'+nodeVersion+'/node-'+nodeVersion+'-'+targetPlatform+'-x'+bits+'.'+extension;
};

gulp.task('download_node', function(cb){
  var target = {
    nodeVersion: argv.nodeVersion,
    target: argv.target,
    bits: argv.bits,
    extension: argv.extension
  };
  gulpDownloadTarget(target, cb);
});
gulp.task('download_node_mac', function(cb){
  var target = buildTargets.mac;
  gulpDownloadTarget(target, cb);
});
gulp.task('download_node_linux', function(cb){
  var target = buildTargets.linux;
  gulpDownloadTarget(target, cb);
});
gulp.task('download_node_linux32', function(cb){
  var target = buildTargets.linux32;
  gulpDownloadTarget(target, cb);
});
gulp.task('download_node_sunos', function(cb){
  var target = buildTargets.sunos;
  gulpDownloadTarget(target, cb);
});

////////
function gulpDownloadTarget(target, cb){
  var untar = $.if((target.extension === 'tar.gz'), $.untar()
    .on('error', function (e) {
      console.log(e);
    }));

  $.download(buildUrl(target.nodeVersion, target.target, target.bits, target.extension))
    .pipe(untar)
    .pipe(gulp.dest('./dist/'));
}
