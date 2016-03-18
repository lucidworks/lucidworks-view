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
  client: ['client/*/**'],
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
  sequence('clean:package', ['download:node', 'move:app'], 'move:node', cb);
});

gulp.task('download:node', function(cb){
  os_target.name = argv.buildname ? argv.buildname: 'default';
  os_target.nodeVersion = argv.nodeVersion ? argv.nodeVersion: os_target.nodeVersion;
  os_target.os = argv.os ? argv.os: os_target.os;
  os_target.platform = argv.platform ? argv.platform: os_target.platform;
  os_target.extension = argv.extension ? argv.extension: os_target.extension;
  console.log(os_target);
  gulpDownloadTarget(os_target);
  cb();
});

gulp.task('download:node:mac', function(cb){
  os_target = buildTargets.mac;
  gulpDownloadTarget(os_target);
  cb();
});
gulp.task('download:node:linux', function(cb){
  os_target = buildTargets.linux;
  gulpDownloadTarget(os_target);
  cb();
});
gulp.task('download:node:linux32', function(cb){
  os_target = buildTargets.linux32;
  gulpDownloadTarget(os_target);
  cb();
});
gulp.task('download:node:sunos', function(cb){
  os_target = buildTargets.sunos;
  gulpDownloadTarget(os_target);
  cb();
});

gulp.task('move:app', ['move:bower', 'move:node_modules', 'move:client', 'move:docs', 'move:gulp', 'move:tests'], function(cb){
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

gulp.task('node:cleanup', function(cb){
  sequence('move:node', 'alias:npm');
  cb();
});

gulp.task('move:node', ['alias:npm'], function(cb){
  // gulp.src('tmp/node/'+packageName(os_target)+'/*/**')
  //   .pipe(gulp.dest('tmp/tiara/lib/nodejs'));
  cb();
});

gulp.task('alias:npm', $.shell.task([
    'mkdir -p tmp/node',
    'mkdir -p tmp/node/'+packageName(os_target),
    'mkdir -p tmp/tiara/lib/nodejs',
    'curl -o tmp/node/'+packageName(os_target)+'.'+os_target.extension+' '+buildUrl(os_target),
    'tar -xzf tmp/node/'+packageName(os_target)+'.'+os_target.extension+' -C tmp/tiara/lib/nodejs --strip-components=1',
    // 'mkdir -p tmp/tiara/node_modules',
    'mkdir -p packages',
    // 'cp -aR tmp/node/'+packageName(os_target)+'/. tmp/tiara/lib/nodejs',
    // 'cp -aR node_modules/. tmp/tiara/node_modules',
    'ln -sf ../lib/node_modules/npm/bin/npm-cli.js tmp/tiara/lib/nodejs/bin/npm',
    'chmod +x tmp/tiara/lib/nodejs/bin/npm',
    'chmod +x tmp/tiara/lib/nodejs/bin/node',
    'chmod +x tmp/tiara/lib/nodejs/lib/node_modules/npm/bin/npm',
    'tar -zcf packages/tiara-'+os_target.os+'-'+os_target.platform+'.tar.gz tmp/tiara'
  ], {verbose: true})
);

// gulp.task('write:sh', function(cb){
//   var shFile = ''
//   string_src('tiara.sh', shFile)
//    .pipe(gulp.dest('tmp/tiara'));
//   cb();
// });

////////

function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true });
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
    this.push(null);
  };
  return src;
}

/**
 * Download nodejs based on a target config.
 * @param  {object}   target The target config.
 * @param  {Function} cb     Callback when completed.
 * @return {[type]}          [description]
 */
function gulpDownloadTarget(target){
  // var gunzip = ifExpression((target.extension === 'tar.gz'), $.gunzip, false);
  // var untar = ifExpression((target.extension === 'tar.gz'), $.untar, false);
  // return $.download(buildUrl(target))
  //   .pipe(gunzip)
  //   .pipe(untar)
  //   .pipe(gulp.dest('tmp/node'));
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
