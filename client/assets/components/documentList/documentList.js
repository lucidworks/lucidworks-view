(function() {
    'use strict';

    angular
        .module('fusionSeedApp.components.documentList', ['fusionSeedApp.services.config'])
        .directive('documentList', documentList);

    /* @ngInject */
    function documentList() {
        return {
            restrict: 'EA',
            templateUrl: 'assets/components/documentList/documentList.html',
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = ['ConfigService'];

    /* @ngInject */
    function Controller(ConfigService) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
