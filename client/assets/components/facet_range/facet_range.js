(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetRange', [
      'lucidworksView.services.config',
      'foundation.core',
      'lucidworksView.utils.queryBuilder'
    ])
    .config(Config);

  function Config(QueryBuilderProvider){
    'ngInject';
    
   /**
    * Transformers.
    *
    * These will transform the output of the query, when the query is created.
    */
    
    // Register transformers because range facet fields can have funky URL syntax.
    QueryBuilderProvider.registerTransformer('keyValue', 'fq:range', fqFieldkeyValueTransformer);
    QueryBuilderProvider.registerTransformer('encode', 'fq:range', fqFieldEncode);
    QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'fq:range', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('wrapper', 'fq:range', fqFieldWrapper);
    QueryBuilderProvider.registerTransformer('join', 'TO', fqJoiner);
    QueryBuilderProvider.registerTransformer('keyValue', 'TO', fqKeyValueBlank);

    function fqKeyValueBlank(key, value){
      return value;
    }

    function fqJoiner(str, value){
      return str + ' TO ' + value;
    }

    function fqFieldkeyValueTransformer(key, value) {
      var escapedKey = QueryBuilderProvider.escapeSpecialChars(key);
      return QueryBuilderProvider.keyValueString(escapedKey, value, ':');
    }

    function fqFieldEncode(data){
      return QueryBuilderProvider.encodeURIComponentPlus(data);
    }

    function fqFieldPreEncodeWrapper(data){
      return data;
    }

    function fqFieldWrapper(data){
      return '['+data+']';
    }
  }
})();
