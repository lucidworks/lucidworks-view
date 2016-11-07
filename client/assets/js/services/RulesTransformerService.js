(function () {
  'use strict';

  angular
    .module('lucidworksView.services.rules.transformer', [
      'lucidworksView.services.config'
    ])
    .provider('RulesTransformerService', RulesTransformerService);

  function RulesTransformerService() {

    this.$get = function (ConfigService) {

      var rulesConfig = ConfigService.config.rules;
      var types = rulesConfig.types;
      var keys = {
        "Redirect": "redirect",
        "Banner": "banner"
      };

      var simple = [
        'display_type',
        'id',
        'type',
        'ruleName',
        'description',

        'keys',
        'values',

        'param_keys',
        'param_values',
        'param_policies',

        'field_name',
        'field_values',

        'createdAt',
        'updatedAt',
        'enabled'
      ];

      var transformers = {
        type: {
          viewToModel : function (view, model) {
            model.type = types[view.display_type];

            if (model.type == 'response_value') {
              model.keys = [keys[view.display_type]];
              model.values = [view.values];
            }
          },

          modelToView : function (view, model) {
            if (model.type == 'response_value') {
              view.values = model.values[0] || model.values;
            }
          }
        },

        search_terms : {
          viewToModel: function (view, model) {
            if (view.search_terms && view.search_terms.trim().length > 0) {
              model.search_terms = view.search_terms;
              model.search_terms_type = view.search_terms_type;
            }
          },

          modelToView: function (view, model) {
            if (!model.search_terms) {
              return;
            }

            if (model.search_terms.length) {
              view.search_terms = model.search_terms[0];
            } else {
              view.search_terms = model.search_terms
            }
            view.search_terms_type = model.search_terms_type;
          }
        },

        tags: {
          viewToModel: function (view, model) {
            if (view.viewTags && view.viewTags.length > 0) {
              model.tags = _.chain(view.viewTags).map('text').uniq().value();
            }
          },

          modelToView: function (view, model) {
            if (model && model.tags) {
              view.viewTags = _.chain(model.tags).uniq().map(function (tag) {
                return {text: tag};
              }).value()
            }
          }
        },

        filters: {
          viewToModel: function (view, model) {
            model.filters = "";
            if (view.viewFilters && view.viewFilters[0]) {
              for (var i = 0, l = view.viewFilters[0].length; i < l; i++) {
                model.filters += view.viewFilters[0][i] + ':' + view.viewFilters[1][i] + ' ';
              }
              model.filters = model.filters.trim();
            }

            if (model.filters == ":") {
              delete model.filters;
            }
          },

          modelToView: function (view, model) {
            if (model && model.filters) {
              if (model.filters.length) {
                model.filters = model.filters[0];
              }
              var filtersArray = model.filters.split(/[ ,:]+/);
              var actualFiltersArray = [[], []];
              for (var j = 0, k = filtersArray.length; j < k; j++) {
                actualFiltersArray[j % 2].push(filtersArray[j]);
              }
              view.viewFilters = actualFiltersArray;
            }
          }
        },

        dates: {
          viewToModel: function (view, model) {
            if (view.viewDates[0].length != view.viewDates[1].length) {
              console.error("Error: view.viewDates[0] and view.viewDates[1] has different size");
              return;
            }

            if (view.viewDates && view.viewDates[0].length > 0) {
              model.effective_range = [];
            }

            for (var i = 0; i < view.viewDates[0].length; i++) {
              model.effective_range[i] =
                "[" + view.viewDates[0][i] + " TO " + view.viewDates[1][i] + "]";
            }
          },

          modelToView: function (view, model) {
            view.viewDates = [[], []];

            if (model.effective_range) {
              for (var j = 0, k = model.effective_range.length; j < k; j++) {
                // TODO refactor with regexp
                var split = model.effective_range[j].split(' TO ');
                view.viewDates[0][j] = split[0];
                view.viewDates[0][j] = view.viewDates[0][j].replace("[", "");
                view.viewDates[1][j] = split[1];
                view.viewDates[1][j] = view.viewDates[1][j].replace("]", "");
              }
            }
          }
        }
      };

      return {
        viewRuleToModel: function (ruleView) {
          var model = _.pick(ruleView, simple);

          _.each(transformers, function (transformer) {
            transformer.viewToModel(ruleView, model);
          });

          return model;
        },

        modelRuleToView: function (r) {
          if (r && !r.ruleName) {
            r.ruleName = r.id;
          }

          var view = _.pick(r, simple);
          _.each(transformers, function (transformer) {
            transformer.modelToView(view, r);
          });

          return view;
        }

      };
    }
  }
}());
