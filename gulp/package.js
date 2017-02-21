/*eslint-env node*/
/*global global*/
/*eslint no-console:0*/

var $               = require('gulp-load-plugins')();
var gulp            = require('gulp');
var argv            = require('yargs').argv;
var sequence        = require('run-sequence');
var child_process   = require('child_process');

var nodeversion     = 'v5.2.0';
var isWindows = (argv.buildTarget === 'win64') || (argv.buildTarget === 'win32');

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
    '.eslintrc.js',
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
    console.log('\nTo use package you need to use a valid buildTarget parameter.\n  Ex: gulp package --buildTarget=mac\n  Possible build targets: {mac, linux, linux32, win64, win32, sunos, sunos32}\n\nOR all of these parameters:\nbuildname, buildTarget, os, platform, extension\n  Ex: gulp build --buildname=mac --os=darwin --platform=x64 --extension=tar.gz\n');
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
  var tarOptions = ' --exclude=win64 lucidworks-view/';
  var nodeDir = 'tmp/lucidworks-view/lib/nodejs/';
  var nodeDownloadDest = 'tmp/node/';
  var nodePackageUrl = getNodePackageUrl(osTarget);
  var nodePackageName = nodePackageUrl.split('/').pop();
  var nodePackageDir = nodePackageName.replace('.' + osTarget.extension, '');
  var nodeFilePath = nodeDownloadDest + nodePackageName;
  var shellCommands = [ 'mkdir -p packages/' + version ];

  var unpackCommandMap = {
    'tar.gz': 'tar -xzf ' + nodeFilePath + ' -C ' + nodeDir + ' --strip-components=1',
    'zip': ['unzip -qo', nodeFilePath, '-d', nodeDir].join(' ')
  };

  shellCommands.push.apply(shellCommands, [
    'mkdir -p ' + nodeDownloadDest,
    'rm -r ' + nodeDir + '; mkdir -p ' + nodeDir,
    'curl -o ' + nodeFilePath + ' ' + nodePackageUrl,
    unpackCommandMap[osTarget.extension]
  ]);

  if (isWindows) {
    tarOptions = ' --exclude=lucidworks-view' + tarOptions + ' -C lucidworks-view/win64 . -C .. .';
    shellCommands.push(['cd ' + nodeDir, 'mv ' + nodePackageDir + '/* .', 'rm -r ' + nodePackageDir, 'cd -'].join(';'));
  } else {
    shellCommands.push.apply(shellCommands, [
      'chmod +x ' + nodeDir + 'bin/npm',
      'chmod +x ' + nodeDir + 'bin/node',
      'chmod +x ' + nodeDir + 'lib/node_modules/npm/bin/npm'
    ]);
  }

  shellCommands.push('cd tmp; tar -cpzf ../packages/' + version + '/lucidworks-view-'+ osTarget.os + '-' + osTarget.platform + '-' + version + '.tar.gz' + tarOptions);

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

// Url with format - https://nodejs.org/dist/v5.8.0/node-v5.8.0-darwin-x64.tar.gz
function getNodePackageUrl(target) {
  var url = target.nodeInstallerUrl;

  return url || ('http://nodejs.org/dist/' + target.nodeVersion + '/' + packageName(target) + '.' + target.extension);
}

function packageName(target){
  return 'node-' + target.nodeVersion + '-' + target.os + '-' + target.platform;
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

    win32: {
      name: 'win32',
      nodeVersion: 'v6.2.1',
      nodeInstallerUrl: 'https://nodejs.org/dist/v6.2.1/node-v6.2.1-win-x86.zip',
      os: 'windows',
      platform: 'x86',
      extension: 'zip'
    },

    win64: {
      name: 'win64',
      nodeVersion: 'v6.2.1',
      nodeInstallerUrl: 'https://nodejs.org/dist/v6.2.1/node-v6.2.1-win-x64.zip',
      os: 'windows',
      platform: 'x64',
      extension: 'zip'
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
  os_target.nodeInstallerUrl = argv.nodeInstallerUrl || os_target.nodeInstallerUrl;
  os_target.os = argv.os ? argv.os: os_target.os;
  os_target.platform = argv.platform ? argv.platform: os_target.platform;
  os_target.extension = argv.extension ? argv.extension: os_target.extension;

  return os_target;
}
