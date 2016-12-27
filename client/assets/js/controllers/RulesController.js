(function () {
  'use strict';
/*

  function setModalMaxHeight(element) {
    var $element = $(element),
      $content = $element.find('#addRule .modal-content');
    var borderWidth = $content.outerHeight() - $content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = $element.find('.modal-header').outerHeight() || 0;
    var alertHeight = $element.find('.add-rule-error').outerHeight() || 0;
    var footerHeight = $element.find('.modal-footer').outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight + alertHeight);

    $content.css({ 'overflow': 'hidden'});

    $element
      .find('.modal-body').css({
      'height': maxHeight
    });
  }
*/

  angular
    .module('lucidworksView.controllers.rules', [
        'lucidworksView.services.rules',
        'lucidworksView.services.rules.transformer',
        'lucidworksView.services.rules.filter',
        "lucidworksView.services.user",
        'lucidworksView.services.config',
        'lucidworksView.services.auth',
        'ngTagsInput',
        'ADM-dateTimePicker'
    ])
    .controller('rulesController', ['$scope', '$http', '$timeout', 'RulesService', 'RulesTransformerService', 'RulesFilterService', "UserService", 'ConfigService', 'AuthService',
      function ($scope, $http, $timeout, rulesService, rulesTransformerService,  rulesFilterService, UserService, ConfigService, AuthService) {

        var rulesConfig = ConfigService.config.rules;

        $scope.rulesConfig = rulesConfig;
        $scope.types = rulesConfig.types;
        $scope.policyList = rulesConfig.set_params.policies;
        $scope.productList = rulesConfig.documentFields;
        $scope.predefinedTags = rulesConfig.tags;
        $scope.checkedRulesIds = {};
        $scope.noConfirmRemove = {bulkRemove: {checked: false, activated: false}, singleRemove: {checked: false, activated: false}};
        $scope.masterBox = false;
        $scope.checkedTags = {};
        $scope.disabledRuleEdit = {};
        $scope.checkedRulesCount = 0;
        $scope.checkedRulesArray = [];
        $scope.rulesCollection = ConfigService.config.rules.collection.trim().replace('_rules', "");;

        UserService.init();

        function pageInit() {

          $('.modal').on('show.bs.modal', function() {
            $(this).show();
            /*setModalMaxHeight(this);*/
          });

          $('.modal').on('shown.bs.modal', function() {
            autosize.update($('textarea'));
          });

         /* $(window).resize(function() {
            if ($('.modal.in').length != 0) {
              setModalMaxHeight($('.modal.in'));
            }
          });*/

          /*$('.disabledControl').prop('disabled', true);*/

          var rules = $scope.rules;

          for (var i = 0, l = rules.length; i < l; i++) {
            $scope.activate(rules.id);
          }

          function setTagsCheck () {
            for (var i = 0, l = $scope.facets.tags.length; i < l; i++) {
              $scope.checkedTags[$scope.facets.tags[i][0]] = -1;
            }
          }
          setTagsCheck ();
        }

        $scope.activate = function (id) {
          if ($scope.disabledRuleEdit[id] == true) {
            $scope.disabledRuleEdit[id] = false;
          } else {
            $scope.disabledRuleEdit[id] = true;
          }

        };


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


        $scope.getCheckedRulesCount = function () {
          $scope.cleanFromUnchecked();
          $scope.checkedRulesToArray();
          $scope.checkedRulesCount = $scope.checkedRulesArray.length;
        };

        $scope.cleanFromUnchecked = function () {
          var checkedRules = {};
          var allCheckedRules = $scope.checkedRulesIds;
          Object.keys(allCheckedRules).map(function(key, index) {
            if (allCheckedRules[key]) {
              checkedRules[key] = true;
            }
          });
          $scope.checkedRulesIds = checkedRules;
        };

        $scope.checkedRulesToArray = function () {
          var checkedRules = $scope.checkedRulesIds;
          var checkedRulesArray = [];
          Object.keys(checkedRules).map(function(key, index) {
            checkedRulesArray.push(key);
          });
          $scope.checkedRulesArray = checkedRulesArray;
        };

        $scope.filter = rulesFilterService;

        $scope.checkSession = function () {
          var res = AuthService.getSession();
        };

        $scope.changeTagsChecked = function (val, tag) {
          if (val == "na") {
            var tags = {};
            $.each( $scope.checkedTags, function( key, value ) {
              tags[key]= -1;
            });
            $scope.checkedTags = tags;
          }
          if (val == "off") {
            $scope.checkedTags[tag] = 0;
          }
          if (val == "on") {
            $scope.checkedTags[tag] = 1;
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

        $scope.checkUncheckAll = function (operation) {
          var masterBox = $scope.masterBox;
          var firstOnPage = rulesFilterService.rulesFrom();
          var lastOnPage = rulesFilterService.rulesTo();
          if (operation == 'all') {
            masterBox = true;
          } else if (operation == 'none') {
            masterBox = false;
          }
          if (masterBox) {
            for (var i = 0, l = $scope.rules.length; i < l; i++ ) {
              $scope.checkedRulesIds[$scope.rules[i].id] = true;
            }
          } else {
            $scope.checkedRulesIds = {};
            masterBox = false;
          }
          $scope.masterBox = masterBox;
        };

        $scope.removeRule = function (id) {
          var ruleIndex = findIndexById(id);
          var rule = $scope.rules[ruleIndex];
          if (!rule) {
            console.log("delete error: rule with id '" + id + "' not found.");
            return;
          }
          console.log("delete - " + id);
          $scope.rules.splice(ruleIndex, 1);
          delete $scope.checkedRulesIds[id];
          $scope.getCheckedRulesCount();
          $scope.rulesTotal -= 1;
          rulesService.delete(id);
        };

        $scope.checkNoConfirmDelete = function () {
          var bulkRemoveNoConfirm = $scope.noConfirmRemove.bulkRemove.activated;
          var singleRemoveNoConfirm = $scope.noConfirmRemove.singleRemove.activated;
          var checkedRules = $scope.checkedRulesCount;

          if ((checkedRules > 1 && bulkRemoveNoConfirm) || (checkedRules == 1 && singleRemoveNoConfirm)) {
            $scope.bulkRemoveRules();
          }
        };

        $scope.bulkRemoveRules = function () {

          var checkedRules = $scope.checkedRulesArray;
          var l = checkedRules.length;
          while (l--) {
            $scope.removeRule(checkedRules[l]);
          }
          $scope.masterBox = false;
          $scope.noConfirmRemove.bulkRemove.activated = $scope.noConfirmRemove.bulkRemove.checked;
          $scope.noConfirmRemove.singleRemove.activated = $scope.noConfirmRemove.singleRemove.checked;
        };

        $scope.bulkStatus = function (enabled) {
          var checkedRulesArray = $scope.checkedRulesArray;
          for (var i = 0, l = checkedRulesArray.length; i < l; i++) {
            findRuleById(checkedRulesArray[i]).enabled = enabled;
            $scope.updateRule(checkedRulesArray[i]);
          }
        };

        /**
         *
         * @param tag {String} string with tag value
         * @param remove {Boolean} true if we want to remove tag, otherwise add them
         */
        $scope.bulkAddTag = function (tag, remove, isNewTag) {
          var ruleArray = $scope.rules;
          var checkedRuleArray = $scope.checkedRulesArray;

          for (var i = 0, l = checkedRuleArray.length; i < l; i++) {
            var rule = findRuleById(checkedRuleArray[i]);
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
            $scope.updateRule(rule.id);
          }
          console.log($scope.facets);
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
          console.log(rule.viewDates);
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
          rule.viewDates[0].push(undefined);
          rule.viewDates[1].push(undefined);
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
