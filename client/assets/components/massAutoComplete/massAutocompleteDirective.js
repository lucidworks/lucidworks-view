(function () {
  'use strict';

  angular
    .module('lucidworksView.components.massAutocomplete')
    .directive('massAutocomplete', massAutocomplete);

  function massAutocomplete() {
    'ngInject';

    return {
      restrict: 'A',
      scope: {
        options: '&massAutocomplete'
      },
      transclude: true,
      templateUrl:'assets/components/massAutocomplete/massAutocomplete.html',
      link: Link,
      controllerAs: 'autoComplete',
      controller: Controller
    }
  };
    
  function Link (scope, element) {
    scope.container = angular.element(element[0].getElementsByClassName('ac-container')[0]);
  }

  function Controller ($document, $q, $scope, $timeout, $window) {
    'ngInject';
    var self = this;

    var KEYS = {
      TAB: 9,
      ESC: 27,
      ENTER: 13,
      UP: 38,
      DOWN: 40
    };

    var EVENTS = {
      KEYDOWN: 'keydown',
      RESIZE: 'resize',
      BLUR: 'blur'
    };

    var boundEvents = {};
    boundEvents[EVENTS.BLUR] = null;
    boundEvents[EVENTS.KEYDOWN] = null;
    boundEvents[EVENTS.RESIZE] = null;

    var _userOptions = $scope.options() || {};
    var userOptions = {
      debouncePosition: _userOptions.debouncePosition || 150,
      debounceAttach: _userOptions.debounceAttach || 300,
      debounceSuggest: _userOptions.debounceSuggest || 200,
      debounceBlur: _userOptions.debounceBlur || 150
    };

    var currentElement,
      currentModel,
      currentOptions,
      previousValue,
      valueWatch,
      lastSelectedValue,
      scrollTop;

    $scope.showAutocomplete = false;

    // Attach autocomplete behaviour to an input element.
    function _attach(ngmodel, targetElement, options) {
      // Element is already attached.
      if (currentElement === targetElement) return;
      // Safe: clear previously attached elements.
      if (currentElement) self.detach();

      // TODO: Figure out an ideal (and unit test friendly) way for handling the case when
      // the target element is not the active/focused element.
      // if (targetElement[0] !== $document[0].activeElement) return;

      options.onAttach && options.onAttach();

      currentElement = targetElement;
      currentModel = ngmodel;
      currentOptions = options;
      previousValue = ngmodel.$viewValue;

      $scope.results = [];
      $scope.selectedIndex = -1;
      bindElement();

      valueWatch = $scope.$watch(
        function() {
          return ngmodel.$modelValue;
        },
        function(nv, ov) {
          // Prevent suggestion cycle when the value is the last value selected.
          // When selecting from the menu the ng-model is updated and this watch
          // is triggered. This causes another suggestion cycle self will provide as
          // suggestion the value self is currently selected - this is unnecessary.
          if (angular.isDefined(lastSelectedValue))
            if (nv === lastSelectedValue.name)
              return;
          if (angular.isUndefined(nv))
            return;
          // resets selected menu item
          suggest(nv, currentElement);
        }
      );
    }
    self.attach = _.debounce(_attach, userOptions.debounceAttach);

    function _suggest(term, targetElement) {
      $scope.waitingForSuggestion = true;
      $scope.showAutocomplete = true;
      $scope.selectedIndex = -1;
      $scope.noResults = false;

      if (angular.isString(term) && term.length > 1) {
        $q.when(currentOptions.suggest(term),
          function suggestSucceeded(suggestions) {
            // Make sure the suggestion we are processing is of the current element.
            // When using remote sources for example, a suggestion cycnle might be
            // triggered at a later time (When a different field is in focus).
            if (!currentElement || currentElement !== targetElement)
              return;

            if (suggestions && suggestions.length > 0) {
              // Add the original term as the first value to enable the user
              // to return to his original expression after suggestions were made.
              $scope.results = [{
                value: term,
                label: ''
              }].concat(suggestions);
              $scope.showAutocomplete = true;
            } else {
              $scope.noResults = true;
              $scope.results = [];
            }
          },
          function suggestFailed(error) {
            $scope.showAutocomplete = false;
            currentOptions.on_error && currentOptions.on_error(error);
          }
        ).finally(function suggestFinally() {
          $scope.waitingForSuggestion = false;
          $scope.results.shift();
        });
      } else {
        $scope.waitingForSuggestion = false;
        $scope.showAutocomplete = false;
        $scope.$apply();
      }
    }
    var suggest = _.debounce(_suggest, userOptions.debounceSuggest);

    // Trigger end of editing and remove all attachments made by
    // this directive to the input element.
    self.detach = function() {
      if (currentElement) {
        var value = currentElement.val();
        updateModelValue(value);
        currentOptions.on_detach && currentOptions.on_detach(value);
        currentElement.unbind(EVENTS.KEYDOWN, boundEvents[EVENTS.KEYDOWN]);
        currentElement.unbind(EVENTS.BLUR, boundEvents[EVENTS.BLUR]);
      }

      // Clear references and events.
      $scope.showAutocomplete = false;
      angular.element($window).unbind(EVENTS.RESIZE, boundEvents[EVENTS.RESIZE]);
      valueWatch && valueWatch();
      $scope.selectedIndex = $scope.results = undefined;
      currentModel = currentElement = previousValue = undefined;
    };

    // Update angular's model view value.
    // It is important self before triggering hooks the model's view
    // value will be synced with the visible value to the user. This will
    // allow the consumer controller to rely on its local ng-model.
    function updateModelValue(value) {
      if (currentModel.$modelValue !== value) {
        currentModel.$setViewValue(value);
        currentModel.$render();
      }
    }

    // Set the current selection while navigating through the menu.
    function setSelection(i) {
      // We use value instead of setting the model's view value
      // because we watch the model value and setting it will trigger
      // a new suggestion cycle.

      let scrollContainer = $scope.container[0];
      let menu = scrollContainer.querySelector('.ac-menu');
      let containerHeight = scrollContainer.offsetHeight;
      let itemHeight = menu.children[0].offsetHeight;
      let newOffset = itemHeight * (i + 1);

      if ((newOffset - menu.scrollTop) > containerHeight) {
        // When the item is below the area in view
        menu.scrollTop = newOffset - containerHeight;
      } else if (menu.scrollTop > itemHeight * i) {
        // When the item is above the area in view
        menu.scrollTop = itemHeight * i;
      }

      var selected = $scope.results[i];
      currentElement.val(selected.value.name);
      $scope.selectedIndex = i;
      return selected;
    }

    // Apply and accept the current selection made from the menu.
    // When selecting from the menu directly (using click or touch) the
    // selection is directly applied.
    $scope.applySelection = function(i) {
      currentElement[0].focus();
      if (!$scope.showAutocomplete || i > $scope.results.length || i < 0)
        return;

      var selected = setSelection(i);
      // changed for customization, revisit
      lastSelectedValue = selected.value;
      updateModelValue(selected.value.name);
      $scope.showAutocomplete = false;

      currentOptions.on_select && currentOptions.on_select(selected);
    };

    function bindElement() {
      boundEvents[EVENTS.BLUR] = function() {
        // Detach the element from the auto complete when input loses focus.
        // Focus is lost when a selection is made from the auto complete menu
        // using the mouse (or touch). In self case we don't want to detach so
        // we wait several ms for the input to regain focus.
        $timeout(function() {
          if (!currentElement || currentElement[0] !== $document[0].activeElement)
            self.detach();
        }, userOptions.debounceBlur);
      };
      currentElement.bind(EVENTS.BLUR, boundEvents[EVENTS.BLUR]);

      boundEvents[EVENTS.KEYDOWN] = function(e) {
        // Reserve key combinations with shift for different purposes.
        if (e.shiftKey) return;

        switch (e.keyCode) {
          // Close the menu if it's open. Or, undo changes made to the value
          // if the menu is closed.
          case KEYS.ESC:
            if ($scope.showAutocomplete) {
              $scope.showAutocomplete = false;
              $scope.$apply();
            } else {
              currentElement.val(previousValue);
            }
            break;

            // Select an element and close the menu. Or, if a selection is
            // unavailable let the event propagate.
          case KEYS.ENTER:
            // Accept a selection only if results exist, the menu is
            // displayed and the results are valid (no current request
            // for new suggestions is active).
            if ($scope.showAutocomplete &&
              $scope.selectedIndex > -1 &&
              !$scope.waitingForSuggestion) {
              $scope.applySelection($scope.selectedIndex);
              // When selecting an item from the AC list the focus is set on
              // the input element. So the enter will cause a keypress event
              // on the input itself. Since this enter is not intended for the
              // input but for the AC result we prevent propagation to parent
              // elements because this event is not of their concern. We cannot
              // prevent events from firing when the event was registered on
              // the input itself.
              e.stopPropagation();
              e.preventDefault();
              $scope.showAutocomplete = false;
            }
            $scope.$apply();
            break;

            // Navigate the menu when it's open. When it's not open fall back
            // to default behavior.
          case KEYS.TAB:
            if (!$scope.showAutocomplete)
              break;

            e.preventDefault();
            /* falls through */

            // Open the menu when results exists but are not displayed. Or,
            // select the next element when the menu is open. When reaching
            // bottom wrap to top.
          case KEYS.DOWN:
            if ($scope.results.length > 0) {
              if ($scope.showAutocomplete) {
                setSelection($scope.selectedIndex + 1 > $scope.results.length - 1 ? 0 : $scope.selectedIndex + 1);
              } else {
                $scope.showAutocomplete = true;
                $scope.selectedIndex = 0;
              }
              $scope.$apply();
            }
            break;

            // Navigate up in the menu. When reaching the top wrap to bottom.
          case KEYS.UP:
            if ($scope.showAutocomplete) {
              e.preventDefault();
              setSelection($scope.selectedIndex - 1 >= 0 ? $scope.selectedIndex - 1 : $scope.results.length - 1);
              $scope.$apply();
            }
            break;
        }
      };
      currentElement.bind(EVENTS.KEYDOWN, boundEvents[EVENTS.KEYDOWN]);
    }

    $scope.$on('$destroy', function() {
      self.detach();
      $scope.container.remove();
    });
  }
 
})();

