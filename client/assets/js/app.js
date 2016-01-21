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
    'fusionSeedApp.controllers'
  ])
    .constant('_', window._)
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$httpProvider','$locationProvider', 'ApiBaseProvider', 'ConfigServiceProvider'];
  run.$inject = ['$log', 'ConfigService', 'ApiBase', 'QueryService'];

  function config($urlProvider, $httpProvider, $locationProvider, ApiBaseProvider, ConfigServiceProvider) {
    $urlProvider.otherwise('/');
    $httpProvider.interceptors.push('SessionInjector');

    $locationProvider.html5Mode({
      enabled:true,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
    ApiBaseProvider.setEndpoint('http://'+window.location.hostname+':'+window.location.port+'/');
  }

  function run($log, ConfigService, ApiBase, QueryService) {
    FastClick.attach(document.body);
  }
})();
