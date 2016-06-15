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
    function localParamKeyValTransformer(key, value){
      return QueryBuilderProvider.arrayJoinString(key, '(' + value + ')', ':');
    }

    function localParamJoinTransformer(str, values) {
      var curFilterKey = str.substring(0, _.indexOf(str, ':'));
      var curFilterValue = str.substring(_.indexOf(str, '(')+1, _.indexOf(str, ')'));
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

    var facetParamRegexp = /^({!(.*)})?([ -+]?[^:]+(:.+)?)/,
      localParamsPairsRegexp = /([^ ?=]+) ?= ?((".*")|('.*')|([^ ]+))?/g,
      localParamsKvRegexp = /(.*) ?= ?("(.*)"|'(.*)'|([^ ]+))/;

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

    function getLocalParams(params){
      return _.reduce(typeKeys, function(mem, type, typeKey){
        var val = params[typeKey];
        mem[type] = mem[type] || {};
        if(val){
          var vals = _.isArray(val)?val:[val];
          _.forEach(vals, function(val){
            var lp,
              data = val.match(facetParamRegexp),
              lpData = data[2],
              paramValue = data[3];

            if( lpData ){
              var pairs = lpData.match(localParamsPairsRegexp);
              lp = parseLocalParamKvPairs(pairs);
              if( lp.ex ){
                lp.ex = lp.ex.split(',');
              }
            }

            var info = {type: type, value: paramValue, localParams: lp, raw: val};
            var k = lp && lp.key || paramValue;
            mem[type][k] = info;
          });
        }
        return mem;
      }, {});
    }

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
