# How to use query builder

Query builder creates query strings from an object.

## First level of a query object

This is where you can define different options which will be joined
together by standard query syntax.

An object when passed through `objectToURLString` will return a string:

* object:

  ```javascript
  {aa: 'abcd', bb: 'defg'}
  ```

* string:

  ```
  aa=abcd&bb=defg
  ```

## Second level of a query object and beyond

Acceptable types:

* string

  Will be concatenated to the query string.

* array

  Each element is run through the reducer.

* key value object

 A key/value pair that will be concatenated together.

 The values in a key/value pair can contain an array, a string, or even another key value object, allowing you to nest as many as you need to create your query.

## Transformers

Transformers enable you to extend query builder by using different syntax to join or mutate data.

Transformers are called on each step of a reduction of a key value object.  Each step runs in order, transforming the data at each step:

1. `preEncodeWrapper`
  - Wraps the output before encode is run.
  - Ex: Used in `facetField` for adding inner quotes to a value.
  - default = no transformation
2. `encode`
  - encodes the data into another format.
  - Ex: Used in `facetField` to encode the value into a URI-encoded component.
  - default = no transformation
3. `wrapper`
  - Wraps the data after `encode` has been called.
  - Ex. In `facetField`, adds braces around a value.
  - default = no transformation
4. `keyValue`
  - Joins a key and a value.
  - Ex. In `facetField`, it joins a key and a value with `:`.
  - default = '='
5. `join`
  - Joins the key/value to the rest of the query string.
  - Ex. In `facetField`, it joins a the key value with ''.
  - default = ''

### Writing your own transformers
You can add transformers in a service or in a module configuration. Just inject `QueryBuilderProvider` or `QueryBuilder`.

The `registerTransformer` function allows you to register any transformers you want for use. These are then used in a key/value object and are triggered via the `transformer` property of a key/value object.

Here's an example of registering a transformer:

```javascript
QueryBuilderProvider.registerTransformer('wrapper', 'fq:field', fqFieldWrapper);
function fqFieldWrapper(data){
  return '('+data+')';
}
```

Now every time an object has that transformer it will be output with that wrapper.

```javascript
{fq: [{
  key: 'name',
  value: 'value',
  transformer: 'fq:field'
}]}
```

if the above object just had that one transformer it would produce the string.

```
 fq=name(value)
```
