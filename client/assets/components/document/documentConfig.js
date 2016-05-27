(function () {
  angular.module('lucidworksView.components.document')
    .factory('DocumentConfig', function(){
      'ngInject';

      /**
       * Modify array map to add your custom templates
       *
       * Syntax:
       *
       * ['field_name=>raw_string_value','template_id/template_id.html'] will checkif
       * a document has a field `field_name` of the value `raw_string_value`.
       * If yes chosen template for that document will be `template_id/template_id.html`.
       *
       * You can have more advanced predicates, like...
       * [function(doc){
       *   return some_condition(doc);
       * }, 'template_id/template_id.html']
       * the function will be called with the document as argument
       * and if the function returns `true`
       * the corresponding template will be chosen
       *
       * The first match of the predicate will be the final template that's chosen at the end
       *
       * You can also inject helpers etc. with ngInject to help writing predicate functions
       *
       * The template IDs will all be fetched from /client/components/document/<template_id>/template_id.html
       * The filename would be the document ID, i.e. shown below as set of default templates.
       *
       * Also if none of the predicates match, the default template i.e. `document_default/document_default.html` will be chosen.
       *
       */

      var map = [
        [function(doc){
          // Your code goes here
          return false;
        }, 'document_EXAMPLE/document_EXAMPLE.html'],
        ['_lw_data_source_type_s=>lucid.anda/web','document_web/document_web.html'],
        ['_lw_data_source_type_s=>lucid.twitter.search/twitter_search','document_twitter/document_twitter.html'],
        ['_lw_data_source_type_s=>lucid.twitter.stream/twitter_stream','document_twitter/document_twitter.html'],
        ['_lw_data_source_type_s=>lucid.slack/slack','document_slack/document_slack.html'],
        ['_lw_data_source_type_s=>lucid.anda/jira','document_jira/document_jira.html'],
        ['_lw_data_source_type_s=>lucid.anda/file','document_file/document_file.html']
      ];

      map.default = 'document_default/document_default.html';

      return map;
    });
})();
