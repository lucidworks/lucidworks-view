(function () {
  angular.module('lucidworksView.components.document')
    .factory('DocumentConfig', function(){
      'ngInject';

      /**
       * Modify array map to add your custom templates
       *
       * Syntax:
       *
       * ['field_name=>raw_string_value','template_id'] will make sure if
       * a document has a field `field_name` of the value `raw_string_value` the
       * chosen template for that document will be `template_id`
       *
       * You can have more advanced predicates, like...
       * [function(doc){
       *   return some_condition(doc);
       * }, 'template_id']
       * the function will be called with the document as argument
       * and if the function returns `true`
       * the corresponding template will be chosen
       *
       * In this array, the first match of the predicate will be the final template that's chosen at the end
       *
       * You can also want to inject helpers and things etc. to help writing predicate functions
       *
       * The template IDs will all be fetched from /client/components/document/templates/*.html
       * <script type="text/ng-template" id="document_id">...</script>; "document_id" the ID of that particular template
       *
       * Also if none of the predicates match, the default template i.e. `document_default` will be chosen.
       *
       */
      var map = [
        [function(doc){
          // Your code goes here
          return false;
        }, 'document_EXAMPLE'],
        ['_lw_data_source_type_s=>lucid.anda/web','document_web'],
        ['_lw_data_source_type_s=>lucid.twitter.search/twitter_search','document_twitter'],
        ['_lw_data_source_type_s=>lucid.twitter.stream/twitter_stream','document_twitter'],
        ['_lw_data_source_type_s=>lucid.slack/slack','document_slack'],
        ['_lw_data_source_type_s=>lucid.anda/jira','document_jira'],
        ['_lw_data_source_type_s=>lucid.anda/file','document_file']
      ];

      return map;
    });
})();
