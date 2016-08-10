(function () {
  'use strict';
  angular
    .module('lucidworksView.components.banner', [])
    .directive('banner', banner);

  function banner() {
    'ngInject';
    return {
      controller: Controller,
      templateUrl: 'assets/components/banner/banner.html',
      controllerAs: 'bd',
      bindToController: true,
      scope: true
    };

  }

  function Controller($scope, Orwell) {
    'ngInject';
    var bd = this;
    bd.banners = false;

    var resultsObservable = Orwell.getObservable('queryResults');

    resultsObservable.addObserver(function (data) {
      var rules = _.get(data, 'fusion.applicable_rules');
      if (!rules) {
        return false;
      }

      var banners = _.chain(rules)
        .filter({display_type: ["Banner"]})
        .flatMap(function (rule) { return rule.values })
        .value();

      if (banners.length > 0) {
        bd.banners = banners;
      } else {
        bd.banners = false;
      }
    });
  }

})();
