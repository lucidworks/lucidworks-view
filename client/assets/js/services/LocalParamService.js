(function () {
  'use strict';

  angular
    .module('lucidworksView.services.localParams', [])
    .factory('LocalParamsService', LocalParamsService);

  function LocalParamsService() {
    'ngInject';

    var typeKeys = {
      'facet.field': 'field',
      'facet.range': 'range'
      //TODO: future
      // 'facet.pivot': 'pivot',
      //'facet.interval': 'interval',
      // 'facet.query': 'query',
      //'facet.date': 'date'
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

    return {
      getLocalParams: getLocalParams
    };
  }
})();
