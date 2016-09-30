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

        sortByCond: null,

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

      sortBy: function (by) {
        if (!this.values.sortByCond) {
          this.values.sortByCond = {};
          this.values.sortByCond[by] = true
        } else if (this.values.sortByCond[by]){
          this.values.sortByCond[by] = false;
        } else {
          this.values.sortByCond = null;
        }
      },

      sortByIcon: function (by) {
        console.log("sortByIcon(" + by + ")");

        if (this.values.sortByCond === null) {
          return 'fa-sort';
        }

        if (this.values.sortByCond[by] === true) {
          return 'fa-sort-asc';
        }

        if (this.values.sortByCond[by] === false) {
          return 'fa-sort-desc';
        }

        return 'fa-sort';
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
          res += "&fq=" + filterQuery.join("&fq=");
        }

        // : sort=<field name>+<direction>,<field name>+<direction>],...
        if (this.values.sortByCond) {
          res += "&sort=" + _.transform(this.values.sortByCond, function(result, value, key) {
              result.push(key + " " + (value ? 'asc' : 'desc'));
            }, []).join(",");
        }

        return res;
      },

      logout: function (){
        AuthService.destroySession();
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
    .module('lucidworksView.controllers.rules', [
        'lucidworksView.services.rules',
        'lucidworksView.services.config',
        'lucidworksView.services.auth',
        'ngTagsInput'
    ])
    .controller('rulesController', ['$scope', '$http', '$timeout', 'RulesService', 'ConfigService', 'AuthService',
      function ($scope, $http, $timeout, rulesService, ConfigService, AuthService) {

        var rulesConfig = ConfigService.config.rules;
        $scope.types = rulesConfig.types;
        $scope.policyList = rulesConfig.set_params.policies;
        $scope.productList = rulesConfig.documentFields;
        $scope.predefinedTags = rulesConfig.tags;

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

        $scope.checkSession = function () {
          var res = AuthService.getSession();
        };

        $scope.addRule = function () {
          var rule = {
            display_type: $scope.currentRule.displayRuleType,
            ruleName: $scope.currentRule.ruleName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

          if (rule.tags) {
            rule.tags = _.map(rule.tags, 'text');
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
            var addRule = $('#addRule');
            addRule.find('.alert').addClass('alert-warning');
            addRule.find('.err-code').html(resp.status);
            addRule.find('.err-message').html(resp.statusText);
            $('#addRuleErrorDetails').html(resp.data);
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
                  _.remove(rule.tags, function(tagO) {
                    return tagO && tagO.text === tag;
                  });
                }
              } else {
                if (!rule.tags) {
                  rule.tags = [];
                }

                if (!_.find(rule.tags, function (t) { return t.text === tag })) {
                  rule.tags.push({text: tag});
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

          var rule = $scope.rules[findIndexById(id)];
          var ruleArray = $scope.ruleArrays[rule.id];

          rule.updatedAt = new Date().toISOString();

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

          if (rule.tags) {
            rule.tags = _.map(rule.tags, 'text');
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
            var docs = response.data.response.docs;
            console.log("Rules loaded: ");
            console.log(docs);

            docs.forEach(function (item, i) {
              if (item && !item.ruleName) {
                item.ruleName = item.id;
              }

              if (item && item.tags) {
                item.tags = _.map(item.tags, function (tag) {
                  return {text: tag};
                })
              }

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
              var range = docs[i].effective_range;
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

            $scope.rules = docs;
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
          Filter.sortBy(by);

          console.log('sortBy', Filter.values);
          $scope.search();
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
        };

      }]);

})();
