angular.module('application')
  .service('ConfigApiService', function($log){
    var configData = appConfig;
    console.log(configData);

    return {
      getFusionRoot: getFusionRoot
    };

    function getFusionRoot(){
      //TODO: Do something
    }


  });
