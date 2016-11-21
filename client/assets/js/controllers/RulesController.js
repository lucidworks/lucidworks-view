(function () {
  'use strict';

  function initInRowDateTriggers() {
    function datePickerOnFocus() { // TODO why we need this function
      $(this).addClass('datepicker');
      $(".datepicker").datetimepicker({format: "YYYY-MM-DDTHH:mm"});
      $(this).blur();
      $(this).focus();
    }

    $('.trigger-start').one('click', datePickerOnFocus);
    $('.trigger-end').one('click', datePickerOnFocus);
  }

  function setModalMaxHeight(element) {
    var $element = $(element),
      $content = $element.find('.modal-content');
    var borderWidth = $content.outerHeight() - $content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = $element.find('.modal-header').outerHeight() || 0;
    var footerHeight = $element.find('.modal-footer').outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    $content.css({ 'overflow': 'hidden'});

    $element
      .find('.modal-body').css({
      'max-height': maxHeight,
      'overflow-y': 'auto'
    });
  }

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

  function validateRuleCreation(rule, ruleName) {
    var validFlag = true;
    if (rule.display_type == 'Choose rule type') {
      var ruleType = $('.rule-type-select');
      ruleType.addClass('has-error');
      ruleType.find('select').css('color', '#e51c23');
      ruleType.on('click', function () {
        $(this).removeClass('has-error');
        $(this).find('select').css('color', '#666');
      });
      validFlag = false;
    }

    if (ruleName[0].value == '') {
      ruleName[0].placeholder = 'Rule name is required';
      var ruleNameDiv = $('.rule-name-input');
      ruleNameDiv.addClass('has-error');
      ruleName.addClass('has-error');
      ruleNameDiv.on('click', function () {
        $(this).removeClass('has-error');
        ruleName.removeClass('has-error');
      });
      validFlag = false;
    }

    if (rule.display_type == 'Set Params') {
      var paramKey = $('.param-key.ng-empty');
      paramKey.addClass('has-error');
      paramKey.parent().addClass('has-error');
      paramKey.on('click', function () {
        $(this).removeClass('has-error');
        $(this).parent().removeClass('has-error');
      });
      if (paramKey.length != 0) {
        validFlag = false;
      }
    }

    return validFlag;
  }

  angular
    .module('lucidworksView.controllers.rules', [
        'lucidworksView.services.rules',
        'lucidworksView.services.rules.transformer',
        'lucidworksView.services.rules.filter',
        "lucidworksView.services.user",
        'lucidworksView.services.config',
        'lucidworksView.services.auth',
        'ngTagsInput'
    ])
    .controller('rulesController', ['$scope', '$http', '$timeout', 'RulesService', 'RulesTransformerService', 'RulesFilterService', "UserService", 'ConfigService', 'AuthService',
      function ($scope, $http, $timeout, rulesService, rulesTransformerService,  rulesFilterService, UserService, ConfigService, AuthService) {

        var rulesConfig = ConfigService.config.rules;

        $scope.rulesConfig = rulesConfig;
        $scope.types = rulesConfig.types;
        $scope.policyList = rulesConfig.set_params.policies;
        $scope.productList = rulesConfig.documentFields;
        $scope.predefinedTags = rulesConfig.tags;

        UserService.init();

        function pageInit() {
          moment().calendar();
          $(".datepicker").datetimepicker({defaultDate: "now", format: "YYYY-MM-DDTHH:mm"});
          autosize($("textarea"));

          $('.modal').on('show.bs.modal', function() {
            $(this).show();
            setModalMaxHeight(this);
          });

          $('.modal').on('shown.bs.modal', function() {
            autosize.update($('textarea'));
          });

          $(window).resize(function() {
            if ($('.modal.in').length != 0) {
              setModalMaxHeight($('.modal.in'));
            }
          });

          $('.disabledControl').prop('disabled', true);

          function activate() {
            var row = $(this).closest("tr");

            var active = row.hasClass("active");
            console.log("make row active: " + active);
            if (active) {
              row.find(".disabledControl").prop('disabled', true);
              row.removeClass("active");
              row.addClass("inactive");
              console.log(row.find("tags-input.ng-invalid .tags"));
              row.find("tags-input.ng-invalid").removeClass("ng-invalid");
            } else {
              row.find(".disabledControl").prop('disabled', false);
              row.removeClass("inactive");
              row.addClass("active");
            }
          }

          function setActivator(elsSelector) {
            $(elsSelector).each(function (index, el) {
              if (el && el.dataset["initialized"]) {
                return;
              }

              el.dataset["initialized"] = true;
              $(el).on("click", activate);
            });
          }

          //setActivator(".rules-list h2");
          setActivator(".fa-pencil");
          setActivator(".rules-list .btn-save");
          setActivator(".rules-list .btn-cancel");

          initInRowDateTriggers();
        }

        function findIndexById(id) {
          if ($scope.rules.length == 0) {
            return null;
          }

          for (var i = 0; i < $scope.rules.length; i++) {
            var r = $scope.rules[i];
            if (!r) {
              console.log("Error: rule for index '" + i + "' is empty rules from '" + (i - 5) + "' to '" + (i + 5) + "'");
              console.log("Error: ", $scope.rules.slice(i-5, i+5));
              return null;
            }
            if (r.id == id) {
              return i;
            }
          }
          return null;
        }

        function findRuleById(id) {
          var rule = $scope.rules[findIndexById(id)];
          if (rule) {
            return rule;
          }

          throw "Error: rule with '" + id + "' not found.";
        }

        $scope.triggerDates = [];
        $scope.categories = [];
        $scope.setParams = [' '];

        $scope.currentRule = emptyRule();

        $scope.filter = rulesFilterService;

        $scope.checkSession = function () {
          var res = AuthService.getSession();
        };

        function errorMessage(errorCode, status, message) {
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

        $scope.validateTags = function() {
          if (tags && tags.$valid === false) {
            errorMessage(null, "invalid tag name");
            return;
          } else if (tags && tags.$valid === true) {
            errorMessage(null, null);
          }
        };

        function setViewDates(rule, triggerStartArray, triggerEndArray) {
          if (triggerStartArray[0] && triggerStartArray[0].value) {
            for (var i = 0; i < triggerStartArray.length; i++) {
              rule.viewDates[0][i] = triggerStartArray[i].value.trim() || "*";
              rule.viewDates[1][i] = triggerEndArray[i].value.trim() || "*";
            }
          }
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
          var tags = $scope.addRuleTriggerForm.tags;
          if (tags && tags.$valid === false) {
            errorMessage(null, "invalid tag name");
            return;
          } else if (tags && tags.$valid === true) {
            errorMessage(null, null);
          }

          if (!validateRuleCreation(rule, ruleName)) {
            return;
          }

          //ruleName[0].placeholder = 'Enter rule name';
          //addRuleButton.attr('data-dismiss', 'modal');

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

                $timeout(pageInit, 1);
              } else {
                console.log("!!! Founded more then one rule with the same name :(");
              }
            });

          }, function (resp) {
            errorMessage(resp.status, resp.statusText, resp.data);
          });
        };

        $scope.cancelRule = function () {
          $scope.currentRule = emptyRule();
          $scope.categories = [];
          $scope.triggerDates = [];
          $scope.setParams = [' '];

          ruleFormReset();
        };

        $scope.checkUncheckAll = function (operation) {
          var masterBox = $('#selectAllBoxes');
          var checkboxes = $('.ruleCheckbox');
          if (operation == 'all') {
            masterBox[0].checked = true;
          } else if (operation == 'none') {
            masterBox[0].checked = false;
          }
          if (masterBox[0].checked) {
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].checked = true;
            }
          } else {
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].checked = false;
            }
          }
        };

        $scope.removeRule = function (id) {
          var ruleIndex = findIndexById(id);
          var rule = $scope.rules[ruleIndex];
          if (!rule) {
            console.log("delete error: rule with id '" + id + "' not found.");
            return;
          }

          if (!confirm('Are you sure want to delete rule "' + (rule.ruleName || id) + '"')) {
            return;
          }

          console.log("delete - " + id);
          $scope.rules.splice(ruleIndex, 1);
          $scope.rulesTotal -= 1;

          rulesService.delete(id);
        };

        $scope.bulkRemoveRules = function () {
          var ruleArray = $('.ruleCheckbox');
          var masterBox = $('#selectAllBoxes');
          masterBox.checked = false;
          for (var i = 0, l = ruleArray.length; i < l; i++) {
            if (ruleArray[i].checked)
              $scope.removeRule(ruleArray[i].value);
          }
        };

        $scope.bulkStatus = function (enabled) {
          var ruleArray = $('.ruleCheckbox');
          for (var i = 0, l = ruleArray.length; i < l; i++) {
            if (ruleArray[i].checked) {
              findRuleById(ruleArray[i].value).enabled = enabled;
              $scope.updateRule(ruleArray[i].value);
            }
          }
        };

        /**
         *
         * @param tag {String} string with tag value
         * @param remove {Boolean} true if we want to remove tag, otherwise add them
         */
        $scope.bulkAddTag = function (tag, remove, isNewTag) {
          var ruleArray = $('.ruleCheckbox');
          for (var i = 0, l = ruleArray.length; i < l; i++) {
            if (ruleArray[i].checked) {
              var rule = findRuleById(ruleArray[i].value);
              if (remove) {
                if (rule.viewTags) {
                  _.remove(rule.viewTags, function(tagO) {
                    return tagO && tagO.text === tag;
                  });
                }
              } else {
                if (!rule.viewTags) {
                  rule.viewTags = [];
                }

                if (!_.find(rule.viewTags, function (t) { return t.text === tag })) {
                  rule.viewTags.push({text: tag});
                }
              }

              if (isNewTag) {
                $scope.facets.tags.push([tag, 1]);
              }
              $scope.updateRule(ruleArray[i].value);
            }
          }
        };

        $scope.getCheckedBoxesCount = function () {
          var checkedCount = document.querySelectorAll('input.ruleCheckbox:checked').length;
          var bulkActions = $('#bulk-actions');
          var bulkDropdown = $('#bulk-dropdown');
          if (checkedCount == 0) {
            bulkActions.attr('disabled', 'disabled');
            bulkDropdown.css('visibility', 'hidden');
          } else {
            bulkActions.removeAttr('disabled');
            bulkDropdown.css('visibility', 'visible');
          }
          // TODO enable tags inputs
          //$('.triggerTags').tagsinput({tagClass: "label label-default"});
          $('.datepicker').datetimepicker({format: "YYYY-MM-DDTHH:mm"});

          return checkedCount;
        };

        $scope.resetFocus = function () {
          var bulkActions = $('#bulk-actions');
          bulkActions.focus();
          bulkActions.blur();
        };

        $scope.updateRule = function (id) {
          console.log("update - " + id);

          var ruleIndex = findIndexById(id);
          var rule = _.extend({}, $scope.rules[ruleIndex]);

          rule.updatedAt = new Date().toISOString();

          setViewDates(rule,
            $('tr[data-ruleId="' + rule.id + '"] .trigger-start'),
            $('tr[data-ruleId="' + rule.id + '"] .trigger-end'));

          delete rule._version_;

          rulesService.update(id, rulesTransformerService.viewRuleToModel(rule));

          $scope.rules[ruleIndex].tagsText = null;

          updateRulesInfo();
        };

        $scope.changeStatus = function (id) {
          var rule = findRuleById(id);
          rule.enabled = rule.enabled != undefined && rule.enabled === false;

          $scope.updateRule(id);
        };

        $scope.addTrigger = function (id, name) {
          var rule = findRuleById(id);

          if (name == 'search_terms') {
            rule.search_terms = rule.search_terms || ["keyword"];
          } else if (name == 'tags') {
            rule.viewTags = rule.viewTags || [];
          }
        };

        $scope.addFilter = function (id) {
          var rule = findRuleById(id);
          if (!rule.viewFilters) {
            rule.viewFilters = [[], []];
          }
          rule.viewFilters[0].push(' ');
          rule.viewFilters[1].push(' ');
        };

        function updateRulesInfo() {
          $timeout(function () {
            rulesService.search($scope.filter, function (response) {
              console.log("Update rules info...");
              $scope.rulesTotal = response.data.response.numFound;
              $scope.facets = response.data.facet_counts.facet_fields;
            });
          }, 1000);
        }

        $scope.search = function (pageNum) {
          console.log("searching (" + pageNum + ")...");
          $scope.filter.values.pageNum = (pageNum || 0);

          rulesService.search($scope.filter, function (response) {
            var docs = response.data.response.docs;
            console.log("Rules loaded: ");
            console.log(docs);

            $scope.rules = docs.map(rulesTransformerService.modelRuleToView);
            $scope.rulesTotal = response.data.response.numFound;
            $scope.facets = response.data.facet_counts.facet_fields;

            $timeout(pageInit, 1);
          });
        };

        $scope.next = function () {
          if ($scope.filter.hasNext($scope.rulesTotal)) {
            $scope.search($scope.filter.next());
          }
        };

        $scope.prev = function () {
          // TODO change logic
          if ($scope.filter.hasPrev()) {
            $scope.search($scope.filter.prev());
          }
        };

        $scope.sortBy = function (by) {
          console.log("$scope.sortBy(" + by + ")");
          rulesFilterService.sortBy(by);

          console.log('sortBy', rulesFilterService.values);
          $scope.search();
        };

        $scope.filterBy = function (key, value) {
          $scope.filter.filterBy(key, value);
          $scope.search();
        };

        $scope.search();

        $scope.addDates = function (ruleId) {
          var rule = findRuleById(ruleId);

          if (!rule.viewDates) {
            rule.viewDates = [[], []];
          }
          rule.viewDates[0].push(' ');
          rule.viewDates[1].push(' ');

          $timeout(initInRowDateTriggers, 100);
        };

        $scope.resetFilter = function () {
          $scope.filter.reset();
          $('.filter-form').each(function (index, form) {
            form.reset()
          });

          $scope.search();
        };

        $scope.applyFilter = function () {
          $scope.filter.values.startDate = $('#filterStart')[0].value;
          $scope.filter.values.endDate = $('#filterEnd')[0].value;

          $scope.search();
        };
      }]);

})();
