var args = require('yargs').argv;
var gulp = require('gulp');
var http = require('http');
var _    = require('lodash');

// Get's you a Auth header in the config
gulp.task('setupAuthHeader', function() {
  var defaults = {
    hostname: 'localhost:8764',
    username: 'admin',
    password: 'password123',
    realm: 'native'
  };

  var options = _.assign(defaults, args);
  options.port = (options.hostname.split(':')[1])?options.hostname.split(':')[1]:80;
  //Because if there is no port name we imply 80 on HTTP TODO: https 443
  options.hostname = options.hostname.split(':')[0];

  var postData = JSON.stringify({
    username: options.username,
    password: options.password
  });

  var requestOptions = {
    hostname: options.hostname,
    port: options.port,
    path: '/api/session?cookie=false&realmName=' + options.realm,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  console.log('Getting authorizaton from');
  console.log('http://' + options.hostname + ':' + options.port);
  console.log();
  var req = http.request(requestOptions, function(res){
    if(res.statusCode === 201){
      console.log('Authenticated user');
      var token = (new Buffer(options.username + ':' + options.password)).toString('base64');
      console.log('Paste this and replace authorizationHeader in FUSION_CONFIG.js to use this pair of username:password');
      var authHeader = {
        'authorizationHeader': {
          'Authorization': 'Basic ' + token
        }
      };
      console.log(JSON.stringify(authHeader));
    }
    else{
      console.log('Wrong authentication credentials, please check username:password with the system administrator');
    }
  });

  req.write(postData);
});
