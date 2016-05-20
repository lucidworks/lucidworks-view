(function () {
  'use strict';
  angular
    .module('lucidworksView.services.config', [])

    /** Default config options **/
    .constant('CONFIG_DEFAULT', {
      host: 'http://localhost',
      port: '8764',
      connection_realm: 'native',
      anonymous_access: {
        username: '',
        password: ''
      },
      // change default for fusion 2.3
      use_proxy: true,
      collection: 'MyCollection',
      logo_location: 'assets/img/logo/lucidworks-white.svg',
      query_debug: false,
      query_pipeline_id: 'default',
      query_profile_id: 'default',
      use_query_profile: true,
      search_app_title: 'Fusion Seed App',
      head_field: 'title',
      subhead_field: 'subtitle',
      description_field: 'description',
      head_url_field: 'url',
      image_field: 'image',
      fields_to_display: [],
      field_display_labels: {},
      sort_fields: [],
      signal_type: 'click',
      signals_pipeline: '_signals_ingest',
      signals_document_id: 'id',
      facets: [],
      docs_per_page: 10,
      typeahead_use_query_profile: true,
      typeahead_query_pipeline_id: 'default',
      typeahead_query_profile_id: 'default',
      typeahead_fields: ['id'],
      typeahead_requesthandler: 'select',
      landing_page_redirect: true
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
    var appConfig,
      vm = this;

    vm.$get = $get;
    vm.getFusionUrl = getFusionUrl;

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
        getIfQueryProfile: getIfQueryProfile,
        getFieldLabels: getFieldLabels,
        getFieldsToDisplay: getFieldsToDisplay,
        getTypeaheadConfig: getTypeaheadConfig,
        getTypeaheadRequestHandler: getTypeaheadRequestHandler,
        getTypeaheadField: getTypeaheadField,
        getIfTypeaheadQueryProfile: getIfTypeaheadQueryProfile,
        getTypeaheadProfile: getTypeaheadProfile,
        getTypeaheadPipeline: getTypeaheadPipeline,
        getLandingPageRedirect: getLandingPageRedirect,
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
      vm.config = appConfig;
    }

    function getIfQueryProfile() {
      return appConfig.use_query_profile;
    }

    /**
     * Returns a fusion URL complete w/ endslash.
     */
    function getFusionUrl() {
      return appConfig.host + ':' + appConfig.port + '/';
    }

    function getQueryPipeline() {
      return appConfig.query_pipeline_id;
    }

    function getQueryProfile() {
      return appConfig.query_profile_id;
    }

    function getLoginCredentials() {
      return {
        username: appConfig.user,
        passowrd: appConfig.password
      };
    }

    function getLandingPageRedirect(){
      return appConfig.landing_page_redirect;
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

    function getIfTypeaheadQueryProfile() {
      return appConfig.typeahead_use_query_profile;
    }

    function getTypeaheadPipeline(){
      return appConfig.typeahead_query_pipeline_id;
    }

    function getTypeaheadProfile(){
      return appConfig.typeahead_query_profile_id;
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

    function getFieldLabels() {
      return appConfig.field_display_labels;
    }
  }
})();
