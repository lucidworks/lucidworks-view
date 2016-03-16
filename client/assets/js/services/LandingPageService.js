(function () {
  'use strict';

  angular
    .module('fusionSeedApp.services.landingPage', [])
    .factory('LandingPageService', LandingPageService);

  function LandingPageService($log, Orwell, $window, ConfigService) {
    'ngInject';

    activate();

    var service = {
      getLandingPagesFromData: getLandingPagesFromData
    };

    return service;


    //////////////

    /**
     * [activate is attach handlers that will redirect the window the first landing-page
     * in case redirect flag in appConfig
     * is `true`.]
     */
    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function (data) {
        var landing_pages = service.getLandingPagesFromData(data);
        if (angular.isArray(landing_pages) && ConfigService.getLandingPageRedirect()) {
          $window.location.assign(landing_pages[0]);
        }
      });
    }

    /**
     * [getLandingPagesFromData Gets landing page data from Fusion response]
     * @param  {} data [The Fusion response]
     * @return {[Object|Array]}      [The landing page data]
     */
    function getLandingPagesFromData(data) {
      return _.get(data, 'fusion.landing-pages');
    }

  }
})();
