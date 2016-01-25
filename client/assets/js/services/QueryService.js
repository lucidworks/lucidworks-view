/*global _*/
(function () {
  angular.module('fusionSeedApp.services.query', ['fusionSeedApp.services.config',
      'fusionSeedApp.services.queryData'
    ])
    .config(Config)
    .constant('QUERY_OBJECT_DEFAULT', {
      q: '*:*',
      start: 0,
      rows: 20,
      // Do not override the return of JSON
      wt: 'json'
    })
    .provider('QueryService', QueryService);

  Config.$inject = ['OrwellProvider'];

  function Config(OrwellProvider) {
    OrwellProvider.createObservable('query', {});
  }

  function QueryService() {

    this.$get = ['ConfigService', 'Orwell', 'QUERY_OBJECT_DEFAULT', 'QueryDataService',
      '$log', $get
    ];

    /////////////

    function $get(ConfigService, Orwell, QUERY_OBJECT_DEFAULT, QueryDataService, $log) {
      var queryObservable = Orwell.getObservable('query'),
        queryObject = QUERY_OBJECT_DEFAULT;

      $log.log(queryObject);

      init();

      queryObservable.addObserver(function (query) {
        $log.debug(query);
        QueryDataService.getQueryResults(query);
      });

      return {
        setQuery: setQuery,
        getQueryObservable: getQueryObservable,
        getQueryObject: getQueryObject
      };

      function init() {
        queryObservable.setContent(queryObject);
      }

      function getQueryObservable() {
        return queryObservable;
      }

      function getQueryObject() {
        return queryObservable.getContent();
      }

      function setQuery(query) {
        queryObject = _.assign({}, queryObject, query);
        queryObservable.setContent(queryObject);

      }

    }
  }
})();
