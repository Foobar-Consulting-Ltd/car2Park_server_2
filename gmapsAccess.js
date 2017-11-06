const {Location} = require('./location.js');

var gMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyAfPCPAqQK1TMbrkQLOXoV-wd0KGQICZ0I',
//    key: 'AIzaSyDT8dvsdA-hdSdbpfK-dw9QnOT-eDA0QZo',
Promise: Promise
});

const WEIGHTEDSPOTDISTANCE = 100;

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

//Get weighted distance with availible parking spots
var getWeightedDistance = function(availiblitySpots){
	if (availiblitySpots <= 0) return 0;
	return ( (WEIGHTEDSPOTDISTANCE/(Math.pow(2, availiblitySpots-1))) + getWeightedDistance(availiblitySpots-1) );
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
						distance: response.json.rows[0].elements[i].distance.value,
						availible_spots: this.dest[i].spot.totalCapacity - this.dest[i].spot.usedCapacity});
				}
			}
			//Filter out unavailible_spots
			this.results = this.results.filter( (spot) => spot.availible_spots > 0)

		    //Sort by a weighted distance
		    this.results = this.results.sort( (a , b) => {
		    	var weighted_a = a.distance - getWeightedDistance(a.availible_spots);
		    	var weighted_b = b.distance - getWeightedDistance(b.availible_spots);
		    	return weighted_a - weighted_b;
		    });


		    resolve();
		}, (err) => {
			console.log('There was error stuff in the gmaps request...');
			console.log(err);
			reject(err);
		});


	})
};

};
