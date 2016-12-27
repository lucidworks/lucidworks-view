var gulp       = require('gulp');
var request    = require('request');
var fs         = require('fs');
var archiver   = require('archiver');
var archive    = archiver('zip');

gulp.task('release', ['zipBuild','createRelease']);

gulp.task('createRelease', function () {

  getLastTagSha ();
  //getting latest pre-release commit sha
  function getLastTagSha () {
    var latestTag = 'v2.3';
    request({
      url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/tags',
      method: 'GET',
      headers: {
        'User-Agent': 'AlexKolonitsky'
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        bodyObj.map(function (tag) {
          if (tag.name == latestTag) {
            var lastTagSha = tag.commit.sha;
            console.log('sha-function');
            console.log(lastTagSha);
            getLastDate(lastTagSha);
          }
        });
      }
    });
  }
  //getting date of latest pre-release
  function getLastDate (lastTagSha) {
    console.log(lastTagSha);
    request({
      url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/commits/' + lastTagSha,
      method: 'GET',
      headers: {
        'User-Agent': 'AlexKolonitsky'
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        var lastTagDate = bodyObj.commit.author.date;
        console.log('date');
        console.log(lastTagDate);
        getDescription (lastTagDate);
      }
    });
  }

  //getting list of issues closed since latest release
  function getDescription (lastTagDate) {
    request({
      url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/issues',
      method: 'GET',
      qs: {
        "state": "closed",
        "since": lastTagDate
      },
      headers: {
        'User-Agent': 'AlexKolonitsky'
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        var description = bodyObj.map(function (issue) {
          console.log(lastTagDate);
          return '# ' + issue.number + ' ' + issue.title;
        });
        description = description.join(', ');
        console.log('description');
        console.log(description);
        postRelease (description);
      }
    });
  }

  // creating new release and get upload url for assets
  function postRelease (description) {
    console.log('posting');
    request({
      url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/releases',
      method: 'POST',
      qs: {
        access_token: "f3e1ffe2b8f012b62619bff4798285a3f6719680",
        tag_name: "v2.4",
        name: "Bug fix",
        body: description || "Release commit",
        draft: true,
        prerelease: true
      },
      headers: {
        'User-Agent': 'AlexKolonitsky'
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        console.log('response');
        console.log(response);
        /*console.log('bodyObj');
        console.log(bodyObj);*/
        var uploadUrl = bodyObj.upload_url.replace('{?name,label}', '');
        uploadAsset (uploadUrl);
      }
    });
  }
  function uploadAsset (uploadUrl) {
    // adding assets to new release
    console.log('uploading');
    request({
      url: uploadUrl + '?name=rules-editor.zip&?access_token=f3e1ffe2b8f012b62619bff4798285a3f6719680',
       method: 'POST',
      headers: {
        'User-Agent': 'AlexKolonitsky',
        'Content-Type': 'application/zip'
      }
    }, function(error, response, body){
      if(error) {
        console.log(error);
      } else {
        console.log('uploaded');
      }
    });

  }
});
gulp.task('zipBuild', function () {

  var output = fs.createWriteStream('rules-editor.zip');

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
