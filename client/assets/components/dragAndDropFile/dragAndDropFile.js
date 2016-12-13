(function () {
  'use strict';

  angular
    .module('lucidworksView.components.dragAndDropFile', [])
    .directive('dragAndDropFile', dragAndDropFile);

    function dragAndDropFile () {
      'ngInject';
      return {
        restrict: 'EA',
        scope: {ngModel: '=', rightFileType: '='},
        link: function (scope, element, attrs) {
          var processDragOverOrEnter;

          processDragOverOrEnter = function (event) {
            if (event !== null) {
              event.preventDefault();
            }
            event.dataTransfer.effectAllowed = 'copy';
            return false;
          };
          element.bind('dragover', processDragOverOrEnter);
          element.bind('dragenter', processDragOverOrEnter);
          element.bind('drop', handleDropEvent);

          function insertText(loadedFile) {
            console.log("insertText");
            console.log(scope.ngModel);
            var content = loadedFile.target.result.split(/,|\n/);
            console.log(content);
            var modelContent = scope.ngModel || [];
            var areaContent = modelContent.concat(content);
            console.log(areaContent);
            scope.ngModel = areaContent;
            scope.$apply();
          }

          function handleDropEvent(event) {

            if (event !== null) {
              event.preventDefault();
            }
            var reader = new FileReader();
            reader.onload = insertText;
            reader.readAsText(event.dataTransfer.files[0]);
          }
        }
      };
    }
})();
