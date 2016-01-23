(function(){
  'use strict';

  angular.module('application', [
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
    'fusionSeedApp.controllers',
    'ngOrwell'
  ])
    .constant('_', window._)//eslint-disable-line
    .config(config)
    .run(run);

  config.$inject = ['$urlRouterProvider', '$httpProvider','$locationProvider', 'ApiBaseProvider', 'ConfigServiceProvider'];
  run.$inject = ['$document', '$log', 'ConfigService', 'ApiBase', 'QueryService'];

  function config($urlProvider, $httpProvider, $locationProvider, ApiBaseProvider, ConfigServiceProvider) {
    $urlProvider.otherwise('/');
    $httpProvider.interceptors.push('SessionInjector');

    $locationProvider.html5Mode({
      enabled:true,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
    ApiBaseProvider.setEndpoint(ConfigServiceProvider.getFusionUrl());
  }

  function run($document, $log, ConfigService, ApiBase, QueryService) {
    FastClick.attach($document.body);
  }
})();
