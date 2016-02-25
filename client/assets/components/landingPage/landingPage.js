(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.landingpage', ['fusionSeedApp.utils.fusion'])
    .directive('landingPage', landingPage);

  function landingPage() {
    'ngInject';
    return {
      controller: Controller,
      templateUrl: 'assets/components/landingPage/landingPage.html',
      controllerAs: 'lp',
      bindToController: true,
      scope: true
    };

  }

  function Controller($log, $scope, Orwell, FusionHelper) {
    'ngInject';
    var lp = this;
    lp.landingPages = false;

    var resultsObservable = Orwell.getObservable('queryResults');

    resultsObservable.addObserver(function(data) {
      var landing_pages = FusionHelper.getLandingPagesFromData(data);
      $log.debug('landing_pages', landing_pages);
      if(angular.isArray(landing_pages)){
        lp.landingPages = landing_pages;
      }
      else{
        lp.landingPages = false;
      }
    });
  }
})();
