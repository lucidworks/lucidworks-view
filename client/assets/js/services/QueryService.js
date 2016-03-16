(function () {
  angular.module('fusionSeedApp.services.query', ['fusionSeedApp.services.config',
      'fusionSeedApp.services.queryData'
    ])
    .config(Config)
    .constant('QUERY_OBJECT_DEFAULT', {
      q: '*:*',
      start: 0,
      rows: 10,
      // Do not override the return type JSON
      wt: 'json'
    })
    .provider('QueryService', QueryService);

  function Config(OrwellProvider) {
    'ngInject';
    OrwellProvider.createObservable('query', {});
  }

  function QueryService() {

    this.$get = $get;

    /////////////

    function $get($log, ConfigService, Orwell, QUERY_OBJECT_DEFAULT, QueryDataService) {
      'ngInject';
      var queryObservable = Orwell.getObservable('query'),
        queryObject = QUERY_OBJECT_DEFAULT;

      activate();

      queryObservable.addObserver(function (query) {
        QueryDataService.getQueryResults(query);
      });

      return {
        setQuery: setQuery,
        getQueryObservable: getQueryObservable,
        getQueryObject: getQueryObject
      };

      function activate() {
        queryObservable.setContent(queryObject);
      }

      /**
       * [getQueryObservable
       * Gets the ngOrwell
       * Observale associated with QueryService]
       *
       * @return {[ngOrwell Observable]} [An observable,
       * triggers whenever there is a change triggered in the observable]
       */
      function getQueryObservable() {
        return queryObservable;
      }

      /**
       * [getQueryObject Gets the actual query object of the current query]
       * @return {[Object]} [The Query object]
       */
      function getQueryObject() {
        return queryObservable.getContent();
      }

      /**
       * [setQuery Sets the query object for a new query
       * And also makes the query]
       * @param {[Object]} query [The query description as an object]
       */
      function setQuery(query) {
        if (ConfigService.config.query_debug) {
          $log.debug('query', query);
        }
        queryObject = _.assign({}, queryObject, query);
        queryObservable.setContent(queryObject);

      }

    }
  }
})();
