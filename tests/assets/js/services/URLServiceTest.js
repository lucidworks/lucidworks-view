/*global ngDescribe, describe, it, expect, spyOn, beforeEach*/
ngDescribe({
  name: 'URLService',
  modules: 'lucidworksView.services',
  inject: ['URLService', '$rison', '$state', '$location', 'QueryService'],
  mocks: {
    ng:{
      $location: {
        search: function(){
          return {query: '(somerawquery:blah,blah:(0:one,1:(notarray:fine,array:(0:click,1:noclick))))'};
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

    it('getQueryFromUrl should make the proper calls with proper parsing', function(){
      var stuff = deps.URLService.getQueryFromUrl();
      expect(deps.$location.search).toHaveBeenCalled();
      expect(deps.$rison.parse).toHaveBeenCalledWith('(somerawquery:blah,blah:(0:one,1:(notarray:fine,array:(0:click,1:noclick))))');
      expect(stuff).toEqual({somerawquery:'blah',blah:['one', {notarray: 'fine', array: ['click','noclick']}]});
    });

    it('setQuery should make the right calls as well', function(){
      deps.URLService.setQuery({});
      expect(deps.$state.go).toHaveBeenCalledWith('home', {query:'(q:\'*\',start:0,wt:json)'}, {notify: false, reloadOnSearch: false});
      expect(deps.$rison.stringify).toHaveBeenCalledWith({
        q:'*',
        start: 0,
        wt: 'json'
      });
    });
  }
});
