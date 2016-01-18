angular.module('application').service('ConfigApiService', function($log){
  var configData = appConfig;
  console.log(configData);

  var getFusionRoot = function(){
    //TODO: Do something
  };
  return {
    getFusionRoot: getFusionRoot
  };
});
