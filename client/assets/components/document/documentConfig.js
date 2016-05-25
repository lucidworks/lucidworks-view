(function () {
  angular.module('lucidworksView.components.document')
    .constant('DocumentConfig', [
      ['_lw_data_source_type_s=>lucid.anda/web','document_web'],
      ['_lw_data_source_type_s=>lucid.twitter.search/twitter_search','document_twitter'],
      ['_lw_data_source_type_s=>lucid.twitter.stream/twitter_stream','document_twitter'],
      ['_lw_data_source_type_s=>lucid.slack/slack','document_slack'],
      ['_lw_data_source_type_s=>lucid.anda/jira','document_jira'],
      ['_lw_data_source_type_s=>lucid.anda/file','document_file']
    ]);
})();
