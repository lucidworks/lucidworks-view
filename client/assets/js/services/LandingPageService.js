(function () {
  'use strict';

  angular
    .module('lucidworksView.services.landingPage', [])
    .factory('LandingPageService', LandingPageService);

  function LandingPageService(Orwell, $window, ConfigService) {
    'ngInject';

    activate();

    var service = {
      getLandingPagesFromData: getLandingPagesFromData
    };

    return service;


    //////////////

    /**
     * This activate() is to redirect the window the first landing-page
     * in case redirect flag in appConfig
     * is `true`.
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
     * Extracts landing pages from Fusion response data.
     */
    function getLandingPagesFromData(data) {
      return _.get(data, 'fusion.landing-pages');
    }

  }
})();
