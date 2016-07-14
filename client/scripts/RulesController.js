(function () {
  'use strict';

  var Filter = (function () {

    var facets = {
      display_type: {name: "Rules type"},
      tags: {name: "Tags"},
      enabled: {name: "Enabled"}
    };

    return {

      values: {
        query: "",
        pageSize: 10,
        pageNum: 0,

        startDate: null,
        endDate: null,
        status: null,

        facets: {}
      },

      rulesFrom: function () {
        return this.values.pageNum * this.values.pageSize;
      },

      rulesTo: function () {
        return (this.values.pageNum + 1) * this.values.pageSize
      },

      filterBy: function (field, value) {
        this.values.facets[field] = {};
        this.values.facets[field][value] = true;

        /*var filter = this.values.facets.find(
         function (f) { return f[0] === field;});

         if (!filter) {
         this.values.facets.push([field, value]);
         }*/

        /*var facet = this.values.facets[field];
         if (!facet) {
         throw "Wrong facet name '" + facet + "'";
         }

         for (var i = 0; i < facet.length; i++) {
         if(facet[i][0] === value) {
         facet[2] = true;
         return;
         }
         }

         console.log("Facet value '" + field + " - " + value + "' not found in ", facet);*/
      },

      hasNext: function (rulesTotal) {
        return (this.values.pageNum + 1) * this.values.pageSize < (rulesTotal || 0)
      },

      next: function () {
        this.values.pageNum += 1;
        return this.values.pageNum;
      },

      hasPrev: function () {
        return this.values.pageNum > 0;
      },

      prev: function () {
        this.values.pageNum -= 1;
        return this.values.pageNum;
      },

      toUrlString: function () {
        var res = "";
        res += "&q=" + (this.values.query || '*');
        res += "&facet=true";

        for (var f in facets) {
          res += "&facet.field=" + f;
        }

        res += "&start=" + this.values.pageNum * this.values.pageSize;
        res += "&rows=" + this.values.pageSize;

        var filterQuery = [];
        for (var key in this.values.facets) {
          var facet = this.values.facets[key];
          for (var name in facet) {
            if (facet[name]) {
              filterQuery.push(key + ":" + name);
            }
          }
        }

        if (filterQuery.length > 0) {
          res += "&fq=" + filterQuery.join(" ");
        }

        /*      if (this.values.facets.length > 0) {
         res += "&fq=" + this.values.facets.map(
         function (f) {return f[0] + ":" + f[1].trim()}).join(" ");
         }*/

        return res;
      }
    }
  })();

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

  function pageInit() {
    moment().calendar();
    $(".datepicker").datetimepicker({defaultDate: "now", format: "YYYY-MM-DDTHH:mm"});
    autosize($("textarea"));

    $('.triggerTags').tagsinput({tagClass: "label label-default"});
    $('.disabledControl').prop('disabled', true);

    function activate() {
      var row = $(this).closest("tr");

      var active = row.hasClass("active");
      console.log("make row active: " + active);
      if (active) {
        row.find(".disabledControl").prop('disabled', true);
        row.removeClass("active");
        row.addClass("inactive");
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

  function emptyRule() {
    return {
      currentDate: Date.now(),
      ruleType: '',
      displayRuleType: 'Choose rule type',
      ruleName: '',
      ruleDescription: '',
      ruleStart: '',
      ruleEnd: '',
      ruleKeywords: [],
      ruleCategoryType: [],
      ruleCategoryValue: [],
      ruleTags: '',
      ruleFieldName: '',
      ruleFieldValues: [],
      ruleValues: [],
      ruleSetParams: {
        param_keys: [],
        param_values: [],
        param_policies: []
      },

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
    .module('lucidworksView.services.controller', ["lucidworksView.services.rules", 'lucidworksView.services.config'])
    .controller('rulesController', ['$scope', '$http', '$timeout', 'RulesService', 'ConfigService',
      function ($scope, $http, $timeout, rulesService, ConfigService) {

        var rulesConfig = ConfigService.config.rules;
        $scope.types = rulesConfig.types;
        $scope.policyList = rulesConfig.set_params.policies;
        $scope.productList = rulesConfig.documentFields;

        var keys = {
          "Redirect": "redirect",
          "Banner": "banner"
        };

        function findIndexById(id) {
          for (var i = 0; i < $scope.rules.length; i++) {
            var r = $scope.rules[i];
            if (r.id == id) {
              return i;
            }
          }
          return null;
        }

        $scope.triggerDates = [];
        $scope.categories = [];
        $scope.ruleArrays = [];
        $scope.setParams = [' '];

        $scope.currentRule = emptyRule();

        $scope.filter = Filter;

        $scope.addRule = function () {
          var rule = {
            display_type: $scope.currentRule.displayRuleType,
            id: $scope.currentRule.ruleName,
            createdAt: [Date.now()],
            updatedAt: [Date.now()],
            enabled: [true]
          };

          var ruleName = $('#addRuleName');
          var addRuleButton = $('#addRuleButton');

          addRuleButton.removeAttr('data-dismiss');
          if (!validateRuleCreation(rule, ruleName)) {
            return;
          }

          //ruleName[0].placeholder = 'Enter rule name';
          //addRuleButton.attr('data-dismiss', 'modal');

          rule.description = $scope.currentRule.ruleDescription;
          rule.search_terms = $scope.currentRule.ruleKeywords;
          rule.tags = $scope.currentRule.ruleTags || [];
          rule.type = $scope.types[rule.display_type];

          if (rule.type == 'set_params') {
            rule.param_keys = $scope.currentRule.ruleSetParams.param_keys;
            rule.param_values = $scope.currentRule.ruleSetParams.param_values;
            rule.param_policies = $scope.currentRule.ruleSetParams.param_policies;
          } else if (rule.type != 'response_value') {
            rule.field_name = $scope.currentRule.ruleFieldName;
            rule.field_values = $scope.currentRule.ruleFieldValues;
          } else {
            rule.keys = [];
            rule.keys.push(keys[rule.display_type]);
            rule.values = [$scope.currentRule.ruleValues];
          }

          var triggerStartArray = $('.add-trigger-start');
          var triggerEndArray = $('.add-trigger-end');

          if (!$scope.ruleArrays[rule.id]) {
            $scope.ruleArrays[rule.id] = {dates: [[], []], filters: [[], []]};
          }

          if (triggerStartArray[0] && triggerStartArray[0].value) {
            rule.effective_range = [];
            for (var i = 0, l = triggerStartArray.length; i < l; i++) {
              rule.effective_range.push("[" + triggerStartArray[i].value + " TO " + triggerEndArray[i].value + "]");
              $scope.ruleArrays[rule.id].dates[0].push(triggerStartArray[i].value);
              $scope.ruleArrays[rule.id].dates[1].push(triggerEndArray[i].value);
            }
          }

          var triggerTags = $('#addTriggerTags')[0];
          if (triggerTags && triggerTags.value) {
            rule.tags = triggerTags.value.split(',');
          }

          if ($scope.currentRule.ruleCategoryType[0]) {
            rule.filters = "";
            //for (var i = 0, l = $scope.currentRule.ruleCategoryType.length; i<l; i++) {
            $scope.currentRule.ruleCategoryType.forEach(function (item, i) {
              rule.filters += item + ':' + $scope.currentRule.ruleCategoryValue[i] + ' ';
              $scope.ruleArrays[rule.id].filters[0].push(item);
              $scope.ruleArrays[rule.id].filters[1].push($scope.currentRule.ruleCategoryValue[i]);
            });
            rule.filters = rule.filters.trim();
          }

          rulesService.add(rule, function () {
            addRuleButton.attr('data-dismiss', 'modal');
            $('#addRule').modal('hide');

            $('.addRuleForm').each(function (index, form) {
              form.reset()
            });

            $scope.currentRule = emptyRule();
            $scope.categories = [];
            $scope.triggerDates = [];
            $scope.setParams = [' '];

            $scope.rules = [rule].concat($scope.rules);
            $scope.rulesTotal++;

            if ($scope.rules[$scope.rules.length - 1] == undefined) {
              $scope.rules.pop();
            }

            $timeout(pageInit, 1);
          }, function (resp) {
            var addRule = $('#addRule');
            addRule.find('.alert').addClass('alert-warning');
            addRule.find('.err-code').html(resp.status);
            addRule.find('.err-message').html(resp.statusText);
            $('#addRuleErrorDetails').html(resp.data);
          });
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
          if (!confirm('Are you sure want to delete rule "' + id + '"')) {
            return;
          }

          console.log("delete - " + id);
          $scope.rules.splice(findIndexById(id), 1);
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
              var rule = $scope.rules[findIndexById(ruleArray[i].value)];
              rule.enabled = enabled;
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
              var rule = $scope.rules[findIndexById(ruleArray[i].value)];
              if (remove) {
                if (rule.tags) {
                  var index = rule.tags.indexOf(tag);
                  if (index > -1) {
                    rule.tags.splice(index, 1);
                  } else {
                    console.log("error:index for tag '" + tag + "' not found");
                  }
                }
              } else {
                if (!rule.tags) {
                  rule.tags = [];
                }
                rule.tags.push(tag);
              }

              var tagsInput = $('tr[data-ruleId="' + rule.id + '"] .triggerTags');
              var tempTags = rule.tags;
              tagsInput.tagsinput('removeAll');
              if (tempTags && tempTags.length > 0) {
                tagsInput.tagsinput('add', tempTags.join(","));
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
          $('.triggerTags').tagsinput({tagClass: "label label-default"});
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

          var rule = $scope.rules[findIndexById(id)];
          var ruleArray = $scope.ruleArrays[rule.id];

          rule.updatedAt = Date.now();

          if (rule.values) {
            rule.values = [rule.values];
          }

          var triggerStartArray = $('tr[data-ruleId="' + rule.id + '"] .trigger-start');
          var triggerEndArray = $('tr[data-ruleId="' + rule.id + '"] .trigger-end');

          if (!rule.effective_range) {
            rule.effective_range = [];
          }

          for (var i = 0, l = triggerStartArray.length; i < l; i++) {
            rule.effective_range[i] = "[" + triggerStartArray[i].value + " TO " + triggerEndArray[i].value + "]";
            ruleArray.dates[0][i] = triggerStartArray[i].value;
            ruleArray.dates[1][i] = triggerEndArray[i].value;

            console.log(ruleArray.dates[0][i], " - ", ruleArray.dates[1][i]);
          }

          if (rule.search_terms) {
            if (rule.search_terms[0] == '' || rule.search_terms == "") {
              delete rule.search_terms;
            }
          }

          var ruleTriggerTags = $('tr[data-ruleId="' + rule.id + '"] .triggerTags');
          if (ruleTriggerTags.length != 0) {
            rule.tags = ruleTriggerTags[0].value.split(',');
          }
          if (rule.tags && rule.tags[0] == "" || rule.tags == "") {
            delete rule.tags;
          }
          rule.filters = "";
          if (ruleArray && ruleArray.filters && ruleArray.filters[0]) {
            for (var i = 0, l = ruleArray.filters[0].length; i < l; i++) {
              //ruleArray.filters.forEach(function(item, i){
              rule.filters += ruleArray.filters[0][i] + ':' + ruleArray.filters[1][i] + ' ';
            }
            rule.filters = rule.filters.trim();
          }

          if (rule.filters == ":") {
            delete rule.filters;
          }

          delete rule._version_;

          rulesService.update(id, rule);
          updateRulesInfo();
        };

        $scope.changeStatus = function (id) {
          var rule = $scope.rules[findIndexById(id)];
          if (rule.enabled == undefined || rule.enabled === true) {
            rule.enabled = false;
          } else {
            rule.enabled = true;
          }
          $scope.updateRule(id);
        };

        $scope.addTrigger = function (id, name) {
          var rule = $scope.rules[findIndexById(id)];

          if (name == 'search_terms') {
            rule.search_terms = rule.search_terms || ["keyword"];
          } else if (name == 'tags') {
            rule.tags = rule.tags || [""];
          } else if (name == 'category') {
            rule.filters = rule.filters || [["field"], ["value"]];
          }
        };

        $scope.addFilter = function (id) {
          var rule = $scope.ruleArrays[id];
          if (!rule.filters) {
            rule.filters = [[], []];
          }
          rule.filters[0].push(' ');
          rule.filters[1].push(' ');
        };

        $scope.checkActionCount = function (id) {
          var actionCount = 0;
          var rule = $scope.rules[findIndexById(id)];
          return actionCount;
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
            $scope.rules = response.data.response.docs;
            console.log("Rules loaded: ");
            console.log($scope.rules);

            $scope.rules.forEach(function (item, i) {
              var rulesSub = {};

              if (item && item.filters) {
                if (item.filters.length) {
                  item.filters = item.filters[0];
                }
                var filtersArray = item.filters.split(/[ ,:]+/);
                var actualFiltersArray = [[], []];
                for (var j = 0, k = filtersArray.length; j < k; j++) {
                  actualFiltersArray[j % 2].push(filtersArray[j]);
                }
                rulesSub.filters = actualFiltersArray;
              }
              var range = $scope.rules[i].effective_range;
              if (range) {
                rulesSub.dates = [[], []];
                for (var j = 0, k = range.length; j < k; j++) {
                  var split = range[j].split(' TO ');
                  rulesSub.dates[0][j] = split[0];
                  rulesSub.dates[0][j] = rulesSub.dates[0][j].replace("[", "");
                  rulesSub.dates[1][j] = split[1];
                  rulesSub.dates[1][j] = rulesSub.dates[1][j].replace("]", "");
                }
              }

              $scope.ruleArrays[item.id] = rulesSub;
            });
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

        $scope.filterBy = function (key, value) {
          $scope.filter.filterBy(key, value);
          $scope.search();
        };

        $scope.search();

        $scope.addDates = function (ruleId) {
          var rule = $scope.ruleArrays[ruleId];

          if (!rule.dates) {
            rule.dates = [[], []];
          }
          rule.dates[0].push(' ');
          rule.dates[1].push(' ');

          $timeout(initInRowDateTriggers, 100);
        }
      }]);

})();
