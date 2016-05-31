/*global ngDescribe, describe, it, expect*/
ngDescribe({
  name: 'ConfigService',
  modules: 'lucidworksView.services',
  inject: ['ConfigService'],
  tests: function(deps){
    describe('specific little properties getter should be working', function(){
      it('should make the right fusion url', function(){
        deps.ConfigService.init({
          host: 'http://localhost',
          port: '8764'
        });
        expect(deps.ConfigService.getFusionUrl()).toEqual('http://localhost:8764/');
      });
    });

    describe('getSpecificFields() should be working', function(){
      it('with specific field getters', function(){
        deps.ConfigService.init({
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.get('thumbnails_field')).toEqual('thumb_url');
      });

      it('and null when blank', function(){
        deps.ConfigService.init({
          thumbnails_field: ''
        });
        expect(deps.ConfigService.getFields.get('thumbnails_field')).toEqual(null);
      });
    });

    describe('getAllFields() with existing config properties',function(){
      it('should return  proper value', function(){
        deps.ConfigService.init({
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.all().thumbnails_field).toEqual('thumb_url');
      });

      it('should return nothing if it\'s blank and enabled', function(){
        deps.ConfigService.init({
          thumbnails_field: ''
        });
        expect(deps.ConfigService.getFields.all().thumbnails_field).toEqual(undefined);
      });
    });
  }
});
