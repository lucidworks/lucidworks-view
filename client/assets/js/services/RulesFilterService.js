(function () {
  'use strict';

  angular
    .module('lucidworksView.services.rules.filter', [])
    .provider('RulesFilterService', RulesFilterService);

  function RulesFilterService() {

    this.$get = function () {

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
        },

        sortBy: function (by) {
          if (!this.values.sortByCond) {
            this.values.sortByCond = {};
            this.values.sortByCond[by] = true
          } else if (this.values.sortByCond[by]) {
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
          console.log("filter:", this.values);

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
            res += "&sort=" + _.transform(this.values.sortByCond, function (result, value, key) {
                result.push(key + " " + (value ? 'asc' : 'desc'));
              }, []).join(",");
          }

          if (this.values.startDate || this.values.endDate) {
            var start = this.values.startDate ? this.values.startDate + ":00Z" : "*";
            var end = this.values.endDate ? this.values.endDate + ":00Z" : "*";

            res += "&fq=updatedAt:[" + start + " TO " + end + "]";
          }

          return res;
        },

        logout: function () {
          AuthService.destroySession();
        },

        reset: function () {
          this.values = {
            query: "",
            pageSize: 10,
            pageNum: 0,

            startDate: null,
            endDate: null,

            sortByCond: null,

            facets: {}
          }
        }
      }
    }
  }
}());
