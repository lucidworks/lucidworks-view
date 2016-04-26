(function () {
  'use strict';

  angular
    .module('lucidworksView.components.landingpage', ['lucidworksView.services.landingPage'])
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

  function Controller($scope, Orwell, LandingPageService) {
    'ngInject';
    var lp = this;
    lp.landingPages = false;

    var resultsObservable = Orwell.getObservable('queryResults');

    resultsObservable.addObserver(function (data) {
      var landing_pages = LandingPageService.getLandingPagesFromData(data);
      if (angular.isArray(landing_pages)) {
        lp.landingPages = _.uniq(landing_pages);
      } else {
        lp.landingPages = false;
      }
    });
  }

})();
