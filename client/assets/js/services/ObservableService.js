angular.module('ObserverService', [])
  .service('ObservableService', function(){
    var observables = {};

    /**
     * Observable constructor
     *
     * @param {*} content    The content to observe changes to.
     * @constructor
     */
    function Observable(content){
      this.content = content;
      this.observers = {};
    }

    /**
     * Get content from observable.
     *
     * @return {*} The content to observe changes to.
     */
    Observable.prototype.getContent = function(){
      return this.content;
    };

    /**
     * Update the content in the observable.
     *
     * @param  {[type]} content The content to observe changes to.
     * @return {[type]}         [description]
     */
    Observable.prototype.setContent = function(content){
      this.content = content;
      this.notify();
    };

    /**
     * Notify observers the content of the observable has changed.
     */
    Observable.prototype.notify = function(){
      angular.forEach(this.observers, function(callback){
        callback(this.content);
      });
    };

    /**
     * Add a new observer callback.
     *
     * @param  {Function} callback   The callback to call on change of the observable content.
     * @return {String}              The handle for the observer which was rendered.
     */
    Observable.prototype.addObserver = function(callback){
      var handle = this.generateRandomString();
      this.observers[handle] = callback;
      return handle;
    };

    /**
     * Remove an observer from an observable.
     *
     * @param  {[type]} handle [description]
     * @return {[type]}        [description]
     */
    Observable.prototype.removeObserver = function(handle){
      delete this.observers[handle];
    };

    Observable.prototype.generateRandomString = function(){
      var text = "",
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

     for( var i=0; i < 5; i++ ) {
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     }
     return text;
    };

    return {
      createObservable: createObservable,
      getObservable: getObservable,
      deleteObservable: deleteObservable
    };

    function createObservable(name, content){
      observables[name] = new Observable(content);
      return observables[name];
    }

    function getObservable(name){
      return observables[name];
    }

    function deleteObservable(name){
      delete observables[name];
    }

  });
