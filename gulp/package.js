/*eslint-env node*/
/*global global*/
/*eslint no-console:0*/

var $               = require('gulp-load-plugins')();
var gulp            = require('gulp');
var argv            = require('yargs').argv;
var sequence        = require('run-sequence');
var child_process   = require('child_process');

var nodeversion     = 'v5.2.0';
var isWin64 = (argv.buildTarget === 'win64');

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
  win64: ['win64/**/*'],
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

// Copies the entire built-app for deployment but doesn't tarball
gulp.task('cook', function(cb) {
  sequence('clean:package', 'move:app', cb);
});

//Tarballs
gulp.task('package', function(cb){
  if(!argv.buildTarget && !(argv.buildname && argv.os && argv.platform && argv.extension)){
    console.log('\nTo use package you need to use a valid buildTarget parameter.\n  Ex: gulp package --buildTarget=mac\n  Possible build targets: {mac, linux, linux32, sunos, sunos32}\n\nOR all of these parameters:\nbuildname, buildTarget, os, platform, extension\n  Ex: gulp build --buildname=mac --os=darwin --platform=x64 --extension=tar.gz\n');
    cb();
  } else {
    sequence('package:bashCommands', cb);
  }
});

gulp.task('move:app', ['move:bower', 'move:node_modules', 'move:client', 'move:docs', 'move:gulp', 'move:tests', 'move:win64'], function(cb){
  gulp.src(fileLocations.main_components)
  .pipe(gulp.dest('tmp/lucidworks-view'));
  cb();
});
gulp.task('move:bower', function(cb){
  child_process.execSync('mkdir -p tmp/lucidworks-view/bower_components; cp -r bower_components tmp/lucidworks-view/');
  cb();
});
gulp.task('move:node_modules', function(cb){
  child_process.execSync('mkdir -p tmp/lucidworks-view/node_modules; cp -r node_modules tmp/lucidworks-view/');
  cb();
});
gulp.task('move:client', function(cb){
  gulp.src(fileLocations.client, {dot: true})
  .pipe(gulp.dest('tmp/lucidworks-view/client'));
  cb();
});
gulp.task('move:docs', function(cb){
  gulp.src(fileLocations.docs)
  .pipe(gulp.dest('tmp/lucidworks-view/docs'));
  cb();
});
gulp.task('move:gulp', function(cb){
  gulp.src(fileLocations.gulp)
  .pipe(gulp.dest('tmp/lucidworks-view/gulp'));
  cb();
});
gulp.task('move:tests', function(cb){
  gulp.src(fileLocations.tests, {dot: true})
  .pipe(gulp.dest('tmp/lucidworks-view/tests'));
  cb();
});

gulp.task('move:win64', function(cb) {
  gulp.src(fileLocations.win64)
  .pipe(gulp.dest('tmp/lucidworks-view/win64'));
  cb();
});

gulp.task('package:bashCommands', function(cb){
  var version = getVersion();
  var osTarget = getOsTarget();

  var shellCommands = [
    'mkdir -p packages/' + version
  ];

  if (osTarget.nodeVersion !== undefined) {
    var nodePackagePath = 'tmp/node/' + packageName(osTarget);
    var nodeFilePath = nodePackagePath + '.' + osTarget.extension;
    var nodeExpandPath = 'tmp/lucidworks-view/lib/nodejs';

    shellCommands.push.apply(shellCommands, [
      'mkdir -p ' + nodePackagePath,
      'curl -o ' + nodeFilePath + ' ' + buildUrl(osTarget),
      'mkdir -p ' + nodeExpandPath,
      'tar -xzf ' + nodeFilePath + ' -C ' + nodeExpandPath + ' --strip-components=1',
      'chmod +x ' + nodeExpandPath + '/bin/npm',
      'chmod +x ' + nodeExpandPath + '/bin/node',
      'chmod +x ' + nodeExpandPath + '/lib/node_modules/npm/bin/npm'
    ]);
  }

  shellCommands.push.apply(shellCommands, [
    // Includes win64 files.
    isWin64 ? 'cd tmp/lucidworks-view; cp -r win64/installer .; cp win64/*.* .; cd ../..' : '',

    // Creating tar ball
    'cd tmp; tar -cpzf ../packages/' + version + '/lucidworks-view-'+ osTarget.os + '-' + osTarget.platform + '-' + version + '.tar.gz --exclude=lucidworks-view/win64 lucidworks-view/.'
  ]);

  for(var index = 0; index < shellCommands.length; index++){
    var command = shellCommands[index];
    console.log(command);
    console.log(child_process.execSync(command).toString('utf8'));
  }
  cb();
});

////////

function getVersion(){
  var fs = require('fs');
  var packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}


function buildUrl(target){
  //Format https://nodejs.org/dist/v5.8.0/node-v5.8.0-darwin-x64.tar.gz
  return 'http://nodejs.org/dist/'+target.nodeVersion+'/'+packageName(target)+'.'+target.extension;
}

function packageName(target){
  return 'node-'+target.nodeVersion+'-'+target.os+'-'+target.platform;
}

function getOsTarget(){
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

    win64: {
      name: 'win64',
      os: 'windows',
      platform: 'x64'
    },

    sunos: {
      name: 'sunos',
      nodeVersion: nodeversion,
      os: 'sunos',
      platform: 'x64',
      extension: 'tar.gz'
    },
    sunos32: {
      name: 'sunos',
      nodeVersion: nodeversion,
      os: 'sunos',
      platform: 'x86',
      extension: 'tar.gz'
    }
  };
  var os_target = argv.buildTarget ? buildTargets[argv.buildTarget] : {};

  // individual overrides.
  os_target.name = argv.buildname ? argv.buildname: os_target.name;
  os_target.nodeVersion = argv.nodeVersion ? argv.nodeVersion: os_target.nodeVersion;
  os_target.os = argv.os ? argv.os: os_target.os;
  os_target.platform = argv.platform ? argv.platform: os_target.platform;
  os_target.extension = argv.extension ? argv.extension: os_target.extension;
  return os_target;
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
