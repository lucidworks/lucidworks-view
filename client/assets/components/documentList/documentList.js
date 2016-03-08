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


  function Controller($scope, $sce, $anchorScroll, Orwell) {
    'ngInject';
    var vm = this;
    vm.docs = [];
    vm.highlighting = {};

    activate();

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function (data) {
        console.log("in dcl");
        if (data.hasOwnProperty('response')) {
          vm.docs = data.response.docs;
        } else {
          vm.docs = [];
        }
        if (data.hasOwnProperty('highlighting')){
          _.each(data.highlighting, function(value, key, list){
            var vals = {};
            if (value) {
              _.each(Object.keys(value), function (key) {
                var val = value[key];
                _.each(val, function(high){
                  vals[key] = $sce.trustAsHtml(high);
                })
              });
              vm.highlighting[key] = vals;
            }
          })
        } else {
          vm.highlighting = {};
        }
        $anchorScroll('topOfMainContent');
      });
    }
  }
})();
