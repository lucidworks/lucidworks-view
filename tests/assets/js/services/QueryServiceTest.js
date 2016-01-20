ngDescribe({
  name: 'QueryService',
  modules: 'application',
  inject: ['ConfigService', 'QueryService', '$httpBackend'],
  http:{
    get:{
      'templates/home.html': ''
    }
  },
  tests: function(deps){
    describe('it should make the right call', function(){
      it('with the right query', function(){
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/collections/Coll/query-profiles/default/select?q=hello').respond({'key':'value'});
        deps.QueryService.getQuery({
          q: 'hello'
        }).then(function(resp){
          expect(resp.data).toEqual({'key':'value'});
        });
        deps.step();
      });

      it('with the right query with multiple query params', function(){
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/collections/Coll/query-profiles/default/select?q=hello&fq=hello2u2').respond({'key':'value'});
        deps.QueryService.getQuery({
          q: 'hello',
          fq: 'hello2u2'
        }).then(function(resp){
          expect(resp.data).toEqual({'key':'value'});
        });
        deps.step();
      });
    });

    describe('it should make the right call with query pipelines as well', function(){
      it('with the right query', function(){
        deps.ConfigService.init({use_query_profile: false});
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/query-pipelines/default/collection/Coll/select?q=hello').respond({'key':'value'});
        deps.QueryService.getQuery({
          q: 'hello'
        }).then(function(resp){
          expect(resp.data).toEqual({'key':'value'});
        });
        deps.step();
      });

      it('with the right query with multiple query params', function(){
        deps.ConfigService.init({use_query_profile: false});
        deps.$httpBackend.expectGET('http://localhost:8764/api/apollo/query-pipelines/default/collection/Coll/select?q=hello&fq=hello2u2').respond({'key':'value'});
        deps.QueryService.getQuery({
          q: 'hello',
          fq: 'hello2u2'
        }).then(function(resp){
          expect(resp.data).toEqual({'key':'value'});
        });
        deps.step();
      });
    });
  }
});
