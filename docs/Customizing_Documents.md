# How to customize documents
Fusion seed app allows you to customize the display of different document types. By default there are custom displays for some of the most commonly used Fusion Connectors.

All documents are located in the filesystem in
 the ```client/assets/components/document``` folder

There are currently 4 default document types.

- local (filesystem)
- JIRA (repository)
- Twitter (social)
- Anda Web (web)
- Default (everything else)

You can edit the existing templates based on the datasource you use. Any datasource which does not match the the above, will be handled by the document_default template.
```client/assets/components/document/document_default ```

The default document type allows you to edit the config to expose different fields via your config file.

## Adding additional document types

The document type used to render the document is selected in the documentList component. You can add new document types by
1. creating a new component.
2. If necessary changing the getDocType function to trigger your template.

### Creating a new document component
1. Create a new component.
2. Register the module in ```client/assets/components/components.js```
3. Add the directive to ```client/assets/components/documentList/documentList.html```
4. If necessary modify the getDocType method in ```client/assets/components/documentList/documentList.js```.

```
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
