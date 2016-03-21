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

var fileLocations = {
  bower: ['bower_components/*/**'],
  node_modules: ['node_modules/*/**'],
  client: [
    'client/**/**',
    '!**/.DS_Store',
    '!.DS_Store'
  ],
  docs: ['docs/**/*'],
  gulp: ['gulp/**/*', '!gulp/package.js'],
  tests: ['tests/**/*'],
  main_components: [
    '.bowerrc',
    '.eslintrc',
    '.gitignore',
    '.sass-lint.yml',
    'bower.json',
    'FUSION_CONFIG.sample.js',
    'gulpfile.js',
    'karma.conf.js',
    'package.json',
    '*.sh',
    '*.md'
  ]
};

// default target
var os_target = buildTargets.mac;

// Builds the entire app for deployment
gulp.task('package', function(cb) {
  // sequence('clean:package', 'download:node', 'move:node', 'move:app', cb);
  sequence('clean:package', ['package:setupTarget','move:app'], 'package:bashCommands', cb);
});

gulp.task('package:setupTarget', function(cb){
  os_target.name = argv.buildname ? argv.buildname: 'default';
  os_target.nodeVersion = argv.nodeVersion ? argv.nodeVersion: os_target.nodeVersion;
  os_target.os = argv.os ? argv.os: os_target.os;
  os_target.platform = argv.platform ? argv.platform: os_target.platform;
  os_target.extension = argv.extension ? argv.extension: os_target.extension;
  console.log(os_target);
  cb();
});

gulp.task('package:setupTarget:mac', function(cb){
  os_target = buildTargets.mac;
  cb();
});
gulp.task('package:setupTarget:linux', function(cb){
  os_target = buildTargets.linux;
  cb();
});
gulp.task('package:setupTarget:linux32', function(cb){
  os_target = buildTargets.linux32;
  cb();
});
gulp.task('package:setupTarget:sunos', function(cb){
  os_target = buildTargets.sunos;
  cb();
});

gulp.task('move:app', ['move:bower', /*'move:node_modules',*/ 'move:client', 'move:docs', 'move:gulp', 'move:tests'], function(cb){
  gulp.src(fileLocations.main_components)
  .pipe(gulp.dest('tmp/tiara'));
  cb();
});
gulp.task('move:bower', function(cb){
  gulp.src(fileLocations.bower, {dot: true})
  .pipe(gulp.dest('tmp/tiara/bower_components'));
  cb();
});
gulp.task('move:node_modules', function(cb){
  gulp.src(fileLocations.node_modules)
  .pipe(gulp.dest('tmp/tiara/node_modules'));
  cb();
});
gulp.task('move:client', function(cb){
  gulp.src(fileLocations.client, {dot: true})
  .pipe(gulp.dest('tmp/tiara/client'));
  cb();
});
gulp.task('move:docs', function(cb){
  gulp.src(fileLocations.docs)
  .pipe(gulp.dest('tmp/tiara/docs'));
  cb();
});
gulp.task('move:gulp', function(cb){
  gulp.src(fileLocations.gulp)
  .pipe(gulp.dest('tmp/tiara/gulp'));
  cb();
});
gulp.task('move:tests', function(cb){
  gulp.src(fileLocations.tests, {dot: true})
  .pipe(gulp.dest('tmp/tiara/tests'));
  cb();
});

gulp.task('package:bashCommands', $.shell.task([
  'mkdir -p tmp/node',
  'mkdir -p tmp/node/'+packageName(os_target),
  'mkdir -p tmp/tiara/lib/nodejs',
  'curl -o tmp/node/'+packageName(os_target)+'.'+os_target.extension+' '+buildUrl(os_target),
  'tar -xzf tmp/node/'+packageName(os_target)+'.'+os_target.extension+' -C tmp/tiara/lib/nodejs --strip-components=1',
  'mkdir -p packages',
  'chmod +x tmp/tiara/lib/nodejs/bin/npm',
  'chmod +x tmp/tiara/lib/nodejs/bin/node',
  'chmod +x tmp/tiara/lib/nodejs/lib/node_modules/npm/bin/npm',
  'cd tmp/tiara && ./tiara.sh install',
  'cd tmp && tar -zcf ../packages/tiara-'+os_target.os+'-'+os_target.platform+'-'+getVersion()+'.tar.gz tiara'
], {verbose: true})
);

// gulp.task('write:sh', function(cb){
//   var shFile = ''
//   string_src('tiara.sh', shFile)
//    .pipe(gulp.dest('tmp/tiara'));
//   cb();
// });

////////

function getVersion(){
  var packageJson = require('./package.json');
  return packageJson.version;
}


function buildUrl(target){
  //Format https://nodejs.org/dist/v5.8.0/node-v5.8.0-darwin-x64.tar.gz
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
