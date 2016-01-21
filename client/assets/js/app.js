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
    .constant('_', window._)
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$httpProvider','$locationProvider', 'ApiBaseProvider', 'ConfigServiceProvider'];
  run.$inject = ['$log', 'ConfigService', 'ApiBase', 'QueryService','Orwell'];

  function config($urlProvider, $httpProvider, $locationProvider, ApiBaseProvider, ConfigServiceProvider) {
    $urlProvider.otherwise('/');
    $httpProvider.interceptors.push('SessionInjector');

    $locationProvider.html5Mode({
      enabled:true,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
    ApiBaseProvider.setEndpoint('http://'+window.location.hostname+':'+window.location.port);
    // ApiBaseProvider.setEndpoint(ConfigServiceProvider.getFusionUrl());
  }

  function run($log, ConfigService, ApiBase, QueryService, Orwell) {
    Orwell.createObservable('query',{});
    FastClick.attach(document.body);
  }
})();
