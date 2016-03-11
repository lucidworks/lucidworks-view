(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.documentList', ['fusionSeedApp.services.config',
      'ngOrwell', 'fusionSeedApp.services.landingPage'
    ])
    .directive('documentList', documentList);

  function documentList() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/documentList/documentList.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true,
      scope: true,
      replace: true
    };

  }


  function Controller($log, $sce, $anchorScroll, Orwell) {
    'ngInject';
    var vm = this;
    vm.docs = [];
    vm.highlighting = {};

    activate();

    ////////

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function (data) {
        $log.debug('in dcl');
        vm.docs = parseDocuments(data);
        vm.highlighting = parseHighlighting(data);
        $anchorScroll('topOfMainContent');
      });
    }

    /**
     * Get the documents from
     * @param  {object} data The result data.
     * @return {array}       The documents returned
     */
    function parseDocuments(data){
      var docs = [];
      if (data.hasOwnProperty('response')) {
        docs = data.response.docs;
      }
      return docs;
    }

    /**
     * Get highlighting from a document.
     * @param  {object} data The result data.
     * @return {object}      The highlighting results.
     */
    function parseHighlighting(data) {
      var highlighting = {};
      if (data.hasOwnProperty('highlighting')){
        _.each(data.highlighting, function(value, key){
          var vals = {};
          if (value) {
            _.each(Object.keys(value), function (key) {
              var val = value[key];
              _.each(val, function(high){
                vals[key] = $sce.trustAsHtml(high);
              });
            });
            highlighting[key] = vals;
          }
        });
      }
      return highlighting;
    }
  }
})();
