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
    console.log('alsdfksfklsdfkjsflkslfkasdfklsjdf');

    // I don't know if this is called, may be able to delete it
    // Register transformers because range facet fields can have funky URL syntax.
    QueryBuilderProvider.registerTransformer('keyValue', 'fq:range', fqFieldkeyValueTransformer);
    QueryBuilderProvider.registerTransformer('encode', 'fq:range', fqFieldEncode);
    QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'fq:range', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('wrapper', 'fq:range', fqFieldWrapper);

    // // TODO properly implement transformer for localParens
    QueryBuilderProvider.registerTransformer('join', 'localParens', localParenJoinTransformer);
    QueryBuilderProvider.registerTransformer('wrapper', 'localParens', localParenWrapperTransformer);
    //
    // /**
    //  * Transformers.
    //  *
    //  * These will transform the output of the query, when the query is created.
    //  */

    function fqFieldkeyValueTransformer(key, value) {
      console.log('aslkdfjlsdfjkl');
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

  // http://localhost:8764/api/apollo/query-pipelines/lucidfind-default/collections/lucidfind/select?debug=true&echoParams=all&fl=*,score&fq=publishedOnDate:(%5B2016-03-02T00:00:00Z+TO+2016-03-02T00:00:00Z%2B1MONTH%5D)&json.nl=arrarr&q=*:*&rows=10&start=0&wt=json

  // http://localhost:3002/api/apollo/collections/lucidfind/query-profiles/default/
  // GOOD

//   2016-03-02T00:00:00Z
//   2016-03-02T00:00:00Z
// select?debug=true&echoParams=all&fl=*,score&fq=publishedOnDate:(%5B2016-03-02T00:00:00Z+TO+2016-03-02T00:00:00Z%2B1MONTH%5D)&json.nl=arrarr&q=*:*&rows=10&start=0&wt=json
// // NEEDSWORK
//   select?q=*&start=0&wt=json&rows=10&fq=publishedOnDate:(%222016-03-02T00%3A00%3A00Z%22)

})();
