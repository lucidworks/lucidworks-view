(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.landingpage', [])
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

  function Controller($log, $scope, Orwell) {
    'ngInject';
    var lp = this;
    lp.landingPages = false;

    var resultsObservable = Orwell.getObservable('queryResults');

    resultsObservable.addObserver(function(data) {
      var landing_pages = getLandingPagesFromData(data);
      $log.debug('landing_pages', landing_pages);
      if(angular.isArray(landing_pages)){
        lp.landingPages = landing_pages;
      }
      else{
        lp.landingPages = false;
      }
    });
  }

  /**
   * Extracts landing pages from Fusion response data.
   */
  function getLandingPagesFromData(data){
    return _.get(data, 'fusion.landing-pages');
  }
})();
