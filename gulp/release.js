var gulp       = require('gulp');
var request    = require('request');
var fs         = require('fs');
var archiver   = require('archiver');
var archive    = archiver('zip');

var uploadUrl;

gulp.task('release', ['createRelease', 'zipBuild', 'uploadAsset']);

gulp.task('createRelease', function () {
  var latestReleaseDate, description;
  var data = {
    "tag_name": "",
    "target_commitish": "master",
    "name": "",
    "body": description,
    "draft": true,
    "prerelease": true
  };

  //getting date of latest release
  request({
    url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/releases/latest',
    method: 'GET',
    headers: {
      'User-Agent': 'AlexKolonitsky'
    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      var bodyObj = JSON.parse(body);
      latestReleaseDate = bodyObj.created_at;
      /*console.log(latestReleaseDate);*/
    }
  });

  //getting list of issues closed since latest release
  request({
    url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/issues',
    method: 'GET',
    qs: {
      "state": "closed",
      "since": latestReleaseDate
    },
    headers: {
      'User-Agent': 'AlexKolonitsky'
    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      var bodyObj = JSON.parse(body);
      description = bodyObj.map(function (issue) {
        return '# ' + issue.number + ' ' + issue.title;
      });
      description = description.join('\n');
      /*console.log(description);*/
    }
  });

  // creating new release and get upload url for assets
  request({
   url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/releases?access_token=',
    method: 'POST',
   qs: data,
   headers: {
   'User-Agent': 'AlexKolonitsky'
   }
   }, function(error, response, body){
   if(error) {
   console.log(error);
   } else {
   var bodyObj = JSON.parse(body);
   uploadUrl = bodyObj.upload_url.replace('{?name,label}','');
   }
   });
});

gulp.task('zipBuild', function () {

  var output = fs.createWriteStream('build.zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory('build/');

  archive.finalize();
});

gulp.task('uploadAsset', function () {
  // adding assets to new release
  request({
    url: uploadUrl + '?name=build.zip&?access_token=',
     method: 'POST',
    headers: {
      'User-Agent': 'AlexKolonitsky',
      'Content-Type': 'application/zip'
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    }
  });

});
