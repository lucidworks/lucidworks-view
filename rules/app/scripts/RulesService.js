var rulesApp = angular.module('rulesApp', []);

rulesApp.factory('RulesService', ['$http',
  function($http){
    var appHost = "http://localhost:8764";
    var solrUrl = "http://localhost:8764/api/apollo/solr";
    var rulesCollection = "bsb_products_rules";
    var auth = { headers: { 'Authorization': 'Basic ' + btoa('admin:123qweasdzxc')}};

    return {

      add: function (rule) {
        $http.post(solrUrl + '/' + rulesCollection + '/update/json/docs?commit=true', rule, auth).then(function(response) {
          console.log("Rule '" + rule.id + "' created!");
        });
      },

      delete: function (id) {
        $http.post(solrUrl + '/' + rulesCollection + '/update?commit=true', {'delete': {id: id}}, auth).then(function(response) {
          console.log("Rule '" + id + "' deleted!");
        });
      },

      update: function(id, rule){
        console.log("updating rule: ", id, rule);
        $http.post(solrUrl + '/' + rulesCollection + '/update/json/docs?commit=true', rule, auth).then(function(response) {
          console.log("Rule '" + id + "' updated!");
        });
      },

      search: function(filter, callback){
        var url = appHost + "/api/apollo/query-pipelines/" + rulesCollection + "-default/collections/" + rulesCollection + "/select?" +
          "wt=json&fl=*&json.nl=arrarr" + filter.toUrlString();

        $http.get(url, auth).then(callback);
      }
    };
  }
]);
