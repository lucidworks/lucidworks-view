(function () {
  'use strict';

  angular
    .module('lucidworksView.services.rules', ["lucidworksView.services.config", "lucidworksView.services.apiBase"])
    .provider('RulesService', RulesService);

  function RulesService() {

    this.$get = function ($http, ConfigService, ApiBase) {

      var appHost = ApiBase.getEndpoint();
      var solrUrl = appHost + "api/apollo/solr";
      var rulesCollection = ConfigService.getCollectionName();

      return {

        add: function (rule, success, error) {
          $http.post(solrUrl + '/' + rulesCollection + '/update/json/docs?commit=true', rule)
            .then(success, error);
        },

        delete: function (id) {
          $http.post(solrUrl + '/' + rulesCollection + '/update?commit=true', {'delete': {id: id}})
            .then(function (response) {
              console.log("Rule '" + id + "' deleted!");
            });
        },

        update: function (id, rule) {
          $http.post(solrUrl + '/' + rulesCollection + '/update/json/docs?commit=true', rule)
            .then(function (response) {
              console.log("Rule '" + id + "' updated!");
            });
        },

        getProductFileds: function (callback) {
          callback({
            data: {}
          })
        },

        search: function (filter, callback) {
          var url = appHost + "api/apollo/query-pipelines/" + rulesCollection + "-default/collections/" + rulesCollection + "/select?" +
            "wt=json&fl=*&json.nl=arrarr" + filter.toUrlString();

          $http.get(url).then(callback);
        }
      };
    };
  }
})();
