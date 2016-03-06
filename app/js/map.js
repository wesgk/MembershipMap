var googleMaps = {
    ready   : false,
    resolver: {
        map: ['$q', function($q) {

            if (!googleMaps.deferred) {

                googleMaps.deferred = $q.defer();
            }

            if (googleMaps.ready) {

                googleMaps.deferred.resolve();
            }

            return googleMaps.deferred.promise;
        }]
    }
};

window.onGoogleReady = function () {

    googleMaps.ready = true;

    var test = googleMaps.deferred;

    if (test) {

        googleMaps.deferred.resolve();
        
    }else{
        // return promise?
    }
};