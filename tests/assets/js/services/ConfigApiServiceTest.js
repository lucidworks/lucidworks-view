ngDescribe({
  name: 'ConfigApiService',
  modules: 'fusionSeedApp.services',
  inject: ['ConfigApiService'],
  tests: function(deps){
    describe('specific little properties getter should be working', function(){
      it('should make the right fusion url', function(){
        deps.ConfigApiService.init({
          host: 'http://localhost',
          port: '8764'
        });
        expect(deps.ConfigApiService.getFusionUrl()).toEqual('http://localhost:8764');
      });
    });

    describe('getSpecificFields() should be working', function(){
      it('with specific field getters', function(){
        deps.ConfigApiService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigApiService.getFields.get('thumbnails_field')).toEqual('thumb_url');
      });

      it('and null when disabled', function(){
        deps.ConfigApiService.init({
          thumbnails_enabled: false,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigApiService.getFields.get('thumbnails_field')).toEqual(null);
      });

      it('and straight thru if not toggle explicitly', function(){
        deps.ConfigApiService.init({
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigApiService.getFields.get('thumbnails_field')).toEqual('thumb_url');
      });
    });

    describe('getAllFields() with existing config properties',function(){
      it('should return according to the _enabled=true', function(){
        deps.ConfigApiService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigApiService.getFields.all().thumbnails_field).toEqual('thumb_url');
      });

      it('should return nothing according to the _enabled=false', function(){
        deps.ConfigApiService.init({
          thumbnails_enabled: false,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigApiService.getFields.all().thumbnails_field).toEqual(undefined);
      });

      it('should return nothing if it\'s blank and enabled', function(){
        deps.ConfigApiService.init({
          thumbnails_enabled: true,
          thumbnails_field: ''
        });
        expect(deps.ConfigApiService.getFields.all().thumbnails_field).toEqual(undefined);
      });

      it('should return properly crafted objects', function(){
        deps.ConfigApiService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb',
          image_field: 'image',
          image_enabled: true
        });
        expect(deps.ConfigApiService.getFields.all()).toEqual({
          thumbnails_field: 'thumb',
          image_field: 'image'
        });

        deps.ConfigApiService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb',
          image_field: 'image',
          image_enabled: false
        });
        expect(deps.ConfigApiService.getFields.all()).toEqual({
          thumbnails_field: 'thumb'
        });
      });
    });
  }
});
