(function() {
    'use strict';
    angular
       .module('fusionSeedApp.services.config', [])

      /** Default config options **/
      .constant('CONFIG_DEFAULT', {
        host: 'http://' + window.location.hostname,
        port:'8764',
        authorizationHeader: {headers: {'Authorization': 'Basic ' + btoa('admin:password123')}},
        AllowAnonymousAccess: true,
        user: 'admin',
        password: 'password123',
        collection: 'Coll',
        connectionRealm: 'native',
        queryPipelineIdList: ['default','not-default'],
        queryProfilesIdList: ['default'],
        requestHandlerList: ['select','autofilter'],
        use_query_profile: true,
        addl_params: '', //We might not need this
        searchAppTitle: "Fusion Search Seed App",
        head_field: 'name',
        profiles_enabled: true,
        head_url_field: '',
        thumbnail_field: '',
        thumbnail_enabled: true,
        image_field: '',
        image_enabled: true,
        labels: {
        }
      })
      /** Config overrides from FUSION_CONFIG.js **/
      .constant('CONFIG_OVERRIDE', window.appConfig)

      .provider('ConfigService', ConfigService);

      ConfigService.$inject = ['CONFIG_DEFAULT', 'CONFIG_OVERRIDE'];

      function ConfigService(CONFIG_DEFAULT, CONFIG_OVERRIDE){
        var appConfig;

        this.$get = ['$log', $get];
        this.getFusionUrl = getFusionUrl;

        /* initialize on first load */
        init();

        /////////////

        function $get($log){
          return {
            init: init, //TODO: Only for test env
            config: appConfig,
            getFusionUrl: getFusionUrl,
            getQueryProfile: getQueryProfile,
            getCollectionName: getCollectionName,
            getQueryPipeline: getQueryPipeline,
            getLoginCredentials: getLoginCredentials,
            getAuthHeader: getAuthHeader,
            getIfQueryProfile: getIfQueryProfile,
            getFields: {
              all: getAllFields,
              get: getSpecificField
            }
          };
        }

        /**
         * Extend config with the defaults
         */
        function init(){
          // Set local override based on arguements passed in.
          var localOverride = (arguments.length > 0)? arguments[0] : {};

          appConfig = _.assign({}, CONFIG_DEFAULT, CONFIG_OVERRIDE, localOverride);
          // build();
        }

        // function build(){
        //   appConfig.fusionUrl = getFusionUrl();
        //   appConfig.queryPipline = getQueryPipeline();
        //   appConfig.queryProfile = getQueryProfile();
        // }

        function getIfQueryProfile(){
          return appConfig.use_query_profile;
        }

        function getFusionUrl(){
          return appConfig.host + ':' + appConfig.port;
        }

        function getQueryPipeline(){
          return appConfig.queryPipelineIdList[0];
        }

        function getQueryProfile(){
          return appConfig.queryProfilesIdList[0];
        }

        function getLoginCredentials(){
          return {
            username: appConfig.user,
            passowrd: appConfig.password
          };
        }

        function getCollectionName(){
          return appConfig.collection;
        }

        function getLabels(){ //TODO: Decide whether defined labels will be the only ones shown
          return appConfig.labels;
        }

        /**
         * @return {object}
         *
         * Returns all the config properties that
         * ends with a `_field` which is not a blank string
         * and is toggled by explicit enable-ment by `_enabled` of the same type
         */
        function getAllFields(){
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
        }

        /**
         * Returns specific field of given type.
         * @param  {string} fieldType The type of field that needs to be fetch from the config
         * @return {*|null}           The value of the said field or null if not found.
         */
        function getSpecificField(fieldType){
          var allFields = getAllFields();
          if(!fieldType.match(/\_field$/)){
            fieldType += '_field';
          }
          return allFields[fieldType]?allFields[fieldType]:null;
        }

        function getAuthHeader(){
          return appConfig.authorizationHeader;
        }
      }
})();
