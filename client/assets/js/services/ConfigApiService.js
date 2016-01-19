angular.module('fusionSeedApp.services').service('ConfigApiService', function($log){
  var configData = appConfig;

  var defaultConfig = {
    host: 'http://' + window.location.hostname,
    port:'8764',
    authorizationHeader: {headers: {'Authorization': 'Basic ' + btoa('admin:password123')}},
    AllowAnonymousAccess: true,
    user: 'admin',
    password: 'password123',
    collection: 'POI',
    queryPipelineIdList: ['POI-default','POI-signals'],
    queryProfilesIdList: ['default'],
    requestHandlerList: 'select,autofilter',
    addl_params: '', //We might not need this
    searchAppTitle: "Fusion Search Seed App",
    head_field: 'name',
    head_url_field: '',
    thumbnail_field: '',
    thumbnail_enabled: true,
    image_url: '',
    image_enabled: true,
    labels: {
    }
  };

  var appConfig;

  init();

  /**
   * Extend config with the defaults
   */
  function init(){
    appConfig = angular.copy(window.appConfig);
    for(var key in defaultConfig){
      if(defaultConfig.hasOwnProperty(key) && !appConfig.hasOwnProperty(key)){
        appConfig[key] = angular.copy(defaultConfig[key]);
      }
    }
  }

  /**
   * returns Fusion URL
   */
  var getFusionUrl = function(){
    return appConfig.host + ':' + appConfig.port;
  };

  var getQueryPipeline = function(){
    return appConfig.queryPipelineIdList[0];
  };

  var getQueryProfile = function(){
    return appConfig.queryProfileIdList[0];
  };

  var getLoginCredentials = function(){
    return {
      username: appConfig.username,
      passowrd: appConfig.password
    };
  };

  var getImageUrl = function(){
    return (appConfig.replace(/\s/gi,'') === '' || !appConfig.image_enabled)?null:appConfig.image_url;
  };

  var getThumbnailUrl = function(){
    return (appConfig.replace(/\s/gi,'') === '' || !appConfig.thumbnail_enabled)?null:appConfig.thumbnail_url;
  };

  var getLabels = function(){ //TODO: Decide whether defined labels will be the only ones shown
    return appConfig.labels;
  };

  return {
    getFusionUrl: getFusionUrl,
    getQueryProfile: getQueryProfile,
    getQueryPipeline: getQueryPipeline,
    getLoginCredentials: getLoginCredentials,
    getImageUrl: getImageUrl,
    getThumbnailUrl: getThumbnailUrl
  };
});
