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

rulesApp.controller('rulesController', ['$scope', '$http', '$timeout', 'serverLoad', 'serverAdd', 'serverDelete', 'serverUpdate', 'serverSearch', function($scope, $http, $timeout, serverLoad, serverAdd, serverDelete, serverUpdate, serverSearch) {
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
    ruleBanner: '',
    ruleFacetList: '',
    ruleRankList: '',
    ruleQuerySet: '',
    ruleNumber: 1,

  };

  $scope.addRule = function () {

    var rule = {
      idNumb: $scope.currentRule.ruleNumber++,
      id: $scope.currentRule.ruleName,
      description: $scope.currentRule.ruleDescription,
      triggerStart: document.getElementsByClassName('add-trigger-start')[0].value,
      triggerEnd: document.getElementsByClassName('add-trigger-end')[0].value,
      search_terms: $scope.currentRule.ruleKeywords,
      category: $scope.currentRule.ruleCategory,
      tagList: $scope.currentRule.ruleTagList,
      productList: $scope.currentRule.ruleProductList,
      redirect: $scope.currentRule.ruleRedirect,
      banner: $scope.currentRule.ruleBanner,
      facetList: $scope.currentRule.ruleFacetList,
      rankList: $scope.currentRule.ruleRankList,
      querySet: $scope.currentRule.ruleQuerySet,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'disabled',
    };

    $scope.rules = [rule].concat($scope.rules);
    $scope.rulesTotal += 1;


    if ($scope.rules[$scope.rules.length - 1] == undefined) {
      $scope.rules.pop();
    };


    //$http.post(vm.solrUrl + '/' + vm.rulesCollection + '/update/json/docs?commit=true', rule, c).then(function (response) {
    //  console.log("Rule '" + rule.id + "' created!");
    //});



    serverAdd.update(rule);
    serverAdd.run();
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

    //$http.post(vm.solrUrl + '/' + vm.rulesCollection + '/update?commit=true', {'delete': {id: id}}, c).then(function (response) {
    //  console.log("Rule '" + id + "' deleted!");
    //});
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

  $scope.bulkStatus = function (status) {
    var ruleArray = document.getElementsByClassName('ruleCheckbox');
    for (var i = 0, l = ruleArray.length; i < l; i++) {
      if (ruleArray[i].checked) {
        var rule = $scope.rules[findIndexById(ruleArray[i].value)];
        rule.status = status;
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
    rule.triggerStart = document.getElementsByClassName('trigger-start ' + rule.id)[0].value;
    rule.triggerEnd = document.getElementsByClassName('trigger-end ' + rule.id)[0].value;

    delete rule._version_;

    //$http.post(vm.solrUrl + '/' + vm.rulesCollection + '/update/json/docs?commit=true', rule, c).then(function (response) {
    //  console.log("Rule '" + id + "' updated!");
    //});
    serverUpdate.update(id, rule);
    serverUpdate.run();
  };

  $scope.changeStatus = function (id) {
    var rule = $scope.rules[findIndexById(id)];
    if (rule.status == 'enabled') {
      rule.status = 'disabled';
    } else {
      rule.status = 'enabled';
    }
    $scope.updateRule(id);
  };

  $scope.addTrigger = function (id, name) {
    var rule = $scope.rules[findIndexById(id)];

    if (name == 'search_terms') {
      rule.search_terms = rule.search_terms || ["keyword"];
    } else if (name == 'tags') {
      rule.tagList = rule.tagList || ["t1"];
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

  //function loadRules() {
  //  var url = vm.solrUrl + '/' + vm.rulesCollection + '/select/?wt=json&q=' + vm.query
  //    + '&fl=*,name&facet=true&facet.field=' + vm.facetField;
  //
  //  $http.get(url, c).then(function (response) {
  //
  //    $scope.rules = response.data.response.docs;
  //    $scope.rulesTotal = response.data.response.numFound;
  //
  //    var ff = response.data.facet_counts.facet_fields.type;
  //    console.log(ff);
  //    var f = [];
  //    for (var i = 0; i < (ff.length / 2); i++) {
  //      f.push([ff[2 * i], ff[2 * i + 1]]);
  //    }
  //    $scope.facets = f;
  //
  //    console.log("Rules", $scope.rules);
  //    console.log("Facets", $scope.facets);
  //
  //    setTimeout(aaa, 1000); // TODO all controls should be done as Angular directives
  //  });
  //}
  serverLoad.run();
  $timeout(aaa, 1);

  $scope.pageSize = 10;
  $scope.pageNum = 0;
  $scope.searchQuery = "*";

  $scope.search = function (pageNum) {
    console.log("searching (" + pageNum + ")...");
    if (pageNum) {
      $scope.pageNum = pageNum;
    }

    var url = /*vm.appHost + */ "/api/apollo/query-pipelines/bsb_products_rules-default/collections/bsb_products_rules/" +
      "select?fl=*,score&echoParams=all&wt=json&json.nl=arrarr&facet=true&facet.field=type" +
      "&start=" + $scope.pageNum * $scope.pageSize + "&rows=" + $scope.pageSize +
      "&q=" + $scope.searchQuery + "&debug=true";

    //$http.get(url, c).then(function (response) {
    //  console.log("search complete: ");
    //
    //  $scope.rules = response.data.response.docs;
    //  $scope.rulesTotal = response.data.response.numFound;
    //});
    serverSearch.update(url);
    serverSearch.run();
    $scope.rules = serverSearch.rules;
    $scope.rulesTotal = serverSearch.total;

  };

  $scope.filterBy = function (field, value) {
    if ($scope.searchQuery.trim() === "*") {
      $scope.searchQuery = '';
    }
    $scope.searchQuery = field + ':' + value + ' ' + $scope.searchQuery;
    $scope.search()
  };

  $scope.next = function () {
    $scope.search($scope.pageNum + 1);
  };

  $scope.prev = function () {
    $scope.search($scope.pageNum - 1);
  };

  //loadRules();
  //setTimeout(aaa, 1000);
  serverLoad.run();
  $timeout(aaa, 1);
}]);

rulesApp.factory('serverInfo', function(){
  return {
    query : "*",
    facetField : "type",
    solrUrl : "http://localhost:8764/api/apollo/solr",
    rulesCollection : "bsb_products_rules",
    appHost : "http://localhost:8764",
    c : { headers: { 'Authorization': 'Basic ' + btoa('admin:123qweasdzxc')}}
  };
});

rulesApp.factory('serverLoad', [ '$http', 'serverInfo', function($http, serverInfo){
  var url = serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/select/?wt=json&q=' + serverInfo.query
    + '&fl=*,name&facet=true&facet.field=' + serverInfo.facetField;

  return {
    run: function(){
      $http.get(url, serverInfo.c).then(function(response) {
        $scope.rules = response.data.response.docs;

        var ff = response.data.facet_counts.facet_fields.type;
        console.log(ff);
        var f = [];
        for (var i = 0; i < (ff.length / 2); i++) {
          f.push([ff[2*i], ff[2*i+1]]);
        }
        $scope.facets = f;

        console.log($scope.rules);
        console.log($scope.facets);
        $timeout(aaa, 1);
      });
    }
  };
}]);

rulesApp.factory('serverAdd', ['$http', 'serverInfo', function($http, serverInfo){
  var addedRule;

  return {
    update: function(x){
      addedRule = x
    },
    run: function(){
      $http.post(serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/update/json/docs?commit=true', addedRule, serverInfo.c).then(function(response) {
        console.log("Rule '" + addedRule.id + "' created!");
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
  var id, rule;
  return {
    update: function(x, y){
      id = x;
      rule = y;
    },
    run: function(){
      $http.post(serverInfo.solrUrl + '/' + serverInfo.rulesCollection + '/update/json/docs?commit=true', rule, serverInfo.c).then(function(response) {
        console.log("Rule '" + id + "' updated!");
      });
    }
  }
}]);

rulesApp.factory('serverSearch', ['$http', 'serverInfo', function($http, serverInfo){
  var url, responseRules, responseTotal;
  return {
    update: function(x){
      url = serverInfo.appHost +  x;
    },
    run: function(){
      $http.get(url, serverInfo.c).then(function (response) {
        console.log("search complete: ");

        responseRules = response.data.response.docs;
        responseTotal = response.data.response.numFound;
      });
    },
    rules: responseRules,
    total:responseTotal
  }
}]);

