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
  ])
    .constant('_', window._)
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', 'ApiBaseProvider', 'ConfigServiceProvider'];

  function config($urlProvider, $locationProvider, ApiBaseProvider, ConfigServiceProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
    ApiBaseProvider.setEndpoint(ConfigServiceProvider.getFusionUrl());
  }

  function run($log, ConfigService) {
    FastClick.attach(document.body);
  }
})();
