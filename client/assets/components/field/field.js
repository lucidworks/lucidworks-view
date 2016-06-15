(function () {
  angular.module('lucidworksView.components.field', ['lucidworksView.services.config',
      'lucidworksView.utils.docs'
    ])
    .directive('field', fieldItem);


  function fieldItem() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/field/field.html',
      scope: true,
      controller: Controller,
      controllerAs: 'fc',
      bindToController: {
        formattingHandler: '=',
        value: '=',
        highlight: '=',
        hkey: '@', //The Highlight key, used to look up the proper highlighting snippet by name.
        maxlength: '='
      },
      replace: true
    };
  }

  function Controller($sanitize) {
    'ngInject';
    var fc = this;
    fc.limit = false;
    fc.limitValue = fc.maxlength;//keep track of the limitValue, as the user can toggle this w/ the Read More/Less toggle, but not the max length value
    fc.showMore = false;
    fc.totalLength = -1;
    fc.toggleRead = toggleRead;
    activate();

    ///////////

    function activate() {
      fc.value = processField(fc.value, fc.hkey, fc.highlight, fc.maxlength);
    }

    function toggleRead(){
      if (fc.limit) {//this only applies when we have more than the limitValue chars
        if (!fc.showMore) {
          //toggle to true, meaning user wants to see more
          fc.showMore = true;
          fc.limitValue = fc.totalLength;
        } else {
          fc.showMore = false;
          fc.limitValue = fc.maxlength;
        }
      }
    }

    function processField(field, highlightKey, highlight, maxlength) {
      var result = $sanitize(_.escape(field));
      var hasHighlight = false;

      if (highlight && Object.keys(highlight).length > 0) {
        if (highlight[highlightKey]) {
          result = highlight[highlightKey];
        }
      }
      // Only shorten if not highlighting, since highlighing in solr can control
      // snippet size there and b/c we have a Trusted object and not a plain
      // old string.

      // If field is multivalued, join the items before trimming
      result = _.isArray(result)?_.join(result, ' '):result;

      if (hasHighlight === false && result && result.length > maxlength) {
        // Mark this as being trimmed, but don't actually physically trim it
        fc.limit = true;
      }
      fc.totalLength = result.length;
      if (fc.formattingHandler){
        result = fc.formattingHandler(result);
      }
      return result;
    }
  }
})();
