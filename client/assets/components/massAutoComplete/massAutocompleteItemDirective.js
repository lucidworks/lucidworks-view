(function () {
  'use strict';

  angular
    .module('lucidworksView.components.massAutocomplete')
    .directive('massAutocompleteItem', massAutocompleteItem);

  function massAutocompleteItem() {
    return {
      restrict: 'A',
      require: ['^massAutocomplete', 'ngModel'],
      scope: {
        'massAutocompleteItem': '&'
      },
      link: function(scope, element, attrs, required) {
        // Prevent html5/browser auto completion.
        attrs.$set('autocomplete', 'off');

        element.bind('focus', function() {
          var options = scope.massAutocompleteItem();
          if (!options)
            throw 'Invalid options';
          required[0].attach(required[1], element, options);
        });
      }
    };
  }
})();