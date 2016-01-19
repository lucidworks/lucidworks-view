angular.module('ObserverService', [])
  .service('ObservableService', function(){

    function Observable(content){
      this.content = content;
      this.observers = {};
    }

    Observable.prototype.getContent = function(){
      return this.content;
    };

    Observable.prototype.setContent = function(content){
      this.content = content;
      this.notify();
    };

    Observable.prototype.notify = function(){
      angular.forEach(this.observers, function(callback){
        callback(this.content);
      });
    };

    Observable.prototype.addObserver = function(callback){
      var handle = this.generateRandomString();
      this.observers[name] = callback;
      return handle;
    };

    Observable.prototype.removeObserver = function(name){
      delete this.observers[name];
    };

    Observable.prototype.generateRandomString = function(){
      var text = "",
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

     for( var i=0; i < 5; i++ ) {
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     }
     return text;
    };

    return Observable;


  });
