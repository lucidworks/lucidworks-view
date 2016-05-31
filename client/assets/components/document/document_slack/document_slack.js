(function () {
  angular.module('lucidworksView.components.document.controllers.slack', [])
    .controller('documentSlackController', documentDefault);

  function documentDefault($scope, $filter){
    'ngInject';

    var vm = $scope.$parent.vm;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.timestamp_tdtFormatted = $filter('date')(vm.doc.timestamp_tdt, 'M/d/yy h:mm:ss a');
      // For multivalued fields
      doc.text = _.isArray(doc.text)?_.join(doc.text,' '):doc.text;
      return doc;
    }
  }
})();
