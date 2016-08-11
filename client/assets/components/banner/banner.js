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
      var banners = _.get(data, 'fusion.banner');
      if (!banners) {
        var rules = _.get(data, 'fusion.applicable_rules');
        if (!rules) {
          bd.banners = false;
          return false;
        }

        var excludedRules = _.get(data, 'fusion.excluded_rules') || [];

        banners = _.chain(rules)
          .filter(function (r) {
            var type = r.display_type;
            if ((type == "Banner" || _.isArray(type) && type.indexOf("Banner") != -1)
                  && excludedRules.indexOf(r.id) == -1) {
              return true;
            }

            if ((r.type == "response_value" && r.keys.indexOf("banner") != -1)
                  && excludedRules.indexOf(r.id) == -1) {
              return true;
            }

            return false;
          })
          .flatMap(function (rule) {
            return rule.values
          })
          .value();
      }

      if (banners.length > 0) {
        bd.banners = banners;
      } else {
        bd.banners = false;
      }
    });
  }

})();
