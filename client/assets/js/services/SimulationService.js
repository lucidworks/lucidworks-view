(function () {
  'use strict';

  angular
    .module('lucidworksView.services.simulation', ["lucidworksView.services.config", "lucidworksView.services.apiBase"])
    .provider('SimulationService', SimulationService);

  function SimulationService() {

    this.$get = function ($http, ConfigService, ApiBase) {

      var appHost = ApiBase.getEndpoint();
      var collection = ConfigService.config.collection.trim();
      var appName = '&appName=' + collection + 'AdvUI';

      function escape(str) {
        return  encodeURI(str).replace(/&/g, '%26').replace(/\//g, '%2F').replace(/#/g, '%23');
      }

      function geo(lw) {
        if (lw.geo_enabled && lw.coordinates.length > 0) {
          return '&sfield=' + lw.geofield + '&pt=' + lw.coordinates
            + '&d=' + lw.distance + '&fq={!bbox}&queryOpts=spatial&fl=distance:product(geodist(),0.621)';
        }

        return '';
      }

      function sort(lw) {
        if (lw.sort_by == lw.head_field) {
          return '&sort=' + lw.head_field + ' ' + lw.sort_order;
        } else if (lw.sort_by == "distance" && lw.coordinates.length > 0) {
          return '&sort=geodist()' + ' ' + lw.sort_order; //Sort by distance
        } else {
          return ''; //Sort by relevannce
        }
      }

      function query(q) {
        return '?&wt=json&q=' + escape(q || '*:*') + '&debug=true&fl=score,explain:[explain style=nl]';
      }

      function mm(lw) {
        return lw.mm == 'default' ? '' : '&mm=' + lw.mm;
      }

      function fq(fqs) {
        var res = '';
        for (var i = 0; i < fqs.length; i++) {
          res += '&fq=' + escape(fqs[i])
        }

        return res;
      }


      return {

        search: function (lw, q, fqs, within, start, rules_exclude, incexlStr, success, error) {
          var url = appHost + 'api/apollo/query-pipelines/' + lw.pipename + '/' + 'collections/' + collection
            + '/' + lw.requestHandler + query(q) + within + fq(fqs) + '&fl=' + lw.fl + '&start=' + start + sort(lw) + geo(lw)
            + rules_exclude + incexlStr
            + mm(lw) + appName + lw.addl_params;

          $http.get(url)
            .success(success)
            .error(error);
        }
      };
    };
  }
})();


/*
*
* http://localhost:8764/api/apollo/query-pipelines/os_prod-with-rules/collections/os_prod/select?&wt=json&q=girl&debug=true&fl=score,explain:[explain%20style=nl]&fl=Name,PhraseText,ProductID,Price-sort&start=0&appName=os_prodAdvUI
* http://localhost:3000/api/apollo/query-pipelines/os_prod-with-rules/collections/os_prod/select?&wt=json&q=girl&debug=true&fl=score,explain:[explain%20style=nl]&fq=undefined&fl=Name,PhraseText,ProductID,Price-sort&start=0&appName=os_prodAdvUI
* */
