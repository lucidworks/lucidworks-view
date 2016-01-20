(function() {
    'use strict';

    angular
        .module('fusionSeedApp.components.fieldFilter', [])
        .directive('fieldFilter', fieldFilter);

    /* @ngInject */
    function fieldFilter() {
        return {
            restrict: 'EA',
            templateUrl: 'assets/components/fieldFilter/fieldFilter.html',
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    /* @ngInject */
    function Controller(ConfigService) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
