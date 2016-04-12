/*global ngDescribe, describe, it, expect*/
ngDescribe({
  name: 'QueryService',
  modules: 'lucidworksView.services',
  inject: ['ConfigService', 'QueryDataService', 'ApiBase', '$httpBackend'],
  http:{
    get:{
      'templates/home.html': ''
    }
  },
  tests: function(deps){
    beforeEach(function(){
      deps.ConfigService.init(window.appConfig);
      deps.ApiBase.setEndpoint(deps.ConfigService.getFusionUrl());
    });

    describe('it should make the right call', function(){
      it('with the right query', function(){
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/collections/MyCollection/query-profiles/default/select?q=hello&wt=json').respond({'key':'value'});
        deps.QueryDataService.getQueryResults({
          q: 'hello',
          wt: 'json'
        }).then(function(resp){
          expect(resp).toEqual({'key':'value'});
        });
        deps.step();
      });

      it('with the right query with multiple query params', function(){
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/collections/MyCollection/query-profiles/default/select?q=hello&fq=hello2u2&wt=json').respond({'key':'value'});
        deps.QueryDataService.getQueryResults({
          q: 'hello',
          fq: 'hello2u2',
          wt: 'json'
        }).then(function(resp){
          expect(resp).toEqual({'key':'value'});
        });
        deps.step();
      });
    });

    describe('it should make the right call with query pipelines as well', function(){
      it('with the right query', function(){
        deps.ConfigService.init({use_query_profile: false});
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/query-pipelines/default/collections/MyCollection/select?q=hello&wt=json').respond({'key':'value'});
        deps.QueryDataService.getQueryResults({
          q: 'hello',
          wt: 'json'
        }).then(function(resp){
          expect(resp).toEqual({'key':'value'});
        });
        deps.step();
      });

      it('with the right query with multiple query params', function(){
        deps.ConfigService.init({use_query_profile: false});
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/query-pipelines/default/collections/MyCollection/select?q=hello&fq=hello2u2&wt=json').respond({'key':'value'});
        deps.QueryDataService.getQueryResults({
          q: 'hello',
          fq: 'hello2u2',
          wt: 'json'
        }).then(function(resp){
          expect(resp).toEqual({'key':'value'});
        });
        deps.step();
      });
    });
  }
});
