(function () {
  'use strict';
  angular
      .module('lucidworksView.components.recommendations', [
        'lucidworksView.services',
        'angucomplete-alt', 
        'angular-humanize'
      ])
      .directive('recommendations', recommendations);

  function recommendations() {
    'ngInject';

    return {
      restrict: 'EA',
      templateUrl: 'assets/components/recommendations/recommendations.html',
      controller: Controller,
      controllerAs: 'rc',
      bindToController: {},
      scope: true,
      replace: true
    };
  }

  function Controller(Orwell, $log) {
    console.log("In the controller for the recommendations js stage");
    'ngInject';
    var rc = this; //eslint-disable-line
    rc.mltDocs = [];
    rc.cfDocs = [];
    rc.preCFDocs = [];
    activate();

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');
      resultsObservable.addObserver(function(data) {
        // Get the recommendations
        checkRecommendations(data);
      });

      function checkRecommendations(data) {
      // console.log("In the check recommendations portion of the home controller!");
        if (data.hasOwnProperty('moreLikeThis')){
          console.log("We have more like this! Let's populate the rc");
          for (var key in data.moreLikeThis) {
            rc.mltDocs.push(data.moreLikeThis[key].docs);
          }
          console.log(rc.mltDocs);
        }
      }

    }
  }
})();
