(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.documentList', ['fusionSeedApp.services.config',
      'ngOrwell'
    ])
    .directive('documentList', documentList);

  /* @ngInject */
  function documentList() {
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/documentList/documentList.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

  }

  Controller.$inject = ['$log', '$scope', 'ConfigService', 'QueryService', 'Orwell'];

  /* @ngInject */
  function Controller($log, $scope, ConfigService, QueryService, Orwell) {
    var vm = this;

    activate();

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function () {
        var data = resultsObservable.getContent();
        if (data.hasOwnProperty('response')) {
          vm.docs = data.response.docs;
        } else {
          vm.docs = [];
        }
      });
    }
  }
})();
