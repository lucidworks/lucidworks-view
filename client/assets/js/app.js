(function () {
  'use strict';

  angular
    .module('lucidworksView', [
      'ui.router',
      'ngAnimate',
      'ngSanitize',

      // Foundation
      'foundation',
      'foundation.dynamicRouting',
      'foundation.dynamicRouting.animations',

      // Libraries
      'ngOrwell',
      'rison',

      // Fusion Seed App
      'lucidworksView.components',
      'lucidworksView.services',
      'lucidworksView.controllers',

      //Datepicker
      'ADM-dateTimePicker'
    ])
    .constant('_', window._) //eslint-disable-line
    .config(config)
    .run(run);

  /**
   * Main app config
   *
   * @param  {Provider} $logProvider          Provider for log
   * @param  {Provider} $urlRouterProvider    Provider for url
   * @param  {Provider} $httpProvider         Provider for http
   * @param  {Provider} $locationProvider     Provider for location
   * @param  {Provider} ApiBaseProvider       Provider for ApiBase
   * @param  {Provider} ConfigServiceProvider Provider for ConfigService
   */
  function config($logProvider, $urlRouterProvider, $httpProvider, $locationProvider, ApiBaseProvider,
    ConfigServiceProvider, $windowProvider) {
    'ngInject';

    $logProvider.debugEnabled(true);

    $urlRouterProvider.otherwise('search');

/*
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');
*/

    // If using a proxy use the same url.
    $httpProvider.interceptors.push('AuthInterceptor');

    if (ConfigServiceProvider.config.use_proxy) {
      var $window = $windowProvider.$get();
      ApiBaseProvider.setEndpoint($window.location.protocol + '//' + $window.location.host + '/');
      $httpProvider.defaults['withCredentials'] = true;

    } else {
      ApiBaseProvider.setEndpoint(ConfigServiceProvider.getFusionUrl());
    }
  }

  /**
   * Main app run time
   *
   * @param  {Service} $document     Document service
   */
  function run($document, $rootScope, ConfigService) {
    'ngInject';
    $rootScope.title = ConfigService.config.search_app_title;
  }
})();
