var gMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDT8dvsdA-hdSdbpfK-dw9QnOT-eDA0QZo',
    Promise: Promise
});
			  
var test = exports.test = function(){
    gMapsClient.distanceMatrix({origins: ['Washington, DC'],
				destinations: ['New York, NY'],
				units: 'metric'}).asPromise()
	.then(function(response){
	    console.log(response.json.rows[0].elements);
	}, function(err){
	    console.log('There was error stuff...');
	    console.log(err);
	});
};


////////////////////////////////////////////////////////////
//	Path Ranks Class
////////////////////////////////////////////////////////////
//Param origin:		Location object for the origin
//Param destinations:	(optional) A list of location objects that are the destinations
var PathRank = exports.PathRank = function(origin, dests){
    this.origin = origin;
    this.dest = dest instanceof array ? dests : [];
    this.ranked = null;

    this.addDest = function(dest){
	this.dests.append(dest); // TODO: Prevent attaching duplicates
    };

    this.getRanked() = function(){
	// TODO: Implement
    };

    this.query = function(){
	// TODO: query googleMaps API and return promise.
    }
}

test();
