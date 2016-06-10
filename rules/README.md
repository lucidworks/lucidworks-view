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

1. Set up fusion collection:

  ```bash
  #!/usr/bin/env bash
  export FUSION_HOME=$HOME/fusion-2.1.3
  export FUSION_API_BASE=http://localhost:8764/api/apollo
  export SOLR_API_BASE=http://localhost:8764/api/apollo
  export ZK_HOST=localhost:9983
  export FUSION_API_CREDENTIALS=admin:123qweasdzxc
  
  # Adjust schema to allow attr-* fields to be strings rather than autodetected
  curl -X POST -H 'Content-type:application/json' --data-binary '{
    "add-dynamic-field":{
       "name":"attr-*",
       "type":"string",
       "multiValued":true,
       "stored":false }
  }' http://localhost:8983/solr/bsb_products/schema
  
  # products_rules: create collection (specific to the example products)
  curl -u $FUSION_API_CREDENTIALS -X PUT -H 'Content-type: application/json' \
       -d '{"solrParams":{"replicationFactor":1,"numShards":1}}' \
       ${FUSION_API_BASE}/collections/bsb_products_rules
  
  # push predefined rules collection 
  curl 'http://localhost:8983/solr/bsb_products_rules/update?commit=true' --data-binary @rules.json -H 'Content-type:application/js'  
  ```
  
  
1. Run application:

  ```bash
  npm start
  ```

