(function () {
  'use strict';

  function emptyRule() {
    return {
      createdAt: Date.now(),

      display_type: 'Choose rule type',
      ruleName: '',
      description: '',

      search_terms: undefined,
      matching: undefined,

      viewFilters: [[], []],
      viewDates: [[], []],
      viewTags: '',

      values: '',

      // Set Params Type params
      param_keys: [],
      param_values: [],
      param_policies: [],

      // response_value rule type
      field_name: undefined,
      field_values: undefined,

      keywordsFlag: false,
      categoryFlag: false,
      tagsFlag: false
    };
  }

  angular
    .module('lucidworksView.controllers.addRules', [
      'lucidworksView.services.rules',
      'lucidworksView.services.rules.transformer',
      'ngTagsInput'
    ])
    .controller('addRulesController', ['$scope', '$http', '$timeout', 'RulesService', 'RulesTransformerService',
      function ($scope, $http, $timeout, rulesService, rulesTransformerService) {

        $scope.addRuleInvalid = {'general': false, 'trigger': false, 'params': false};
        $scope.invalidDeteRange = [];
        $scope.emptyDete = [];
        $scope.triggerDates = [];
        $scope.categories = [];
        $scope.setParams = [' '];

        $scope.currentRule = emptyRule();

        function errorMessage (errorCode, status, message) {
          var addRule = $('#addRule');
          if (status == null && status == null) {
            addRule.find('.alert').removeClass('alert-warning');
            addRule.find('.alert').hide();
          }

          addRule.find('.alert').addClass('alert-warning');
          addRule.find('.err-code').html(errorCode);
          if (message) {
            addRule.find('.err-more').show();
            $('#addRuleErrorDetails').html(message);
          } else {
            addRule.find('.err-more').hide();
          }
          addRule.find('.err-message').html(status);
        }

        $scope.addRule = function () {
          var rule = {
            display_type: $scope.currentRule.display_type,
            ruleName: $scope.currentRule.ruleName,
            description: $scope.currentRule.description,
            search_terms: $scope.currentRule.search_terms,
            matching: $scope.currentRule.matching,

            viewTags: $scope.currentRule.viewTags,
            viewDates: $scope.currentRule.viewDates,
            viewFilters: $scope.currentRule.viewFilters,

            values: $scope.currentRule.values,

            param_keys: $scope.currentRule.param_keys,
            param_values: $scope.currentRule.param_values,
            param_policies: $scope.currentRule.param_policies,

            field_name: $scope.currentRule.field_name,
            field_values: $scope.currentRule.field_values,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            enabled: [true]
          };


          var ruleName = $('#addRuleName');
          var addRuleButton = $('#addRuleButton');

          addRuleButton.removeAttr('data-dismiss');

          if (!$scope.validateRuleCreation(rule)) {
            return;
          }

          console.log($scope.currentRule.field_values)

          setViewDates(rule, $('.add-trigger-start'), $('.add-trigger-end'));

          rulesService.add(rulesTransformerService.viewRuleToModel(rule), function () {
            addRuleButton.attr('data-dismiss', 'modal');
            $('#addRule').modal('hide');

            $('.addRuleForm').each(function (index, form) {
              form.reset()
            });

            $scope.currentRule = emptyRule();
            $scope.categories = [];
            $scope.triggerDates = [];
            $scope.setParams = [' '];
            $scope.invalidFormMarkersClear ();

            rulesService.findByName(rule.ruleName, function (response) {
              var data = response.data.response;

              if (data.numFound < 1) {
                console.log("!!! Error saving rule");
              } else if (data.numFound == 1) {
                rule.id = data.docs[0].id;

                $scope.rules = [rule].concat($scope.rules);
                $scope.rulesTotal++;

                if ($scope.rules[$scope.rules.length - 1] == undefined) {
                  $scope.rules.pop();
                }

                $timeout($scope.activate(rule.id), 1);
              } else {
                console.log("!!! Founded more then one rule with the same name :(");
              }
            });

          }, function (resp) {
            errorMessage(resp.status, resp.statusText, resp.data);
          });
        };

        $scope.activate = function (id) {
          if ($scope.disabledRuleEdit[id] == true) {
            $scope.disabledRuleEdit[id] = false;
          } else {
            $scope.disabledRuleEdit[id] = true;
          }
        };

        function setViewDates(rule, triggerStartArray, triggerEndArray) {
          if (triggerStartArray[0] && triggerStartArray[0].value) {
            for (var i = 0; i < triggerStartArray.length; i++) {
              rule.viewDates[0][i] = triggerStartArray[i].value.trim() || "*";
              rule.viewDates[1][i] = triggerEndArray[i].value.trim() || "*";

              // duplicates rc used in both controllers
            }
          }
        }

        $scope.invalidRangeClear = function (index) {
          $scope.invalidDeteRange[index] = false;
        };

        $scope.invalidFormMarkersClear = function () {
          $scope.addRuleInvalid.general = false;
          $scope.addRuleInvalid.trigger = false;
          $scope.addRuleInvalid.params = false;
          $scope.invalidRangeClear
        };

        $scope.validateRuleCreation = function (rule) {
          $scope.invalidFormMarkersClear ();
          if ($scope.currentRule.display_type == 'Choose rule type') {
            $scope.generalForm.chooseRuleType.$setValidity("required", false);
          }

          if (rule.viewDates[0].length) {
            for (var i = 0, l = rule.viewDates[0].length; i < l; i++) {
              var start = new Date(rule.viewDates[0][i]).getTime();
              var end = new Date(rule.viewDates[1][i]).getTime();
              $scope.invalidDeteRange[i] = false;
              console.log(start);
              console.log(end);
              if (start >= end && end) {
                $scope.addRuleInvalid.trigger = true;
                $scope.invalidDeteRange[i] = true;
              }
              if (!start && !end) {
                $scope.addRuleInvalid.trigger = true;
                $scope.emptyDete[i] = true;
              }
            }
          }
          var tags = $scope.addRuleTriggerForm.tags;
          if(!$scope.generalForm.$valid) {
            $scope.addRuleInvalid.general = true;
          }
          if(!$scope.addRuleTriggerForm.$valid || $scope.addRuleInvalid.trigger) {
            $scope.addRuleInvalid.trigger = true;
          }
          if(!$scope.paramsForm.$valid) {
            $scope.addRuleInvalid.params = true;
          }
          return (!$scope.addRuleInvalid.general && !$scope.addRuleInvalid.trigger && !$scope.addRuleInvalid.params);
        };

        $scope.cancelRule = function () {
          $scope.currentRule = emptyRule();
          $scope.categories = [];
          $scope.triggerDates = [];
          $scope.setParams = [' '];
          $scope.invalidFormMarkersClear ();
          ruleFormReset();
        };


        $scope.setScrollToBottom = function(sectionNum, $scope, $element) {
          setTimeout(function () {
            var section = angular.element($('div.add-rule-section'))[sectionNum];
            var isScrolledToBottom = section.scrollHeight - section.clientHeight <= section.scrollTop;
            if (!isScrolledToBottom) {
              section.scrollTop = section.scrollHeight - section.clientHeight + 160;
              console.log(section.scrollTop);
            }
          }, 0);
        };
      }]);

})();
