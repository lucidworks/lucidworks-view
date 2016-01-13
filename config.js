var window.fusion_config = {
  //***BEGINNING OF CONFIGURATION***
  //***PLEASE ADJUST CONFIGURATION HERE***
  //***If you don't know what you want for some configuration items, leave them as-is and see what happens in UI.
  //***You will need to clear browser history/cache before your changes take affect.

  // window.location.hostname is used here if UI on same Jetty as Fusion.  If not, please specify Fusion hostname here.
  host: 'http://' + window.location.hostname,
  // Fusion port
  port:'8764',

  // Allow anyone to use this search app without logging in.
  //
  //authorizationHeader: {headers: {'Authorization': 'Basic ' + btoa('admin:password123')}};
  AllowAnonymousAccess: true,
  // If allow AllowAnonymousAccess is set to true these fields must also be set.
  // WARNING: using this in a production app is not recommended.
  user: admin,
  password: password123,

  // The name of your collection
  collection: 'POI',

  //Please specify a list of the pipeline(s) that you want to leverage with this UI.
  // No Spaces.
  // 1st pipeline will be default,
  // 2nd pipeline could be signal-enabled.
  //
  // If you only have 1 query pipeline, that is ok too.
  pipelineIdList: [
    'POI-default,POI-signals'
  ],

  // This specifies list of requestHandler(s)
  requestHandlerList: 'select,autofilter';
  $rootScope.lw.addl_params = ''; //Specify any additional query params you want to include as part of doSearch();

  $rootScope.lw.searchAppTitle = "Points of Interest Search"; //Search UI Title
  $rootScope.lw.head_field = 'name'; //In search results, for each doc, display this field as the head field
  $rootScope.lw.head_url_field = 'coord'; //In search results, for each doc, use this field to generate link value when a user clicks on head field
  $rootScope.lw.thumbnail_enabled = true; //In search results, display a thumbnail with each doc
  $rootScope.lw.thumbnail_field = 'coord'; //In search results, for each doc, use this field to get thumbnail URL.

  $rootScope.lw.facet_panel_image = "extras/killer-app.png"; //Image that appears on the left when you initially load searchUI.
                                                             //Put image file in extras subfolder.  Suggest image 300px wide or greater.
  //IMPORTANT: Make sure this fl list contains id and any fields you set for $rootScope.lw.head_field/head_url_field/thumb_field
  $rootScope.lw.fl = 'name,amenity,cuisine,city,street,description,id,coord,likes,last_modified_date'; //List of fields to retrieve when querying Fusion. No spaces please.

  $rootScope.lw.fl2display = 'name,amenity,cuisine,city,street,description,likes,last_modified_date'; //List of fields to display in UI, in the order listed.
                                                                //This needs to be a subset of $rootScope.lw.fl.  No spaces please.
  $rootScope.lw.always_display_field = false; //Set this to true if you want to always display field in the results list even when it has empty value

  $rootScope.lw.signalNum = 100; //# of signals for demo signal submit
  $rootScope.lw.signalType = 'click'; //Default signal type
  $rootScope.lw.signals_pipeline = '_signals_ingest'; //This specifies the index pipeline that submitSignals() uses to submit signals (simulated clicks)

  $rootScope.lw.UIOptions_enabled = true; //Set to true to make UIOptions button visible
  $rootScope.lw.geofield = 'coord'; //Specify a location field here if you want to enable geospatial search.  Specify EMPTY value if your collection DOES NOT have geospatial data
  $rootScope.lw.distance = '10'; //Default distance value in km for geospatial search

  //***Each '_enabled' value below can be changed on the UI***
  $rootScope.lw.query_info_enabled = false; //Set to true if you want to display query info
  $rootScope.lw.search_within_results_enabled = false; //Set to true if you want search with results enabled by default
  $rootScope.lw.stats_enabled = false; //Set to true if you want stats enabled by default

  $rootScope.lw.spellcheck_enabled = false; //Set to true if you want spellcheck enabled by default
  $rootScope.lw.spellcheck_requesthandler = 'spell'; //Please make sure this requestHandler is configured in solrconfig.xml if you plan to use spellcheck
  $rootScope.lw.spellcheck_dictionary = 'default_text'; //Please make sure this dictionary is configured in solrconfig.xml if you plan to use spellcheck

  //***typeahead is auto complete feature in UI
  $rootScope.lw.typeahead_retrieve_num = 5; //Number of suggestions to retrieve from any typeahead mechanisms below

  $rootScope.lw.typeahead_terms_enabled = true; //Enable terms mechanism to do typeahead
  $rootScope.lw.field_fq_enabled = false; //When using terms mechanism, set this to true if you want to include field name when doing auto complete
  $rootScope.lw.typeahead_terms_requesthandler = 'terms';
  $rootScope.lw.typeahead_terms_fl = 'suggestions';

  $rootScope.lw.typeahead_suggester1_enabled = false; //Set to true if you want to enable this by default.  You can always change it in the UI.
  $rootScope.lw.typeahead_suggester1_dictionary = 'Suggester_name'; //Please make sure this dictionary is configured in solrconfig.xml if you plan to use this suggester
  $rootScope.lw.typeahead_suggester_requesthandler = 'suggest'; //Please make sure this requestHandler is configured in solrconfig.xml if you plan to use suggester

  $rootScope.lw.typeahead_suggester2_enabled = false; //Set to true if you want to enable this by default.  You can always change it in the UI.
  $rootScope.lw.typeahead_suggester2_dictionary = 'Suggester_city'; //Please make sure this dictionary is configured in solrconfig.xml if you plan to use this suggester

  $rootScope.lw.typeahead_logs_collection_enabled = false; //Set to true if you want to enable this by default.  You can always change it in the UI.

  $rootScope.lw.typeahead_signals_collection_enabled = false; //Set to true if you want to enable this by default.  You can always change it in the UI.
  //***END OF typeahead mechanisms

  //***BEGINNING OF $rootScope.lwlabels
  //If you want to display friendly labels for any field name, then add a line for each field name below.
  //For example, for 'cuisine' field name, replace it with 'Cuisine' in the UI
  $rootScope.lw.labels = {
                          'cuisine': 'Cuisine',
                          'street': 'Street',
                          'coord': 'Coordinates',
                          'city': 'City',
                          'amenity': 'Amenity',
                          'likes': 'Likes',
                          'last_modified_date': 'Last Modified',
                         };
  //***END OF $rootScope.lw.labels
};
