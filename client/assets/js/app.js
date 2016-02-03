/*global FastClick*/
(function () {
  'use strict';

  angular
    .module('application', [
      'ui.router',
      'ngAnimate',

      // Foundation
      'foundation',
      'foundation.dynamicRouting',
      'foundation.dynamicRouting.animations',

      // Libraries
      'ngOrwell',

      // Fusion Seed App
      'fusionSeedApp.components',
      'fusionSeedApp.services',
      'fusionSeedApp.controllers'
    ])
    .constant('_', window._) //eslint-disable-line
    .config(config)
    .run(run);

  /**
   * Main app config
   *
   * @param  {Provider} $urlRouterProvider    Provider for url
   * @param  {Provider} $httpProvider         Provider for http
   * @param  {Provider} $locationProvider     Provider for location
   * @param  {Provider} ApiBaseProvider       Provider for ApiBase
   * @param  {Provider} ConfigServiceProvider Provider for ConfigService
   */
  function config($urlRouterProvider, $httpProvider, $locationProvider, ApiBaseProvider,
    ConfigServiceProvider) {
    'ngInject';
    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.defaults['withCredentials'] = true;

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
    ApiBaseProvider.setEndpoint(ConfigServiceProvider.getFusionUrl());
  }

  /**
   * Main app run time
   *
   * @param  {Service} $document     Document service
   */
  function run($document) {
    'ngInject';
    FastClick.attach($document.body);
  }
})();
