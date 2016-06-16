(function () {
  'use strict';

  angular
    .module('lucidworksView.services.localParams', ['lucidworksView.services.config', 'lucidworksView.utils.queryBuilder'])
    .config(Config)
    .factory('LocalParamsService', LocalParamsService);

  function Config(QueryBuilderProvider){
    //Register transformers for localParams
    QueryBuilderProvider.registerTransformer('keyValue', 'localParams', localParamKeyValTransformer);
    QueryBuilderProvider.registerTransformer('join', 'localParams', localParamJoinTransformer);
    QueryBuilderProvider.registerTransformer('wrapper', 'localParams', localParamWrapperTransformer);

    /**
     * Transformers for Local Params.
     */

    /**
     * transform the fq into {!tag=tagName}key:(value) syntax
     * @param  {string} key   the key of the applied filter which contains the tag
     * @param  {string} value the value of the applied filter
     * @return {string}       the transformed filter query
     */
    function localParamKeyValTransformer(key, value){
      return QueryBuilderProvider.arrayJoinString(key, '(' + value + ')', ':');
    }

    /**
     * transform the existing fq with the additional filters values applied
     * syntax: {!tag=tagName}key:(value1 OR value2..)
     * @param  {string} str    the existing filter query
     * @param  {string} values the additional filter values
     * @return {string}        the transformed filter query
     */
    function localParamJoinTransformer(str, values) {
      //extract the current fq key
      var curFilterKey = str.substring(0, _.indexOf(str, ':'));
      //extract the current fq values applied
      var curFilterValue = str.substring(_.indexOf(str, '(')+1, _.indexOf(str, ')'));
      //extract the values of the new filter value which will be joined to the existing filter value with an OR
      var newValue = values.substring(_.indexOf(values, '(')+1, _.indexOf(values, ')'));
      var qbFilterVal = '(' + QueryBuilderProvider.arrayJoinString(curFilterValue, newValue, ' OR ') + ')';
      return QueryBuilderProvider.arrayJoinString(curFilterKey, qbFilterVal, ':');
    }

    function localParamWrapperTransformer(data) {
      return JSON.stringify(data);
    }
  }

  function LocalParamsService() {
    'ngInject';

    var typeKeys = {
      'facet.field': 'field',
      'facet.range': 'range'
      //TODO: future
      // 'facet.pivot': 'pivot',
      //'facet.interval': 'interval',
      // 'facet.query': 'query'
    };

    //syntax for facet filter with local param. Eg: {!tag=tagName}key:(val1 OR val2)
    var facetParamRegexp = /^({!(.*)})?([ -+]?[^:]+(:.+)?)/,
      //syntax for localparams string in facet filter. Eg: tag1=tagName1 tag2=tagName2
      localParamsPairsRegexp = /([^ ?=]+) ?= ?((".*")|('.*')|([^ ]+))?/g,
      //syntax for each local params key-val string. Eg: tag=tagName
      localParamsKvRegexp = /(.*) ?= ?("(.*)"|'(.*)'|([^ ]+))/;

    /**
     * transform string of local params into local param key-val objects
     * @param  {object} pairs array of local param strings
     * @return {object}       key-val pair of local param key and values
     */
    var parseLocalParamKvPairs = function(pairs) {
      return _.reduce(pairs, function(mem, pair) {
        var kv = pair.match(localParamsKvRegexp);
        if (kv) {
          // nasty, remove the quotes from the local-params values:
          kv[2] = kv[2].replace(/^['"]+|['"]+$/g, '');
          mem[kv[1]] = kv[2];
          return mem;
        } else {
          return mem;
        }
      }, {});
    };

    /**
     * return the local params extracted from the params present in the responseHeader, ordered by facet type and facet key
     * @param  {object} params responseHeader params
     * @return {object}        extracted local params
     */
    function getLocalParams(params){
      return _.reduce(typeKeys, function(mem, type, typeKey){
        var val = params[typeKey];
        mem[type] = mem[type] || {};
        //CASE: facet type has existing facets
        if(val){
          var vals = _.isArray(val)?val:[val];
          //construct a facet object for each facet of the facet type
          _.forEach(vals, function(val){
            var lp,
              data = val.match(facetParamRegexp),
              lpData = data[2],
              paramValue = data[3];

            //CASE: if local params exist
            //break down local params string into local params object
            if( lpData ){
              // ensure localparams match the syntax
              var pairs = lpData.match(localParamsPairsRegexp);
              lp = parseLocalParamKvPairs(pairs);
              //CASE: excludes local params exists
              if( lp.ex ){
                lp.ex = lp.ex.split(',');
              }
            }

            //construct facet object for facet type
            var info = {type: type, value: paramValue, localParams: lp, raw: val};
            var k = lp && lp.key || paramValue;
            mem[type][k] = info;
          });
        }
        return mem;
      }, {});
    }

    /**
     * return the excludes local param if it exists in the facet params object
     * @param  {object} paramsObj  facet params object
     * @param  {string} facetValue facet key
     * @return {string}            joined value of the array of excludes local param
     */
    function getLocalParamTag(paramsObj, facetValue) {
      if(_.has(paramsObj[facetValue], 'localParams.ex')){
        return paramsObj[facetValue].localParams.ex.join(',');
      }
    }

    return {
      getLocalParams: getLocalParams,
      getLocalParamTag: getLocalParamTag
    };
  }
})();
