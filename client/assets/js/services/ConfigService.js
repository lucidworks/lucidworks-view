/*global _*/
(function () {
  'use strict';
  angular
    .module('fusionSeedApp.services.config', [])

    /** Default config options **/
    .constant('CONFIG_DEFAULT', {
      host: 'http://localhost',
      port: '8764',
      connectionRealm: 'native',
      AllowAnonymousAccess: true,
      authorizationHeader: {
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
      },
      collection: 'MyCollection',
      queryPipelineIdList: ['default', 'not-default'],
      queryProfilesIdList: ['default'],
      use_query_profile: true,
      addl_params: '', //We might not need this
      searchAppTitle: 'Fusion Seed App',
      head_field: 'title',
      subhead_field: 'subtitle',
      description_field: 'description',
      head_url_field: 'url',
      image_field: 'image',
      image_enabled: true,
      fields_to_display: [],
      profiles_enabled: true, // do we use
      fl: [],
      field_display_labels: {},
      signalType: 'click',
      signalsPipeline: '_signals_ingest',
      facets: []
    })
    /** Config overrides from FUSION_CONFIG.js **/
    .constant('CONFIG_OVERRIDE', window.appConfig) //eslint-disable-line

    .provider('ConfigService', ConfigService);

  ConfigService.$inject = ['CONFIG_DEFAULT', 'CONFIG_OVERRIDE'];

  /**
   * ConfigService
   *
   * @param {object} CONFIG_DEFAULT  [description]
   * @param {object} CONFIG_OVERRIDE [description]
   */
  function ConfigService(CONFIG_DEFAULT, CONFIG_OVERRIDE) {
    var appConfig;

    this.$get = [$get];
    this.getFusionUrl = getFusionUrl;

    /* initialize on first load */
    init();

    /////////////

    /**
     * Main Service function.
     */
    function $get() {
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
        getFieldLabels: getFieldLabels,
        getFieldsToDisplay: getFieldsToDisplay,
        getFields: {
          all: getAllFields,
          get: getSpecificField
        }
      };
    }

    /**
     * Extend config with the defaults
     */
    function init() {
      // Set local override based on arguements passed in.
      var localOverride = (arguments.length > 0) ? arguments[0] : {};

      appConfig = _.assign({}, CONFIG_DEFAULT, CONFIG_OVERRIDE, localOverride);
    }

    function getIfQueryProfile() {
      return appConfig.use_query_profile;
    }

    /**
     * Returns a fusion URL complete w/ endslash.
     *
     * @return {[type]} [description]
     */
    function getFusionUrl() {
      return appConfig.host + ':' + appConfig.port + '/';
    }

    function getQueryPipeline() {
      return appConfig.queryPipelineIdList[0];
    }

    function getQueryProfile() {
      return appConfig.queryProfilesIdList[0];
    }

    function getLoginCredentials() {
      return {
        username: appConfig.user,
        passowrd: appConfig.password
      };
    }

    function getCollectionName() {
      return appConfig.collection;
    }

    // function getLabels() { //TODO: Decide whether defined labels will be the only ones shown
    //   return appConfig.field_display_labels;
    // }

    /**
     * @return {object}
     *
     * Returns all the config properties that
     * ends with a `_field` which is not a blank string
     * and is toggled by explicit enable-ment by `_enabled` of the same type
     */
    function getAllFields() {
      var fieldsMap = {};
      _.keys(appConfig)
        .filter(function (item) {
          return item.match(/\_field$/);
        })
        .filter(function (item) {
          var key = item.split('_')[0] + '_enabled';
          return _.has(appConfig, key) ? appConfig[key] : true;
        })
        .filter(function (item) {
          return _.trim(appConfig[item]) !== '';
        })
        .forEach(function (keyName) {
          fieldsMap[keyName] = appConfig[keyName];
        });
      return fieldsMap;
    }

    /**
     * Returns specific field of given type.
     * @param  {string} fieldType The type of field that needs to be fetch from the config
     * @return {*|null}           The value of the said field or null if not found.
     */
    function getSpecificField(fieldType) {
      var allFields = getAllFields();
      if (!fieldType.match(/\_field$/)) {
        fieldType += '_field';
      }
      return allFields[fieldType] ? allFields[fieldType] : null;
    }

    function getFieldsToDisplay() {
      return appConfig.fields_to_display;
    }

    function getAuthHeader() {
      return appConfig.authorizationHeader;
    }

    function getFieldLabels() {
      return appConfig.field_display_labels;
    }
  }
})();
