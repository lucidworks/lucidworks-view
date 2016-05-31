/*global ngDescribe, describe, it, expect, angular*/
ngDescribe({
  name: 'QueryBuilder',
  modules: 'lucidworksView.utils.queryBuilder',
  inject: ['QueryBuilder'],
  tests: function (deps) {
    describe('urls should be created from objects.', function(){
      it('should turn a flat object into a string', function(){
        var obj = {q: 'test', start: 0, rows: 10, wt: 'json'};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=test&start=0&rows=10&wt=json');
      });
      it('should turn hash tags into uri encoded components', function(){
        var obj = {q: '#1', start: 0, rows: 10, wt: 'json'};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=%231&start=0&rows=10&wt=json');
        obj = {q: '1#2#3', start: 0, rows: 10, wt: 'json'};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=1%232%233&start=0&rows=10&wt=json');
      });
    });
    describe('transformers should be registered', function() {
      it('should be able to register keyValue transformers', function(){
        deps.QueryBuilder.registerTransformer('keyValue', 'test', keyValueTransformerFunc);
        function keyValueTransformerFunc(key, value){
          return key +'!!!'+ value;
        }
        var obj = {q: '#1', start: 0, rows: 10, wt: 'json', fq: [{key: 'department', transformer: 'test', values: ['VIDEO/COMPACT DISC']}]};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=%231&start=0&rows=10&wt=json&fq=department!!!VIDEO/COMPACT DISC');
      });
      it('should be able to register preEncodeWrapper transformers', function(){
        deps.QueryBuilder.registerTransformer('preEncodeWrapper', 'test', preEncodeWrapperTransformerFunc);
        function preEncodeWrapperTransformerFunc(data){
          return '!!!'+data+'!!!';
        }
        var obj = {q: '#1', start: 0, rows: 10, wt: 'json', fq: [{key: 'department', transformer: 'test', values: ['VIDEO/COMPACT DISC']}]};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=%231&start=0&rows=10&wt=json&fq=department=!!!VIDEO/COMPACT DISC!!!');
      });
      it('should be able to register encode transformers', function(){
        deps.QueryBuilder.registerTransformer('preEncodeWrapper', 'test', preEncodeWrapperTransformerFunc);
        deps.QueryBuilder.registerTransformer('encode', 'test', encodeTransformerFunc);
        function preEncodeWrapperTransformerFunc(data){
          return '!!!'+data+'!!!';
        }
        function encodeTransformerFunc(data){
          return 'XXX'+data+'XXX';
        }
        var obj = {q: '#1', start: 0, rows: 10, wt: 'json', fq: [{key: 'department', transformer: 'test', values: ['VIDEO/COMPACT DISC']}]};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=%231&start=0&rows=10&wt=json&fq=department=XXX!!!VIDEO/COMPACT DISC!!!XXX');
      });
      it('should be able to register wrapper transformers', function(){
        deps.QueryBuilder.registerTransformer('preEncodeWrapper', 'test', preEncodeWrapperTransformerFunc);
        deps.QueryBuilder.registerTransformer('encode', 'test', encodeTransformerFunc);
        deps.QueryBuilder.registerTransformer('wrapper', 'test', wrapperTransformerFunc);
        function preEncodeWrapperTransformerFunc(data){
          return '!!!'+data+'!!!';
        }
        function encodeTransformerFunc(data){
          return 'XXX'+data+'XXX';
        }
        function wrapperTransformerFunc(data){
          return '['+data+']';
        }
        var obj = {q: '#1', start: 0, rows: 10, wt: 'json', fq: [{key: 'department', transformer: 'test', values: ['VIDEO/COMPACT DISC']}]};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=%231&start=0&rows=10&wt=json&fq=department=[XXX!!!VIDEO/COMPACT DISC!!!XXX]');
      });
      it('should be able to register join transformers', function(){
        deps.QueryBuilder.registerTransformer('preEncodeWrapper', 'test', preEncodeWrapperTransformerFunc);
        deps.QueryBuilder.registerTransformer('encode', 'test', encodeTransformerFunc);
        deps.QueryBuilder.registerTransformer('wrapper', 'test', wrapperTransformerFunc);
        deps.QueryBuilder.registerTransformer('join', 'test', joinTransformerFunc);
        function preEncodeWrapperTransformerFunc(data){
          return '!!!'+data+'!!!';
        }
        function encodeTransformerFunc(data){
          return 'XXX'+data+'XXX';
        }
        function wrapperTransformerFunc(data){
          return '['+data+']';
        }
        function joinTransformerFunc(str, arr){
          var join = '~';
          if(angular.isString(arr)){
            return str + join + arr;
          }
          return _.reduce(arr, arrayJoinStringReducer, str);
          function arrayJoinStringReducer(str, value){
            return str + ((str!=='')?join:'') + value;
          }
        }
        var obj = {q: '#1', start: 0, rows: 10, wt: 'json', fq: [{key: 'department', transformer: 'test', values: ['VIDEO/COMPACT DISC', 'LASERCAT']}]};
        expect(deps.QueryBuilder.objectToURLString(obj)).toEqual('q=%231&start=0&rows=10&wt=json&fq=department=[XXX!!!VIDEO/COMPACT DISC!!!XXX]~department=[XXX!!!LASERCAT!!!XXX]');
      });
    });
    describe('helper functions should help transform', function(){
      it('should escape special characters used in lucene', function(){
        expect(deps.QueryBuilder.escapeSpecialChars('string + - && { } has special chars ? * ||')).toEqual('string \\+ \\- \\\&\\\& \\{ \\} has special chars \\? \\* \\|\\|');
      });
      it('should be able to encode URI components with plusses', function(){
        expect(deps.QueryBuilder.encodeURIComponentPlus('string % $ has spaces')).toEqual('string+%25+%24+has+spaces');
      });
      it('should help build key value string', function(){
        expect(deps.QueryBuilder.keyValueString('key', 'value', 'join')).toEqual('keyjoinvalue');
      });
      it('should help build an array joined string', function(){
        expect(deps.QueryBuilder.arrayJoinString('', ['in','the','array'], '~')).toEqual('in~the~array');
        expect(deps.QueryBuilder.arrayJoinString('thisIsAString', ['in','the','array'], '~')).toEqual('thisIsAString~in~the~array');
      });
    });
  }
});
