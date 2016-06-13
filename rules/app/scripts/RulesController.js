"use strict";

var rulesApp = angular.module('rulesApp');

var Filter = (function () {

  var facets = {
    type: {name: "Rules type"},
    tags: {name: "Tags"}
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

    hasPrev : function () {
      return this.values.pageNum > 0;
    },

    prev: function () {
      this.values.pageNum -= 1;
      return this.values.pageNum;
    },

    toUrlString : function () {
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

function aaa() {
  moment().calendar();
  $(".datepicker").datetimepicker({defaultDate: "now"});
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
    })
  }

  //setActivator(".rules-list h2");
  setActivator(".fa-pencil");
  setActivator(".rules-list .btn-save");

  function datePickerOnFocus() { // TODO why we need this function
    $(this).addClass('datepicker');
    $(".datepicker").datetimepicker();
    $(this).blur();
    $(this).focus();
  }

  $('.trigger-start').on('focus', datePickerOnFocus);
  $('.trigger-end').on('focus', datePickerOnFocus);
}

rulesApp.controller('rulesController',
           ['$scope', '$http', '$timeout', 'RulesService',
    function($scope, $http, $timeout, rulesService) {

      $scope.types = {
        filter_ids: "Filter List",
        block_ids: "Block List",
        boost_ids: "Boost List",
        redirect: "Redirect",
        banner: "Banner"
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

  $scope.flags = {
    keywordsFlag : false,
    categoryFlag : false,
    tagsFlag : false
  };

  $scope.currentRule = {
    currentDate: Date.now(),
    ruleType: '',
    ruleName: '',
    ruleDescription: '',
    ruleStart: '',
    ruleEnd: '',
    ruleKeywords: '',
    ruleCategoryType: '',
    ruleCategoryValue: '',
    ruleTags: '',
    ruleIds: []
  };

  $scope.filter = Filter;

  $scope.addRule = function () {

    var rule = {
      type: $scope.currentRule.ruleType,
      id: $scope.currentRule.ruleName,
      description: $scope.currentRule.ruleDescription,
      triggerStart: [],
      triggerEnd: [],
      search_terms: $scope.currentRule.ruleKeywords,
      category_id: [$scope.currentRule.ruleCategoryType, $scope.currentRule.ruleCategoryValue],
      tags: $scope.currentRule.ruleTags,
      ids: $scope.currentRule.ruleIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      enabled: false
    };

    var ruleName = $('#addRuleName')[0];
    var addRuleButton = $('#addRuleButton');
    addRuleButton.removeAttr('data-dismiss');
    if (ruleName.value==''){
      ruleName.placeholder = 'Rule name is required';
      return;
    }
    if ($scope.ruleType == 'Choose rule type'){
      //$('#chooseRuleType>option')[0].html('Rule type is required');
      return;
    }
    addRuleButton.attr('data-dismiss', 'modal');

    var triggerStartArray = $('.add-trigger-start');
    var triggerEndArray = $('.add-trigger-end');
    for (var i = 0, l = triggerStartArray.length; i<l; i++){
      rule.triggerStart.push(triggerStartArray[i].value);
    }
    for (var i = 0, l = triggerEndArray.length; i<l; i++){
      rule.triggerEnd.push(triggerEndArray[i].value);
    }

    var triggerTags = $('#addTriggerTags')[0];
    if (triggerTags!= undefined){
      rule.tags = triggerTags.value.split(',');
    }
    rule.search_terms = rule.search_terms.split(',');
    if ($scope.currentRule.ruleType=='banner' && $scope.currentRule.ruleBanner){
      rule.banner = $scope.currentRule.ruleBanner;
    }
    if ($scope.currentRule.ruleType=='redirect'&& $scope.currentRule.ruleRedirect){
      rule.redirect = $scope.currentRule.ruleRedirect;
    }

    $scope.rules = [rule].concat($scope.rules);
    $scope.rulesTotal += 1;


    if ($scope.rules[$scope.rules.length - 1] == undefined) {
      $scope.rules.pop();
    }

    rulesService.add(rule);
    $timeout(aaa, 1);
  };

  $scope.checkUncheckAll = function () {
    var masterBox = $('#selectAllBoxes');
    var checkboxes = $('.ruleCheckbox');
    if (masterBox.checked) {
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
      $scope.checkedBoxesCount = checkboxes.length;
    } else {
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      $scope.checkedBoxesCount = 0;
    }
  };

  $scope.removeRule = function (id) {
    console.log("delete - " + id);
    $scope.rules.splice(findIndexById(id), 1);
    $scope.rulesTotal -= 1;

    RulesService.delete(id);
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
  $scope.bulkAddTag = function(tag, remove, isNewTag){
    var ruleArray = $('.ruleCheckbox');
    for (var i = 0, l = ruleArray.length; i < l; i++) {
      if (ruleArray[i].checked) {
        var rule = $scope.rules[findIndexById(ruleArray[i].value)];
        if (remove) {
          var index = rule.tags.indexOf(tag);
          if (index > -1) {
            rule.tags.splice(index, 1);
          } else {
            console.log("error:index for tag '" + tag + "' not found");
          }
        } else {
          rule.tags.push(tag);
        }
        var tagsInput = $('tr.' + rule.id + " .triggerTags");
        tagsInput.tagsinput('removeAll');
        if (rule.tags && rule.tags.length > 0) {
          tagsInput.tagsinput('add', rule.tags.join(","));
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
    $('.datepicker').datetimepicker();
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
    rule.updatedAt = Date.now();

    var triggerStartArray = $('tr.'+rule.id + ' trigger-start');
    var triggerEndArray = $('tr.'+rule.id + ' trigger-end');

    for (var i = 0, l = triggerStartArray; i<l; i++){
      rule.triggerStart[i] = triggerStartArray[i].value;
      rule.triggerEnd[i] = triggerEndArray[i].value;
    }
    rule.tags = $('tr.' + rule.id + ' .triggerTags')[0].value.split(',');

    delete rule._version_;

    rulesService.update(id, rule);
  };

  $scope.changeStatus = function (id) {
    var rule = $scope.rules[findIndexById(id)];
    rule.enabled = rule.enabled !== true;
    $scope.updateRule(id);
  };

  $scope.addTrigger = function (id, name) {
    var rule = $scope.rules[findIndexById(id)];

    if (name == 'search_terms') {
      rule.search_terms = rule.search_terms || ["keyword"];
    } else if (name == 'tags') {
      rule.tags = rule.tags || ["t1"];
    } else if (name == 'category') {
      rule.category_id = rule.category_id || "cat";
    }
  };

  $scope.addAction = function (id, name) {
    var rule = $scope.rules[findIndexById(id)];

    if (name == 'product_list') {
      rule.productList = rule.productList || ["product"];
    } else if (name == 'redirect') {
      rule.redirect = rule.redirect || "/screens/touch-technology";
    } else if (name == 'banner') {
      rule.banner = rule.banner || "banner";
    } else if (name == 'facetList') {
      rule.facetList = rule.facetList || ["facetList"];
    } else if (name == 'rankList') {
      rule.rankList = rule.rankList || ["rankList"];
    } else if (name == 'querySet') {
      rule.querySet = rule.querySet || "querySet";
    }
  };

  $scope.checkActionCount = function (id) {
    var actionCount = 0;
    var rule = $scope.rules[findIndexById(id)];
    if (rule.productList)
      actionCount++;
    if (rule.redirect)
      actionCount++;
    if (rule.banner)
      actionCount++;
    if (rule.facetList)
      actionCount++;
    if (rule.rankList)
      actionCount++;
    if (rule.querySet)
      actionCount++;
    return actionCount;
  };

  $scope.search = function (pageNum) {
    console.log("searching (" + pageNum + ")...");
    $scope.filter.values.pageNum = (pageNum || 0);

    rulesService.search($scope.filter, function(response) {
      console.log("Rules loaded: ");
      $scope.rules = response.data.response.docs;
      $scope.rulesTotal = response.data.response.numFound;

      $scope.facets = response.data.facet_counts.facet_fields;

      console.log($scope.rules);
      $timeout(aaa, 1);
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
}]);

