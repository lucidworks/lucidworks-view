(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetField', [
      'lucidworksView.services.config',
      'foundation.core',
      'lucidworksView.utils.queryBuilder',
      'angular-humanize'
    ])
    .config(Config);

  function Config(QueryBuilderProvider){
    'ngInject';
    // Register transformers because facet fields can have funky URL syntax.
    QueryBuilderProvider.registerTransformer('keyValue', 'fq:field', fqFieldkeyValueTransformer);
    QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'fq:field', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('encode', 'fq:field', fqFieldEncode);
    QueryBuilderProvider.registerTransformer('wrapper', 'fq:field', fqFieldWrapper);


    /**
     * Transformers.
     *
     * These will transform the output of the query, when the query is created.
     */

    function fqFieldkeyValueTransformer(key, value) {
      var escapedKey = QueryBuilderProvider.escapeSpecialChars(key);
      return QueryBuilderProvider.keyValueString(escapedKey, value, ':');
    }

    function fqFieldPreEncodeWrapper(data){
      return '"'+data+'"';
    }

    function fqFieldEncode(data){
      return QueryBuilderProvider.encodeURIComponentPlus(data);
    }

    function fqFieldWrapper(data){
      return '('+data+')';
    }
  }

})();
