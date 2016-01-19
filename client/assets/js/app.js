(function(){
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',

    // Fusion Seed App
    'fusionSeedApp.components',
    'fusionSeedApp.services',
    'ObservableService'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run($log, ConfigApiService) {
    $log.info(ConfigApiService.getFusionUrl()); //DEBUG
    FastClick.attach(document.body);
  }
})();
