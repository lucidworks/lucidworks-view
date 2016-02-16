(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.documentList', ['fusionSeedApp.services.config',
      'ngOrwell', 'fusionSeedApp.services.landingPage'
    ])
    .directive('documentList', documentList);

  function documentList() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/documentList/documentList.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true,
      scope: true,
      replace: true
    };

  }


  function Controller($log, $scope, $anchorScroll, ConfigService, QueryService, Orwell, LandingPageService) {
    'ngInject';
    var vm = this;
    vm.docs = [];

    activate();

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function (data) {
        if (data.hasOwnProperty('response')) {
          vm.docs = data.response.docs;
        } else {
          vm.docs = [];
        }
        $anchorScroll('topOfMainContent');
      });
    }
  }
})();
