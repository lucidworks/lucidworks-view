(function () {
  angular.module('lucidworksView.services.query', ['lucidworksView.services.config',
      'lucidworksView.services.queryData'
    ])
    .config(Config)
    .constant('QUERY_OBJECT_DEFAULT', {
      q: '*',
      start: 0,
      // Do not override the return of JSON
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

      function getQueryObservable() {
        return queryObservable;
      }

      function getQueryObject() {
        return queryObservable.getContent();
      }

      function setQuery(query) {
        if (ConfigService.config.query_debug) {
          $log.debug('query', query);
        }
        queryObject = _.assign({}, queryObject, query, {rows: ConfigService.config.docs_per_page});
        queryObservable.setContent(queryObject);

      }

    }
  }
})();
