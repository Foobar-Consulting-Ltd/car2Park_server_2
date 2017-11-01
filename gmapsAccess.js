const {Location} = require('./location.js');

var gMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDT8dvsdA-hdSdbpfK-dw9QnOT-eDA0QZo',
    Promise: Promise
});

////////////////////////////////////////////////////////////
//	Path Ranks Class
////////////////////////////////////////////////////////////
//Sorts a list of destinations by their distance from a single origin.
//Param origin:		Location object for the origin
//Param destinations:	(optional) A list of objects with property 'location' that are the destinations
var PathRank = exports.PathRank = function(origin, dests){
    this.origin = origin;
    this.dest = dests && dests instanceof Array ? dests.filter(d => 'location' in d) : [];
    this.results = null;

    this.addDest = function(dest){
	if(!('location' in dest)) return;
	this.dest.push(dest); // TODO: Prevent attaching duplicates
	this.results = null;	 // TODO: Don't clear everything, just replace new result.
    };

    this.getRanked = function(){
	return new Promise((resolve, reject) => {
	    if(this.results == null){
		this.query()
		    .then( () => {
			resolve(this.results);
		    }, (err) => {
			reject(err);
		    });
	    } else {
		resolve(this.results);
	    }
	});
    };

    this.query = function(){
	return new Promise((resolve, reject) => {
	    this.results = [];
	    var input = this.dest.map(d => d.location.toGmap());

	    gMapsClient.distanceMatrix({origins: this.origin.location.toGmap(),
					destinations: input,
					units: 'metric'}).asPromise()
		.then((response) => {
		    for(var i = 0; i < this.dest.length; i++){
			if(response.json.rows[0].elements[i].status == "OK"){
			    this.results.push({location: this.dest[i],
					       distance: response.json.rows[0].elements[i].distance.value});
			}
		    }

		    this.results = this.results.sort((a, b) => (a.distance - b.distance));

		    resolve();
		}, (err) => {
		    console.log('There was error stuff in the gmaps request...');
		    console.log(err);
		    reject(err);
		});
	});
    };
};
