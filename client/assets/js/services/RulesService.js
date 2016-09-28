(function () {
  'use strict';

  angular
    .module('lucidworksView.services.rules',
      ["lucidworksView.services.config", "lucidworksView.services.apiBase", "lucidworksView.services.signals"])
    .provider('RulesService', RulesService);

  function RulesService() {

    this.$get = function ($http, ConfigService, ApiBase, SignalsService) {

      var appHost = ApiBase.getEndpoint();
      var solrUrl = appHost + "api/apollo/solr";
      var rulesCollection = ConfigService.config.rules.collection.trim();

      return {

        add: function (rule, success, error) {
          $http.post(solrUrl + '/' + rulesCollection + '/update/json/docs?commit=true', rule)
            .then(function () {
              SignalsService.postSignalData([{
                params: {
                  docId: rule.id,
                  ruleName: rule.ruleName
                },

                timestamp: new Date().toISOString(),
                type: 'add'
              }]);
              success();

            }, error);
        },

        delete: function (id) {
          $http.post(solrUrl + '/' + rulesCollection + '/update?commit=true', {'delete': {id: id}})
            .then(function (response) {
              SignalsService.postSignalData([{
                params: { docId: id},
                timestamp: new Date().toISOString(),
                type: 'delete'
              }]);

              console.log("Rule '" + id + "' deleted!");
            });
        },

        update: function (id, rule) {
          $http.post(solrUrl + '/' + rulesCollection + '/update/json/docs?commit=true', rule)
            .then(function (response) {
              SignalsService.postSignalData([{
                params: {
                  docId: id,
                  ruleName: rule.ruleName
                },
                timestamp: new Date().toISOString(),
                type: 'update'
              }]);

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
