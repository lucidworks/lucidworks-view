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

    // TODO properly implement transformer for localParams
    QueryBuilderProvider.registerTransformer('keyValue', 'localParams', localParamKeyValTransformer);
    // QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'localParams', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('encode', 'localParams', fqFieldEncode);
    // QueryBuilderProvider.registerTransformer('wrapper', 'localParams', fqFieldWrapper);
    QueryBuilderProvider.registerTransformer('join', 'localParams', localParamJoinTransformer);
    QueryBuilderProvider.registerTransformer('wrapper', 'localParams', localParamWrapperTransformer);

    /**
     * Transformers.
     *
     * These will transform the output of the query, when the query is created.
     */

    function fqFieldkeyValueTransformer(key, value) {
      var escapedKey = QueryBuilderProvider.escapeSpecialChars(key);
      var y = QueryBuilderProvider.keyValueString(escapedKey, value, ':');
      return y;
    }

    function fqFieldPreEncodeWrapper(data){
      return '"'+data+'"';
    }

    function fqFieldEncode(data){
      console.log('encode', data);
      return QueryBuilderProvider.encodeURIComponentPlus(data);
    }

    function fqFieldWrapper(data){
      return '('+data+')';
    }

    function localParamKeyValTransformer(key, value){
      var tag, curFilterKey, curFilterValue;
      curFilterKey = key;
      curFilterValue = value;
      var qbFilterVal = '(' + QueryBuilderProvider.arrayJoinString(curFilterValue, value.split('=')[1], ' OR ') + ')';
      var filter = QueryBuilderProvider.arrayJoinString(curFilterKey, qbFilterVal, ':');
      return filter;
    }

    function localParamJoinTransformer(str, values) {
      var curFilterKey = str.substring(0, _.indexOf(str, ':'));
      var curFilterValue = str.substring(_.indexOf(str, '(')+1, _.indexOf(str, ')'));
      var newValue = values.substring(_.indexOf(values, '(')+1, _.indexOf(values, ')'));
      var qbFilterVal = '(' + QueryBuilderProvider.arrayJoinString(curFilterValue, newValue, ' OR ') + ')';
      var filter = QueryBuilderProvider.arrayJoinString(curFilterKey, qbFilterVal, ':');
      console.log('filter join', filter);
      return filter;
    }

    function localParamWrapperTransformer(data) {
      return JSON.stringify(data);
    }
  }

})();
