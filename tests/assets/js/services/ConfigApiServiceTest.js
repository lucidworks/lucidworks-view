ngDescribe({
  name: 'ConfigApiService',
  modules: 'fusionSeedApp.services',
  inject: ['ConfigApiService'],
  tests: function(deps){
    describe('getAllFields() with existing config properties',function(){
      it('should return according to the _enabled=true', function(){
        window.appConfig = {
          thumbnails_enabled: true,
          thumbnails_field: 'thumb_url'
        };
        deps.ConfigApiService.init();
        expect(deps.ConfigApiService.getFields.all().thumbnails_field).toEqual('thumb_url');
      });

      it('should return nothing according to the _enabled=false', function(){
        window.appConfig = {
          thumbnails_enabled: false,
          thumbnails_field: 'thumb_url'
        };
        deps.ConfigApiService.init();
        expect(deps.ConfigApiService.getFields.all().thumbnails_field).toEqual(undefined);
      });

      it('should return nothing if it\'s blank and enabled', function(){
        window.appConfig = {
          thumbnails_enabled: true,
          thumbnails_field: ''
        };
        deps.ConfigApiService.init();
        expect(deps.ConfigApiService.getFields.all().thumbnails_field).toEqual(undefined);
      });
    });
  }
});
