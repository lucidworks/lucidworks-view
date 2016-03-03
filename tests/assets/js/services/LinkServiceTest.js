/*global ngDescribe, describe, it, expect, beforeEach*/
ngDescribe({
  name: 'LinkService',
  modules: 'fusionSeedApp.services',
  inject: ['LinkService', '$rison', '$state', '$location', 'QueryService'],
  mocks: {
    ng:{
      $location: {
        search: function(){
          return {query: '(somerawquery:blah)'};
        }
      },
      $state: {
        go: function(){}
      }
    }
  },
  tests: function(deps){
    beforeEach(function(){
      spyOn(deps.$rison, 'stringify').and.callThrough();
      spyOn(deps.$rison, 'parse').and.callThrough();
      spyOn(deps.$state, 'go').and.callThrough();
      spyOn(deps.$location, 'search').and.callThrough();
      spyOn(deps.QueryService, 'setQuery');
    });

    it('getQueryFromUrl should make the proper calls', function(){
      var stuff = deps.LinkService.getQueryFromUrl();
      expect(deps.$location.search).toHaveBeenCalled();
      expect(deps.$rison.parse).toHaveBeenCalledWith('(somerawquery:blah)');
      expect(stuff).toEqual({somerawquery:'blah'});
    });

    it('setQuery should make the right calls as well', function(){
      deps.LinkService.setQuery({});
      expect(deps.$state.go).toHaveBeenCalledWith('home', {query:'(q:\'*:*\',rows:10,start:0,wt:json)'}, {notify: false, reloadOnSearch: false});
      expect(deps.$rison.stringify).toHaveBeenCalledWith({
        q:'*:*',
        rows: 10,
        start: 0,
        wt: 'json'
      });
    });
  }
});
