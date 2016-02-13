(function() {
  'use strict';

  angular
    .module('fusionSeedApp.services.landingPage', [])
    .factory('LandingPageService', LandingPageService);

  function LandingPageService($log, Orwell, $window) {
    'ngInject';

    activate();

    var service = {};

    return service;


    //////////////

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function(data) {
        var landing_pages = _.get(data, 'fusion.landing-pages');
        $log.debug(landing_pages);
        if(angular.isArray(landing_pages)) {
          $window.location.assign(landing_pages[0]);
        }
      });
    }

  }
})();
