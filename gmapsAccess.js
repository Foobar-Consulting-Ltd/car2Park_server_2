var gMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDT8dvsdA-hdSdbpfK-dw9QnOT-eDA0QZo',
    Promise: Promise
});
			  
var test = function(){
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

test();
