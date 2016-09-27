appConfig = { //eslint-disable-line
  // If you don't know what you want for some configuration items,
  // leave them as-is and see what happens in UI.
  // You may need to clear browser history/cache before your changes take affect.

  /**
   * Styles and colors
   *
   * In addition to the functional settings in this file,
   * you can edit the settings file in client/assets/scss/_settings.scss
   *
   * There you can edit settings to change look and feel such as colors, and other
   * basic style parameters.
   */

  /**
   * localhost is used here for same computer use only.
   * You will need to put a hostname or ip address here if you want to go to
   * view this app from another machine.
   *
   * To use https set the https server key and certificate. And set use_https to true.
   */
  host: 'http://localhost',
  port:'8764',

  proxy_allow_self_signed_cert: false, // Only turn on if you have a self signed proxy in front of fusion.

  // Serve View via https.
  // use_https: true,
  // https: {
  //   key: 'path/to/your/server.key',
  //   cert: 'path/to/your/server.crt'
  // },

  /**
   * The name of the realm to connect with
   *   default: 'native'
   */
  connection_realm: 'native',

  /**
   * Anonymous access
   *
   * To allow anonymous access add a valid username and password here.
   *
   * SECURITY WARNING
   * It is recommended you use an account with the 'search' role
   * to use anonymous access.
   */
  anonymous_access: {
    username: 'search-user',
  //  password: 'search-user-password-here'
  },

  // The name of your collection
  collection: 'os_prod',

  // Please specify a pipeline or profile that you want to leverage with this UI.
  query_pipeline_id: 'os_prod-with-rules',
  query_profile_id: 'default',
  use_query_profile: false, // Force use of query-profile

  // Search UI Title
  // This title appears in a number of places in the app, including page title.
  // In the header it is replaced by the logo if one is provided.
  search_app_title: 'Lucidworks View',
  // Specify the path to your logo relative to the root app folder.
  // Or use an empty string if you don't want to use a logo.
  // This file is relative to the client folder of your app.
  logo_location: 'assets/img/logo/lucidworks-white.svg',

  /**
   * Document display
   * Fusion seed app is set up to get you started with the following field types.
   * web, local file, jira, slack, and twitter.
   *
   * Customizing document display.
   * You can add your own document displays with Fusion Seed App. You will have to
   * write an html template and add a new directive for your document type.
   * @see https://github.com/lucidworks/lucidworks-view/blob/master/docs/Customizing_Documents.md
   *
   * If you want to edit an existing template for a datasource you can edit the html for that document type in the
   * client/assets/components/document folder.
   */

  /**
   * Default Document display
   *
   * This applies only to document displays that are not handled by the handful of
   * document templates used above.
   *
   * These parameters change the fields that are displayed in the fallback document display.
   * You can also add additional fields by editing the document template.
   * Default Document template is located at:
   *   your_project_directory/client/assets/components/document/document_default/document_default.html
   */
  //In search results, for each doc, display this field as the head field
  head_field: 'Name',
  subhead_field: 'ProductID',
  description_field: 'description',
  //In search results, for each doc, use this field to generate link value when a user clicks on head_field
  head_url_field: 'url',
  //In search results, display a image in each doc page (leave empty for no image).
  image_field: 'image',

  // ADDING ADDITIONAL FIELDS TO DEFAULT DOCUMENTS
  //
  // There are 2 ways to add additional fields to the ui.
  // You can either use settings to create a simple list of values with field
  // names or you can edit the html/css, which is far more robust and allows
  // for more customization.
  //
  // SIMPLE CONFIG BASED FIELD DISPLAY
  //
  // This is the simpler option, but wont look as good.
  // It creates a list of field names next to field results
  // in the format of:
  // field label: field result
  //
  // In order to add items to the list you must add the fields to
  // fields_to_display. You can change the label of any field by adding a
  // field mapping in field_display_labels. You can optionally use a wildcard '*'
  // to display all fields.
  //
  // FLEXIBLE HTML FIELD DISPLAY
  //
  // For more advanced layouts edit the document template this provides a great
  // deal of flexibility and allows you to add more complex logic to your results.
  // You are able to use basic javascript to show hide, or alter the display of
  // any or multiple results.
  //
  // The HTML/Angular template is located in the following directory:
  //    your_project_directory/client/assets/components/document/document.html
  fields_to_display:['title','id','name'],
  field_display_labels: {
    'name': 'Document Name',
    //'id': 'Identification Number'
    // you can add as many lines of labels as you want
  },

  /**
   * Number of documents shown per page, if not defined will default to 10.
   */
  // docs_per_page: 10,

  /**
   * Landing pages
   *
   * Fusion allows mapping of specific queries links (or other data) with its
   * landing pages QueryPipeline stage.
   *
   * Default: Do not redirect but show a list of urls that a user can go to.
   */

  // If enabled and a landing page is triggered via a query, the app will redirect
  // the user to the url provided.
  landing_page_redirect: false,

  /**
   * Sorts
   *
   * A list of field names to make available for users to sort their results.
   *
   * NOTE: Only non multi-valued fields are able to be sortable.
   *
   * In order to sort on a multi-valued field you will have to fix the schema
   * for that field and recrawl the data
   */
  //sort_fields: ['title'],

  /**
   * Signals
   *
   * Allow the collection of data regarding search results. The most typical use
   * case is to track click signals for a collection.
   */
  // Signal type for title click.
  signal_type: 'click',
  // This specifies the index pipeline that will be used to submit signals.
  signals_pipeline: '_signals_ingest', // '_signals_ingest' is the fusion default.
  // Should be a unique field per document in your collection.
  // used by signals as a reference to the main collection.
  signals_document_id: 'id',

  /**
   * Typeahead
   *
   * Typeahead or autocomplete shows you a number of suggested queries as you
   * type in the search box.
   */
  typeahead_use_query_profile: true,
  typeahead_query_pipeline_id: 'default',
  typeahead_query_profile_id: 'default',
  typeahead_fields: ['id'],
  // The request handler defines how typeahead gets its results.
  // It is recommended to use suggest as it is more performant.
  // It will require some additional configuration.
  // @see https://lucidworks.com/blog/2016/02/04/fusion-plus-solr-suggesters-search-less-typing/

  //typeahead_requesthandler: 'suggest', // recommended (requires configuration)
  typeahead_requesthandler: 'select',

  rules: {
    collection: 'os_prod_rules',

    tags: [
      "PROD", "TEST", "SIMULATION", "MOBILE"
    ],

    types: {
      "Filter List": "filter_list",
      "Block List": "block_list",
      "Boost List": "boost_list",
      "Redirect": "response_value",
      "Banner": "response_value",
      "Set Params": "set_params"
    },

    set_params: {
      policies : {
        "append": "Append",
        "replace": "Replace"
      }
    },

    documentFields: {
      "CategoryID": "CategoryID",
      "ProductID": "ProductID",
      "ProductIDSearch": "ProductIDSearch",
      "name": "Name",
      "brand": "Brand"
    }
  },

  simulation: {
//***If you don't know what you want for some configuration items, leave them as-is and see what happens in UI.
//***You will need to clear browser history/cache before your changes take affect.
    collection: 'os_prod', //Please specify your collection name
    pipelineIdList: 'os_prod-with-rules,os_prod-default', //Please specify comma-separated list of the pipeline(s) that you want to leverage with this UI. NO SPACES.
//1st pipeline will be default,2nd pipeline could be signal-enabled.  Add other pipelines if desired.
//If you only have 1 query pipeline, that is ok too.
    requestHandlerList: 'select,autofilter', //This specifies the list of requestHandlers that the main doSearch() will use.
    addl_params: '', //Specify any additional query params you want to include as part of doSearch(),

    searchAppTitle: "bluestem search", //Search UI Title
    searchAppSubtitle: "rules demonstration", //Search UI Title
    head_field: 'Name', //In search results, for each doc, display this field as the head field
    head_url_field: '', //In search results, for each doc, use this field to generate link value when a user clicks on head field
    thumbnail_enabled: false, //In search results, display a thumbnail with each doc
    thumbnail_field: 'image', //In search results, for each doc, use this field to get thumbnail URL.

    facet_panel_image: "extras/cart.png", //Image that appears on the left when you initially load searchUI.
//Put image file in extras subfolder.  Suggest image 300px wide or greater.
//IMPORTANT: Make sure this fl list contains id and any fields you set for     head_field/head_url_field/thumb_field
    fl: 'Name,PhraseText,ProductID,Price-sort',

    fl2display: 'Name,PhraseText,ProductID,Price-sort',
//This needs to be a subset of     fl.  No spaces please.
    always_display_field: true, //Set this to true if you want to always display field in the results list even when it has empty value

    signalNum: 100, //# of signals for demo signal submit
    signalType: 'click', //Default signal type
    signals_pipeline: '_signals_ingest', //This specifies the index pipeline that submitSignals() uses to submit signals (simulated clicks)

    UIOptions_enabled: true, //Set to true to make UIOptions button visible
    geofield: '', //Specify a location field here if you want to enable geospatial search.  Specify EMPTY value if your collection DOES NOT have geospatial data
    distance: '10', //Default distance value in km for geospatial search

//***Each '_enabled' value below can be changed on the UI***
    query_info_enabled: false, //Set to true if you want to display query info
    search_within_results_enabled: false, //Set to true if you want search with results enabled by default
    stats_enabled: false, //Set to true if you want stats enabled by default

    /*

     // If you want spell check make sure this requestHandler and dictionary are configured in solrconfig.xml
     spellCheck: {
     requestHandler: 'spell',
     dictionary: 'default_text'
     },
     */

//***typeahead is auto complete feature in UI
    typeahead_retrieve_num: 5, //Number of suggestions to retrieve from any typeahead mechanisms below

    typeahead_terms_enabled: true, //Enable terms mechanism to do typeahead
    field_fq_enabled: false, //When using terms mechanism, set this to true if you want to include field name when doing auto complete
    typeahead_terms_requesthandler: 'terms',
    typeahead_terms_fl: 'suggestions',
    typeahead_suggester1_enabled: false, //Set to true if you want to enable this by default.  You can always change it in the UI.
    typeahead_suggester1_dictionary: 'InfixSuggester_name', //Please make sure this dictionary is configured in solrconfig.xml if you plan to use this suggester
    typeahead_suggester_requesthandler: 'suggest', //Please make sure this requestHandler is configured in solrconfig.xml if you plan to use suggester

    typeahead_suggester2_enabled: false, //Set to true if you want to enable this by default.  You can always change it in the UI.
    typeahead_suggester2_dictionary: 'InfixSuggester_artistName', //Please make sure this dictionary is configured in solrconfig.xml if you plan to use this suggester

    typeahead_logs_collection_enabled: false, //Set to true if you want to enable this by default.  You can always change it in the UI.

    typeahead_signals_collection_enabled: false, //Set to true if you want to enable this by default.  You can always change it in the UI.
//***END OF typeahead mechanisms

//***BEGINNING OF $rootScope.lwlabels
//If you want to display friendly labels for any field name, then add a line for each field name below.
//For example, for 'cuisine' field name, replace it with 'Cuisine' in the UI
    labels: {
      'artistName_s': 'Artist Name',
      'genre_s': 'Genre',
      'format_s': 'Format',
      'class_s': 'Class',
      'subclass_s': 'Sub Class',
      'department_s': 'Department',
      'manufacturer_s': 'Manufacturer',
      'salePrice': 'Sale Price',
      'shortDescription': 'Description',
      'coupon': 'Coupon',
      'likes': 'Likes',
      'last_modified_date': 'Last Modified'
    }

  }
};
