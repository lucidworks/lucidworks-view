(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.paginate')
    .directive('paginate', paginate);

  /* @ngInject */
  function paginate() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/paginate/paginate.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  }

  Controller.$inject = ['Orwell'];

  /* @ngInject */
  function Controller(Orwell) {
    var vm = this;
    vm.page = 0;
    vm.totalPages = 1;
    vm.getNormalizedPage = getNormalizedPage;



    activate();

    function activate() {
      var queryObservable = Orwell.getObservable('query');

      queryObservable.addObserver(function(){
        var data = queryObservable.getContent();
        if(data.hasOwnProperty('response')){
          vm.docs = data.response.docs;
        } else {
          vm.docs = [];
        }
      });
    }

    function getNormalizedPage(){
      return vm.page + 1;
    }

  }
})();
