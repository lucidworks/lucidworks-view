# How to use query builder

Query builder creates query strings from an object.

### First level of a query object:
this is where you can define different options which will be joined
together by standard query syntax.

An object when passed through objectToURLString will return a string:

object
```
{aa: 'abcd', bb: 'defg'}
```
string
```
aa=abcd&bb=defg
```
What makes query builder so powerful is when you dig a bit deeper,

### Second level of a query object and beyond
Acceptable types: ```string```, ```array```, ```key value object```

- ```array```
 -  each element is run through the reducer.
- ```string```
 - Will be concatenated to the query string
- ```key value object```
 - A key and value pair that will be concatenated together.

## Transformers
types: ```preEncodeWrapper```, ```encode```, ```wrapper```, ```keyValue```, ```join```,

Transformers enable you to extend query builder. by using different syntax to join or mutate data.

Each step runs in order, transforming the data at each step.

Transformers are called on each step of a reduction of a key value object.

1. preEncodeWrapper (default = no transformation)
  - Wraps the output before encode is run.
  - Ex: used in facetField for adding inner quotes to a value.
2. encode (default = no transformation)
  - encodes the data into another format.
  - Ex: used in facetField to encode the value into a uri encoded component.
3. wrapper (default = no transformation)
  - wraps the data after encode has been called.
  - Ex. in facetField adds braces around a value
4. keyValue (default = '=')
  - The joins the key value the rest of the query
  - joins a key and a value.
  - Ex. in facetField it joins a key and a value with ':'
5. join (default = '')
  - Joins the key value to the rest of the query string.
  - Ex. in faceField it joins a the key value with ''


First the preEncodeWrapper is run, It Transforms the

  keyValue pair is run, which transforms the syntax into key value pair syntax.

For example on the first level things are typically joined via =. Which effectively runs the following.
 ```
  key + '=' + value
```
You can use the keyValueString helper function to make this easier and consistent.
