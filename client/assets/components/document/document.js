(function () {
  angular.module('lucidworksView.components.document', ['lucidworksView.services.config',
      'lucidworksView.utils.docs', 'lucidworksView.services.signals', 'lucidworksView.components.document.controllers'
    ])
    .directive('document', docMain);


  function docMain() {
    'ngInject';
    return {
      templateUrl: 'assets/components/document/document.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '=',
        highlight: '='
      },
      replace: true
    };
  }

  function Controller($log, $scope, $element, $compile, $templateCache, DocsHelper, ConfigService, SignalsService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      // Do the template stuff here...
      var template = $templateCache.get('components/document.js');
      var newElem = angular.element(template);
      var compiled = $compile(newElem);
      compiled($scope);
      $element.append(newElem);
    }
  }
})();
