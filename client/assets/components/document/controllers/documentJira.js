(function () {
  angular.module('lucidworksView.components.document.jira', [])
    .controller('documentJiraController', documentDefault);

  function documentDefault($scope, $filter){
    'ngInject';

    var vm = $scope.$parent.vm;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.lastModified_dtFormatted = $filter('date')(doc.lastModified_dt);
      return doc;
    }
  }
})();
