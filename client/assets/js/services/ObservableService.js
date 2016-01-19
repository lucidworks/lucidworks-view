angular.module('ObservableService', [])
  /**
   * ObserverService
   *
   * This module creates observable prototypes which allows the registration
   * of observers which are notified everytime the content in the observable
   * changes.
   */
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
     * @return {string}              The handle for the observer which was added.
     */
    Observable.prototype.addObserver = function(callback){
      var handle = this.generateRandomString();
      this.observers[handle] = callback;
      return handle;
    };

    /**
     * Remove an observer from an observable.
     *
     * @param  {string} handle The handle for the observer.
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

    /**
     * Create a new observable.
     *
     * @param  {string} name    The name of the observable.
     * @param  {*} content      The content to add to the observable.
     *
     * @return {Observable}     An observable prototype;
     */
    function createObservable(name, content){
      observables[name] = new Observable(content);
      return observables[name];
    }

    /**
     * Get an observable by name.
     *
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    function getObservable(name){
      return observables[name];
    }

    /**
     * Delete an observable.
     *
     * @param  {string} name The name of the observable.
     */
    function deleteObservable(name){
      delete observables[name];
    }

  });
