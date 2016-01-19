angular.module('fusionSeedApp.services').service('ConfigApiService', function($log){
  var configData = window.appConfig;

  var defaultConfigStatic = {
    host: 'http://' + window.location.hostname,
    port:'8764',
    authorizationHeader: {headers: {'Authorization': 'Basic ' + btoa('admin:password123')}},
    AllowAnonymousAccess: true,
    user: 'admin',
    password: 'password123',
    collection: 'POI',
    queryPipelineIdList: ['POI-default','POI-signals'],
    queryProfilesIdList: ['default'],
    requestHandlerList: ['select','autofilter'],
    addl_params: '', //We might not need this
    searchAppTitle: "Fusion Search Seed App",
    head_field: 'name',
    head_url_field: '',
    thumbnail_field: '',
    thumbnail_enabled: true,
    image_field: '',
    image_enabled: true,
    labels: {
    }
  };

  var appConfig;

  init(defaultConfigStatic);

  /**
   * Extend config with the defaults
   */
  function init(defaultConfig){
    appConfig = angular.copy(window.appConfig);
    for(var key in defaultConfig){
      if(defaultConfig.hasOwnProperty(key) && !appConfig.hasOwnProperty(key)){
        appConfig[key] = angular.copy(defaultConfig[key]);
      }
    }
  }

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
      username: appConfig.user,
      passowrd: appConfig.password
    };
  };

  var getLabels = function(){ //TODO: Decide whether defined labels will be the only ones shown
    return appConfig.labels;
  };

  /**
   * Returns all the config properties that
   * ends with a `_field` which is not a blank string
   * and is toggled by explicit enable-ment by `_enabled` of the same type
   */
  var getAllFields = function(){
    var fieldsMap = {};
    _.keys(appConfig).filter(function(item){
      return item.match(/\_field$/);
    }).filter(function(item){
      var key = item.split('_')[0]+'_enabled';
      return _.has(appConfig, key)?appConfig[key]:true;
    }).filter(function(item){
      return _.trim(appConfig[item])!=='';
    }).forEach(function(keyName){
      fieldsMap[keyName] = appConfig[keyName];
    });
    return fieldsMap;
  };


  /**
   * [function Returns specific field of given type]
   * @param  {[string]} fieldType [the type of field that needs to be fetch from the config]
   * @return {[type]}           [the value of the said field or null if not found]
   */
  var getSpecificField = function(fieldType){
    var allFields = getAllFields();
    if(!fieldType.match(/\_field$/)){
      fieldType += '_field';
    }
    return allFields[fieldType]?allFields[fieldType]:null;
  };

  return {
    init: init, //TODO: Only for test env
    getFusionUrl: getFusionUrl,
    getQueryProfile: getQueryProfile,
    getQueryPipeline: getQueryPipeline,
    getLoginCredentials: getLoginCredentials,
    getFields: {
      all: getAllFields,
      get: getSpecificField
    }
  };
});
