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
      anonymous_access: {
        username: '',
        password: ''
      },
      useProxy: true,
      collection: 'MyCollection',
      queryPipelineIdList: ['default', 'not-default'],
      queryProfilesIdList: ['default'],
      use_query_profile: true,
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
      facets: [],
      typeahead_use_query_profile: true,
      typeaheadQueryPipelineIdList: ['default'],
      typeaheadQueryProfilesIdList: ['default'],
      typeahead_fields: ['id'],
      typeahead_requesthandler: 'select'
    })
    /** Config overrides from FUSION_CONFIG.js **/
    .constant('CONFIG_OVERRIDE', window.appConfig) //eslint-disable-line

    .provider('ConfigService', ConfigService);


  /**
   * ConfigService
   *
   * @param {object} CONFIG_DEFAULT  [description]
   * @param {object} CONFIG_OVERRIDE [description]
   */
  function ConfigService(CONFIG_DEFAULT, CONFIG_OVERRIDE) {
    'ngInject';
    var appConfig;

    this.$get = $get;
    this.config = appConfig;
    this.getFusionUrl = getFusionUrl;

    /* initialize on first load */
    init();

    /////////////

    /**
     * Main Service function.
     */
    function $get() {
      'ngInject';
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
        getTypeaheadConfig: getTypeaheadConfig,
        getTypeaheadRequestHandler: getTypeaheadRequestHandler,
        getTypeaheadField: getTypeaheadField,
        getTypeaheadProfile: getTypeaheadProfile,
        getTypeaheadPipeline: getTypeaheadPipeline,
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

    function getTypeaheadConfig(){
      var onlyTypeAheadKeys = _.chain(appConfig).keys(appConfig).filter(function(item){
        return item.match(/^typeahead/);
      }).value();
      return _.pick(appConfig, onlyTypeAheadKeys);
    }

    function getTypeaheadPipeline(){
      return appConfig.typeaheadQueryPipelineIdList[0];
    }

    function getTypeaheadProfile(){
      return appConfig.typeaheadQueryProfilesIdList[0];
    }

    function getTypeaheadRequestHandler(){
      return appConfig.typeahead_requesthandler;
    }

    function getTypeaheadField(){
      return appConfig.typeahead_fields[0];
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
