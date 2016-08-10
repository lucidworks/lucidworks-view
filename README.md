# Lucidworks Rules


## Requirements

- [Fusion](https://doc.lucidworks.com/): If you need help setting up Fusion, see https://doc.lucidworks.com/.
- [Node.js](http://nodejs.org): Use the installer for your OS. Use version 5.xxx.
- [Git](http://git-scm.com/downloads) (if you're cloning the repo): Use the installer for your OS.
- Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
- [Bower](http://bower.io): Run `npm install -g bower`

## Get Started

1. Clone the repository, where `app` is the name of your app:

  ```bash
  git clone https://github.com/AlexKolonitsky/lucidworks-view app
  ```

1. Change into the directory:

  ```bash
  cd app/rules
  ```

1. Install the dependencies:

  ```bash
  npm install
  bower install
  ```

1. Set up fusion collections:

  ```bash
  #!/usr/bin/env bash
  export FUSION_HOME=$HOME/fusion-2.1.3
  export FUSION_API_BASE=http://localhost:8764/api/apollo
  export SOLR_API_BASE=http://localhost:8983/solr
  export FUSION_API_CREDENTIALS=admin:123qweasdzxc

  # create products collection
  curl -u $FUSION_API_CREDENTIALS -X PUT -H 'Content-type: application/json' \
       -d '{"solrParams":{"replicationFactor":1,"numShards":1}}' \
       ${FUSION_API_BASE}/collections/os_prod

  # Adjust schema to allow attr-* fields to be strings rather than autodetected
  curl -X POST -H 'Content-type:application/json' --data-binary '{
    "add-dynamic-field":{
       "name":"attr-*",
       "type":"string",
       "multiValued":true,
       "stored":false }
  }' $SOLR_API_BASE/os_prod/schema

  # set up -with-products pipeline for products (os_prod) collection
  curl -u $FUSION_API_CREDENTIALS -X DELETE ${FUSION_API_BASE}/query-pipelines/os_prod-with-rules
  curl -u $FUSION_API_CREDENTIALS -X POST -H 'Content-type: application/json' -d @os_prod-with-rules-query-pipeline.json ${FUSION_API_BASE}/query-pipelines


  # upload products data
  $FUSION_HOME/apps/solr-dist/bin/post -c os_prod -params "rowid=id&csv.mv.separator=~&csv.mv.encapsulator=%60&f.PhraseText.split=true&f.Category-search.split=true&f.CategoryID.split=true&f.CategoryID.separator=~&f.Color-search.split=true&f.attr-__General__LNav_Colors.split=true&f.ImageData.split=true&f.attr-__General__LNavColorCategory.split=true&skip=_version_,Brand-search,Color-search,Category-no_stem,Name-search,Name-no_stem,Name-sort,Price-search,PricePerMonth-search,ProductID-search,autoPhrase_text,LastIndexed,_text_" products.csv

  # create rules collection (specific to the example products)
  curl -u $FUSION_API_CREDENTIALS -X PUT -H 'Content-type: application/json' \
       -d '{"solrParams":{"replicationFactor":1,"numShards":1}}' \
       ${FUSION_API_BASE}/collections/os_prod_rules

  # upload rules data
  $FUSION_HOME/apps/solr-dist/bin/post -c os_prod_rules rules.json
  ```

1. All configuration such as fusion url, available rule types or documents fields should be made in FUSION_CONFIG.js

1. Run application:

  ```bash
  npm start
  ```
