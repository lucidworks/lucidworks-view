(function() {
    'use strict';

    angular
        .module('fusionSeedApp.components.documentList', ['fusionSeedApp.services.config','ngOrwell'])
        .directive('documentList', documentList);

    /* @ngInject */
    function documentList() {
        return {
            restrict: 'EA',
            templateUrl: 'assets/components/documentList/documentList.html',
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true,
        };

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = ['$log','$scope','ConfigService','QueryService','Orwell'];

    /* @ngInject */
    function Controller($log, $scope, ConfigService, QueryService,Orwell) {
        var vm = this;

        activate();

        function activate() {
          var queryObservable = Orwell.getObservable('query');

          queryObservable.addObserver(function(){
            //TODO: the callback args aren't working, but getContent is working
            var data = queryObservable.getContent();
            //TODO: Merge the fields with the config and generate a new list of stuff that is cleaner to the UI
            vm.docs = data.response.docs;
          });
        }
    }
})();
