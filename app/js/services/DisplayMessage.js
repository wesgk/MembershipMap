'use strict';

myApp.factory('displayMessageService', 
  function displayMessageService (){

    var listeners = [];
    
    return {
      subscribe: function(name, callback) {
          listeners.push({
            name: name,
            callback: callback
          });
      },
      publish: function(type) {
        angular.forEach(listeners, function(item) {
          if(item.name === type){
            item.callback();
          }
        });
      }
    };

    
});