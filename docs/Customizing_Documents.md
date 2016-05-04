# How to customize documents

Lucidworks View lets you customize the display of different document types, which correspond to datasources in Fusion.  It includes built-in templates to display some of the most common document types:

- `document_file` (filesystem)
- `document_jira` (repository)
- `document_slack` (social)
- `document_twitter` (social)
- `document_web` (web)

All templates are located in the ```client/assets/components/document``` folder.

## Default document display

There's also a `document_default` template to display any document type that doesn't match the above.  You can configure this template in `FUSION_CONFIG.js` to expose different fields, depending on your data.  

Open `FUSION_CONFIG.js` and scroll to this line to see the available options:

```
   * Document_default display
```

## Adding custom document types

You can add new document types by

1. creating a new document component and
2. modifying the `getDocType` function to trigger your template.

### Creating a new document component
1. Copy one of the existing template directories and give it a name like `document_<mydoctype>`.
1. Give the files in the new directory names that match the directory name, like this:

  ```
  _document_<mydoctpe>.scss
  document_<mydoctype>.html
  document_<mydoctype>.js
  ```

  See the `client/assets/components/document/document_EXAMPLE` directory for an example.

1. Customize the templates as needed.
  At a minimum, you _must_ modify the following values in `document_<mydoctype>.js`:

  * `module`
  * `directive`
  * `templateURL`

  For more information about customizing Angular templates, see https://code.angularjs.org/1.4.8/docs/guide/templates.

1. Add the value of `module` to the list in ```client/assets/components/components.js```.

1. Add the value of `directive` to ```client/assets/components/documentList/documentList.html```.
  * You will need to add the value in 2 places in this file. Once in the first list, and once in the grouped results section, if you want the doc type to show up when you have regular and grouped results.

### Modifying the getDocType function

The `getDocType` method specifies the data field that the app uses to select a template.  The default is `_lw_data_source_type_s`, but you can add conditional statements to read additional fields.

1. Open ```client/assets/components/documentList/documentList.js``` and locate this section:

  ```javascript
  /**
   * Get the document type for the document.
   * @param  {object} doc Document object
   * @return {string}     Type of document
   */
  function getDocType(doc){
    // Change to your collection datasource type name
    // if(doc['_lw_data_source_s'] === 'MyDatasource-default'){
    //   return doc['_lw_data_source_s'];
    // }
    return doc['_lw_data_source_type_s'];
  }
  ```
1. Uncomment the `if` statement.
1. Replace `_lw_data_source_s` with the name of a field from your data.
1. Replace `MyDatasource-default` with the name of your template.
