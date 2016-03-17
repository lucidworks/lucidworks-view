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
    name: 'mac',
    nodeVersion: nodeversion,
    os: 'darwin',
    platform: 'x64',
    extension: 'tar.gz'
  },
  linux: {
    name: 'linux',
    nodeVersion: nodeversion,
    os: 'linux',
    platform: 'x64',
    extension: 'tar.gz'
  },
  linux32: {
    name: 'linux32',
    nodeVersion: nodeversion,
    os: 'linux',
    platform: 'x86',
    extension: 'tar.gz'
  },
  sunos: {
    name: 'sunos',
    nodeVersion: nodeversion,
    os: 'sunos',
    platform: 'x86',
    extension: 'tar.gz'
  }
};

// default target
var os_target = buildTargets.mac;

// Builds the entire app for deployment
gulp.task('package', function(cb) {
  sequence('clean:package', 'download_node', 'move:node', cb);
});

gulp.task('download_node', function(cb){
  os_target.name = argv.buildname ? argv.buildname: 'default';
  os_target.nodeVersion = argv.nodeVersion ? argv.nodeVersion: os_target.nodeVersion;
  os_target.os = argv.os ? argv.os: os_target.os;
  os_target.platform = argv.platform ? argv.platform: os_target.platform;
  os_target.extension = argv.extension ? argv.extension: os_target.extension;
console.log(os_target);
  gulpDownloadTarget(os_target, cb);
});

gulp.task('download_node_mac', function(cb){
  os_target = buildTargets.mac;
  gulpDownloadTarget(os_target, cb);
});
gulp.task('download_node_linux', function(cb){
  os_target = buildTargets.linux;
  gulpDownloadTarget(os_target, cb);
});
gulp.task('download_node_linux32', function(cb){
  os_target = buildTargets.linux32;
  gulpDownloadTarget(os_target, cb);
});
gulp.task('download_node_sunos', function(cb){
  os_target = buildTargets.sunos;
  gulpDownloadTarget(os_target, cb);
});

gulp.task('move:node', function(cb){
  gulp.src('tmp/node/'+packageName(os_target)+'/**/*')
    .pipe(gulp.dest('dist/lib/nodejs'));
  cb();
});

////////

function gulpDownloadTarget(target, cb){
  $.download(buildUrl(target))
    .pipe($.gunzip())
    .pipe($.untar())
    .pipe(gulp.dest('tmp/node'));
  cb();
}

function buildUrl(target){
  //https://nodejs.org/dist/v5.8.0/node-v5.8.0-darwin-x64.tar.gz
  return 'http://nodejs.org/dist/'+target.nodeVersion+'/'+packageName(target)+'.'+target.extension;
}

function packageName(target){
  return 'node-'+target.nodeVersion+'-'+target.os+'-'+target.platform;
}

/**
 * If an expresion is true run a callback and log errors to console.
 * @param  {boolean}     expression  Result of an expression
 * @param  {Function}    cb          Callback to fire
 * @param  {array|false} parameters  An array of parameters to pass through to the callback
 * @return {Function}                Function to fire
 */
function ifExpression(expression, cb, parameters){
  if(Array.isArray(parameters)){
    return $.if(expression, cb.apply(null, parameters).on('error', function (e) {
      console.log(e);
    }));
  }
  return $.if(expression, cb().on('error', function (e) {
    console.log(e);
  }));
}
