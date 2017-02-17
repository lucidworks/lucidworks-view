(function () {
  angular.module('lucidworksView.services.query', ['lucidworksView.services.config',
      'lucidworksView.services.queryData'
    ])
    .config(Config)
    .provider('QueryService', QueryService);

  function Config(OrwellProvider) {
    'ngInject';
    OrwellProvider.createObservable('query', {});
  }

  function QueryService() {

    this.$get = $get;

    /////////////

    function $get($log, ConfigService, Orwell, QueryDataService, URLService) {
      'ngInject';
      var queryObservable = Orwell.getObservable('query'),
        queryObject = ConfigService.config.default_query;

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
        queryObservable.setContent(ConfigService.config.default_query);
      }

      function getQueryObservable() {
        return queryObservable;
      }

      function getQueryObject() {
        return queryObservable.getContent();
      }

      /**
       * Sets the query and sets off a new search via observable;
       */
      function setQuery(query) {
        if (ConfigService.config.query_debug) {
          $log.debug('query', query);
        }
        queryObject = _.assign({}, queryObject, query, {rows: ConfigService.config.docs_per_page});
        queryObservable.setContent(queryObject);
        URLService.setQueryToURLAndGo(queryObject);
      }

    }
  }
})();
