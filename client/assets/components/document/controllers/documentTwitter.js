(function () {
  angular.module('lucidworksView.components.document.twitter', [])
    .controller('documentTwitterController', documentDefault);

  function documentDefault($scope, $filter){
    'ngInject';

    var vm = $scope.$parent.vm;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.createdAtFormatted = $filter('date')(doc.createdAt[0]);
      return doc;
    }
  }
})();
