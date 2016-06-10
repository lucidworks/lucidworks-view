var rulesApp = angular.module('rulesApp', []);

function aaa() {
  moment().calendar();
  $(".datepicker").datetimepicker({defaultDate: "now"});
  autosize($("textarea"));
  $('[id^="triggerTags"]').tagsinput({tagClass: "label label-default"});

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
      if (el && el.dataset["initilized"]) {
        return;
      }

      el.dataset["initilized"] = true;
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
           ['$scope', '$http', '$timeout', 'serverLoad', 'serverAdd', 'serverDelete', 'serverUpdate', 'serverSearch',
    function($scope, $http, $timeout, serverLoad, serverAdd, serverDelete, serverUpdate, serverSearch) {
  //var vm = this;
  //
  //vm.query = "*";
  //vm.facetField = "type";
  //
  //vm.appHost = "http://localhost:8764";
  //vm.solrUrl = vm.appHost + "/api/apollo/solr";
  //vm.rulesCollection = "bsb_products_rules";
  //var c = {headers: {'Authorization': 'Basic ' + btoa('admin:123qweasdzxc')}};

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
  $scope.bannerList = [];

  $scope.flags = {
    keywordsFlag : false,
    tagsFlag : false,
    productListFlag : false,
    redirectFlag : false,
    bannerFlag : false,
    facetListFlag : false,
    rankListFlag : false,
    querySetFlag : false
  };

  $scope.currentRule = {
    currentDate: Date.now(),
    ruleName: '',
    ruleDescription: '',
    ruleStart: '',
    ruleEnd: '',
    ruleKeywords: '',
    ruleCategory: '',
    ruleTagList: '',
    ruleProductList: '',
    ruleRedirect: '',
    ruleBanner: [],
    ruleFacetList: '',
    ruleRankList: '',
    ruleQuerySet: '',
    ruleNumber: 1
  };

  $scope.addRule = function () {

    var rule = {
      idNumb: $scope.currentRule.ruleNumber++,
      id: $scope.currentRule.ruleName,
      description: $scope.currentRule.ruleDescription,
      triggerStart: []/*document.getElementsByClassName('add-trigger-start')[0].value*/,
      triggerEnd: []/*document.getElementsByClassName('add-trigger-end')[0].value*/,
      search_terms: $scope.currentRule.ruleKeywords,
      category: $scope.currentRule.ruleCategory,
      tags: $scope.currentRule.ruleTagList,
      productList: $scope.currentRule.ruleProductList,
      redirect: $scope.currentRule.ruleRedirect,
      banner: $scope.currentRule.ruleBanner,
      facetList: $scope.currentRule.ruleFacetList,
      rankList: $scope.currentRule.ruleRankList,
      querySet: $scope.currentRule.ruleQuerySet,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      enabled: false
    };

    var triggerStartArray = document.getElementsByClassName('add-trigger-start');
    var triggerEndArray = document.getElementsByClassName('add-trigger-end');
    for (var i = 0, l = triggerStartArray.length; i<l; i++){
      rule.triggerStart.push(triggerStartArray[i].value);
    }
    for (var i = 0, l = triggerEndArray.length; i<l; i++){
      rule.triggerEnd.push(triggerEndArray[i].value);
    }

    $scope.rules = [rule].concat($scope.rules);
    $scope.rulesTotal += 1;


    if ($scope.rules[$scope.rules.length - 1] == undefined) {
      $scope.rules.pop();
    }

    serverAdd.run(rule);
    $timeout(aaa, 1);
  };

  $scope.checkUncheckAll = function () {
    var masterBox = document.getElementById('selectAllBoxes');
    var checkboxes = document.getElementsByClassName('ruleCheckbox');
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

    serverDelete.update(id);
    serverDelete.run();
  };

  $scope.bulkRemoveRules = function () {
    var ruleArray = document.getElementsByClassName('ruleCheckbox');
    var masterBox = document.getElementById('selectAllBoxes');
    masterBox.checked = false;
    for (var i = 0, l = ruleArray.length; i < l; i++) {
      if (ruleArray[i].checked)
        $scope.removeRule(ruleArray[i].value);
    }
  };

  $scope.bulkStatus = function (enabled) {
    var ruleArray = document.getElementsByClassName('ruleCheckbox');
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
    var ruleArray = document.getElementsByClassName('ruleCheckbox');
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
        var tagsInput = $('tr.' + rule.id + " #triggerTags");
        tagsInput.tagsinput('removeAll');
        if (rule.tags && rule.tags.length > 0) {
          tagsInput.tagsinput('add', rule.tags.join(","));
        }
        if (isNewTag) {
          $scope.tagsFacets.push([tag, 1]);
        }
        $scope.updateRule(ruleArray[i].value);
      }
    }
  };

  $scope.getCheckedBoxesCount = function () {
    var checkedCount = document.querySelectorAll('input.ruleCheckbox:checked').length;
    var bulkActions = document.getElementById('bulk-actions');
    var bulkDropdown = document.getElementById('bulk-dropdown');
    if (checkedCount == 0) {
      bulkActions.setAttribute('disabled', 'disabled');
      bulkDropdown.style.visibility = 'hidden';
    } else {
      bulkActions.removeAttribute('disabled');
      bulkDropdown.style.visibility = 'visible';
    }
    $('[id^="triggerTags"]').tagsinput({tagClass: "label label-default"});
    $('.datepicker').datetimepicker();
    return checkedCount;
  };

  $scope.resetFocus = function () {
    var bulkActions = document.getElementById('bulk-actions');
    bulkActions.focus();
    bulkActions.blur();
  };

  $scope.updateRule = function (id) {
    console.log("update - " + id);

    var rule = $scope.rules[findIndexById(id)];
    rule.updatedAt = Date.now();
    rule.triggerStart = $('tr.'+rule.id + ' trigger-start').value;
    rule.triggerEnd = $('tr.'+rule.id + ' trigger-end').value;
    rule.tags = $('tr.' + rule.id + ' #triggerTags')[0].value.split(',');


    delete rule._version_;

    serverUpdate.run(id, rule);
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
      rule.category = rule.category || "cat";
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

  serverLoad.run($scope);
  $timeout(aaa, 1);

  $scope.pageSize = 10;
  $scope.pageNum = 0;
  $scope.searchQuery = "*";

  $scope.search = function (pageNum) {
    console.log("searching (" + pageNum + ")...");
    $scope.pageNum = (pageNum || 0);

    var url = "/api/apollo/query-pipelines/bsb_products_rules-default/collections/bsb_products_rules/" +
      "select?fl=*,score&echoParams=all&wt=json&json.nl=arrarr&facet=true&facet.field=type" +
      "&start=" + $scope.pageNum * $scope.pageSize + "&rows=" + $scope.pageSize +
      "&q=" + $scope.searchQuery + "&debug=true";

    serverSearch.run(url, $scope);
  };

  $scope.filterBy = function (field, value) {
    if ($scope.searchQuery.trim() === "*") {
      $scope.searchQuery = '';
    }
    $scope.searchQuery = field + ':' + value + ' ' + $scope.searchQuery;
    $scope.search()
  };

  $scope.hasNext = function () {
    return ($scope.pageNum + 1) * $scope.pageSize < ($scope.rulesTotal || 0)
  };

  $scope.next = function () {
    if ($scope.hasNext()) {
      $scope.search($scope.pageNum + 1);
    }
  };

  $scope.prev = function () {
    if ($scope.pageNum > 0) {
      $scope.search($scope.pageNum - 1);
    }
  };

  serverLoad.run($scope);
  $timeout(aaa, 1);
}]);

