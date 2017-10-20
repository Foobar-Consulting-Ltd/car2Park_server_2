const {Location} = require('./location.js');

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
//Sorts a list of destinations by their distance from a single origin.
//Param origin:		Location object for the origin
//Param destinations:	(optional) A list of location objects that are the destinations
var PathRank = exports.PathRank = function(origin, dests){
    this.origin = origin;
    this.dest = dests instanceof Array ? dests : [];
    this.results = null;

    this.addDest = function(dest){
	this.dests.append(dest); // TODO: Prevent attaching duplicates
	this.results = null;	 // TODO: Don't clear everything, just replace new result.
    };

    this.getRanked = function(){
	return new Promise((resolve, reject) => {
	    if(this.results == null){
		this.query()
		    .then(()=>{
			resolve(this.results);
		    }, (err) =>{
			reject(err);
		    });
	    }else{
		resolve(this.results);
	    }
	});
    };

    this.query = function(){
	return new Promise((resolve, reject) => {
	    this.results = [];
	    var input = [];
	    for(var i = 0; i < this.dest.length; i++){
		input[i] = this.dest[i].toGmapString();
	    }

	    gMapsClient.distanceMatrix({origins: this.origin.toGmapString(),
					destinations: input,
					units: 'metric'}).asPromise()
		.then((response) => {
		    for(var i = 0; i < this.dest.length; i++){
			this.results[i] = {location: this.dest[i],
					   distance: response.json.rows[0].elements[i].distance.value};
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


//test();	

console.log('Doing some other stuff...');

var makeLocation = (addr) => {
    var o = new Location();
    o.address = addr;
    return o;
};
var pr = new PathRank(makeLocation('Vancouver, BC, Canada'),
		      [makeLocation('Calgary, AB, Canada'), makeLocation('Regina, SK, Canada'),
		       makeLocation('Edmonton, AB, Canada'), makeLocation('Seattle, USA')]);

console.log('pr has ' + pr.dest.length + ' destinations');

pr.getRanked()
    .then(function(res){
	console.log('success?');
	console.log(res);
    }, function(err){
	console.log('Some errors occured in the second one');
	console.log(err);
    });
