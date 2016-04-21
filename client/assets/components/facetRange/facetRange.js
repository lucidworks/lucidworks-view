(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetRange', [
      'lucidworksView.services.config',
      'foundation.core',
      'fusionSeedApp.utils.queryBuilder'
    ])
    .config(Config);

  function Config(QueryBuilderProvider){
    'ngInject';
    // Register transformers because facet fields can have funky URL syntax.
    QueryBuilderProvider.registerTransformer('keyValue', 'fq:field', fqFieldkeyValueTransformer);
    QueryBuilderProvider.registerTransformer('encode', 'fq:field', fqFieldEncode);
    QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'fq:field', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('wrapper', 'fq:field', fqFieldWrapper);

    // TODO properly implement transformer for localParens
    QueryBuilderProvider.registerTransformer('join', 'localParens', localParenJoinTransformer);
    QueryBuilderProvider.registerTransformer('wrapper', 'localParens', localParenWrapperTransformer);

    /**
     * Transformers.
     *
     * These will transform the output of the query, when the query is created.
     */

    function fqFieldkeyValueTransformer(key, value) {
      var escapedKey = QueryBuilderProvider.escapeSpecialChars(key);
      return QueryBuilderProvider.keyValueString(escapedKey, value, ':');
    }

    function fqFieldEncode(data){
      return QueryBuilderProvider.encodeURIComponentPlus(data);
    }

    function fqFieldPreEncodeWrapper(data){
      return '"'+data+'"';
    }

    function fqFieldWrapper(data){
      return '('+data+')';
    }

    function localParenJoinTransformer(str, values) {
      return QueryBuilderProvider.arrayJoinString(str, values, ' ');
    }

    function localParenWrapperTransformer(data) {
      return '{!' + data + '}';
    }
  }

})();
