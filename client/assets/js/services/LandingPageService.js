(function() {
  'use strict';

  angular
    .module('fusionSeedApp.services.landingPage', [])
    .factory('LandingPageService', LandingPageService);

  function LandingPageService($log, Orwell, $window, ConfigService, FusionHelper) {
    'ngInject';

    activate();

    var service = {};

    return service;


    //////////////

    /**
     * This activate() is to redirect the window the first landing-page
     * in case redirect flag in appConfig
     * is `true`.
     */
    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function(data) {
        var landing_pages = FusionHelper.getLandingPagesFromData(data);
        $log.debug('landing_pages', landing_pages);
        if(angular.isArray(landing_pages) && ConfigService.getLandingPageRedirect()){
          $window.location.assign(landing_pages[0]);
        }
      });
    }

  }
})();
