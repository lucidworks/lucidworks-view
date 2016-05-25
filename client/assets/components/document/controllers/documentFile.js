(function () {
  angular.module('lucidworksView.components.document.file', ['lucidworksView.services.config',
      'lucidworksView.utils.docs', 'lucidworksView.services.signals'
    ])
    .controller('documentFileController', documentDefault);

  function documentDefault($scope, DocsHelper, $filter){
    'ngInject';

    var vm = $scope.$parent.vm;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.length_lFormatted = $filter('humanizeFilesize')(doc.length_l);
      doc.lastModified_dtFormatted = $filter('date')(doc.lastModified_dt);
      return doc;
    }
  }
})();
