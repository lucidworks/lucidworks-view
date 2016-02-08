/*global ngDescribe, describe, it, expect*/
ngDescribe({
  name: 'ConfigService',
  modules: 'fusionSeedApp.services',
  inject: ['ConfigService'],
  tests: function(deps){
    describe('specific little properties getter should be working', function(){
      it('should make the right fusion url', function(){
        deps.ConfigService.init({
          host: 'http://localhost',
          port: '8764'
        });
        expect(deps.ConfigService.getFusionUrl()).toEqual('http://localhost:8764');
      });
    });

    describe('getSpecificFields() should be working', function(){
      it('with specific field getters', function(){
        deps.ConfigService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.get('thumbnails_field')).toEqual('thumb_url');
      });

      it('and null when disabled', function(){
        deps.ConfigService.init({
          thumbnails_enabled: false,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.get('thumbnails_field')).toEqual(null);
      });

      it('and straight thru if not toggle explicitly', function(){
        deps.ConfigService.init({
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.get('thumbnails_field')).toEqual('thumb_url');
      });
    });

    describe('getAllFields() with existing config properties',function(){
      it('should return according to the _enabled=true', function(){
        deps.ConfigService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.all().thumbnails_field).toEqual('thumb_url');
      });

      it('should return nothing according to the _enabled=false', function(){
        deps.ConfigService.init({
          thumbnails_enabled: false,
          thumbnails_field: 'thumb_url'
        });
        expect(deps.ConfigService.getFields.all().thumbnails_field).toEqual(undefined);
      });

      it('should return nothing if it\'s blank and enabled', function(){
        deps.ConfigService.init({
          thumbnails_enabled: true,
          thumbnails_field: ''
        });
        expect(deps.ConfigService.getFields.all().thumbnails_field).toEqual(undefined);
      });

      it('should return properly crafted objects', function(){
        deps.ConfigService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb',
          image_field: 'image',
          image_enabled: true
        });
        expect(deps.ConfigService.getFields.all()).toEqual({
          thumbnails_field: 'thumb',
          image_field: 'image',
          head_field: 'name'
        });

        deps.ConfigService.init({
          thumbnails_enabled: true,
          thumbnails_field: 'thumb',
          image_field: 'image',
          image_enabled: false
        });
        expect(deps.ConfigService.getFields.all()).toEqual({
          thumbnails_field: 'thumb',
          head_field: 'name'
        });
      });
    });
  }
});