rulesApp.factory('serverInfo', function(){
  return {
    query : "*",
    facetField : "type",
    appHost : "http://localhost:8764",
    solrUrl : "http://localhost:8764/api/apollo/solr",
    rulesCollection : "bsb_products_rules",
    c : { headers: { 'Authorization': 'Basic ' + btoa('admin:123qweasdzxc')}}
  };
});

function groupFacetsIntoPairs(ff) {
  var f = [];
  for (var i = 0; i < (ff.length / 2); i++) {
    f.push([ff[2*i], ff[2*i+1]]);
  }

  return f;
}

rulesApp.factory('serverLoad', ['$http', '$timeout', 'serverInfo',
    function($http, $timeout, serverInfo){

  var url = serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/select/?wt=json&q=' + serverInfo.query
    + '&fl=*,name&facet=true&facet.field=type&facet.field=tags';

  return {
    run: function($scope){
      $http.get(url, serverInfo.c).then(function(response) {
        $scope.rules = response.data.response.docs;
        $scope.rulesTotal = response.data.response.numFound;

        $scope.typeFacets = groupFacetsIntoPairs(response.data.facet_counts.facet_fields.type);
        $scope.tagsFacets = groupFacetsIntoPairs(response.data.facet_counts.facet_fields.tags);

        //console.log($scope.tagsFacets);
        //console.log($scope.rules);
        $timeout(aaa, 1);
      });
    }
  };
}]);

rulesApp.factory('serverAdd', ['$http', 'serverInfo', function($http, serverInfo){

  return {
    run: function(rule){
      $http.post(serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/update/json/docs?commit=true', rule, serverInfo.c).then(function(response) {
        console.log("Rule '" + rule.id + "' created!");
      });
    }
  };
}]);

rulesApp.factory('serverDelete', ['$http', 'serverInfo', function($http, serverInfo){
  var id;

  return {
    update: function(x){
      id = x
    },
    run: function(){
      $http.post(serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/update?commit=true', {'delete': {id: id}}, serverInfo.c).then(function(response) {
        console.log("Rule '" + id + "' deleted!");
      });
    }
  };
}]);

rulesApp.factory('serverUpdate', ['$http', 'serverInfo', function($http, serverInfo){
  return {
    run: function(id, rule){
      console.log("updating rule: ", id, rule);
      $http.post(serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/update/json/docs?commit=true', rule, serverInfo.c).then(function(response) {
        console.log("Rule '" + id + "' updated!");
      });
    }
  }
}]);

rulesApp.factory('serverSearch', ['$http', 'serverInfo', function($http, serverInfo){
  return {

    run: function(url, $scope){
      $http.get(serverInfo.appHost + url, serverInfo.c).then(function (response) {
        console.log("search complete: ");

        $scope.rules = response.data.response.docs;
        $scope.rulesTotal = response.data.response.numFound;
      });
    }
  }
}]);

