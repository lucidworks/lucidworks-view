(function(){
  angular.module('fusionSeedApp.components.documentListItem', ['fusionSeedApp.services.config', 'fusionSeedApp.utils.docs'])
    .directive('documentListItem', documentListItem);

  documentListItem.$inject = [];
  function documentListItem(){
    return {
        restrict: 'EA',
        templateUrl: 'assets/components/documentListItem/documentListItem.html',
        link: linkFunc,
        scope: {
          doc: '='
        },
        controller: Controller,
        controllerAs: 'doc',
        bindToController: true,
    };
  }

  Controller.$inject = ['$log', '$scope', 'DocsHelper'];
  function Controller($log, $scope, DocsHelper){
    var self = this;

    // $log.info(DocsHelper);
  }

  function linkFunc(scope, elem){
    // $log.info(DocsHelper);
  }
})();
