var gulp       = require('gulp');
var request    = require('request');
var fs         = require('fs');
var archiver   = require('archiver');
var archive    = archiver('zip');

gulp.task('release', ['createRelease','zipBuild']);

gulp.task('createRelease', function () {
  var latestTag = 'v2.3';
  var newVersion = 'v2.4';
  var releaseName = 'Bug fix';
  getLastTagSha ();
  //getting latest pre-release commit sha
  function getLastTagSha () {
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
          return '# ' + issue.number + ' ' + issue.title;
        });
        description = description.join(', ')|| "Release commit";
        postRelease (description);
      }
    });
  }

  // creating new release and get upload url for assets
  function postRelease (description) {
    console.log('posting');
    var data = {
      tag_name: newVersion,
      name: releaseName,
      body: description,
      draft: true,
      prerelease: true
    };
    request({
      url: 'https://api.github.com/repos/AlexKolonitsky/lucidworks-view/releases?access_token=526379b0cf116515be7d14ac1d8b6e9887cc7d70',
      method: 'POST',
      headers: {
        'User-Agent': 'AlexKolonitsky',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        var uploadUrl = bodyObj.upload_url.replace('{?name,label}', '');
        changeConfigVersion ();
        /*uploadAsset (uploadUrl);*/
      }
    });
  }
  /*function uploadAsset (uploadUrl) {
    // adding assets to new release
    console.log('uploading');
    var size = fs.statSync("rules-editor.zip").size;
    console.log('file size');
    console.log(size);
    request({
      url: uploadUrl + '?access_token=526379b0cf116515be7d14ac1d8b6e9887cc7d70&name=rules-editor.zip&size=' + size,
      method: 'POST',
      headers: {
        'User-Agent': 'AlexKolonitsky',
        'Content-Type': 'application/zip'
      }
    }, function(error, response, body){
      if(error) {
        console.log(error);
      } else {
        var bodyObj = JSON.parse(body);
        console.log('uploaded');
        console.log(response);
      }
    });

  }*/
  function changeConfigVersion () {
    fs.readFile('FUSION_CONFIG.js', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace("version: '" + latestTag + "'", "version: '" + newVersion + "'");

      fs.writeFile('FUSION_CONFIG.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
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

  archive.directory('build/', '');

  archive.finalize();

});


