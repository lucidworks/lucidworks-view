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

    // TODO properly implement transformer for localParens
    QueryBuilderProvider.registerTransformer('join', 'localParens', localParenJoinTransformer);
    QueryBuilderProvider.registerTransformer('wrapper', 'localParens', localParenWrapperTransformer);

    /**
     * Transformers.
     *
     * These will transform the output of the query, when the query is created.
     */

    function fqFieldkeyValueTransformer(key, value) {
      //var escapedKey = QueryBuilderProvider.escapeSpecialChars(key);
      // at least we need something smarter then simple escaping because field name can contain '-' (dash) for example
      // and simple escaping make this field name invalid.
      return QueryBuilderProvider.keyValueString(key, value, ':');
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

    function localParenJoinTransformer(str, values) {
      return QueryBuilderProvider.arrayJoinString(str, values, ' ');
    }

    function localParenWrapperTransformer(data) {
      return '{!' + data + '}';
    }
  }

})();
