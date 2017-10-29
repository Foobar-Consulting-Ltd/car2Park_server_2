var routing = require('./c2g.js');
var messages = require('./messages.js');
const {Location} = require('./location.js');
const {PathRank} = require('./gmapsAccess.js');

var svinfo = {
	version: 0.1,
	updated: '2017-10-11',
	name: 'senor pointy'
};

////////////////////////////////////////////////////////////
//	Main Dispatch Routine
////////////////////////////////////////////////////////////

exports.main = function(req, res, reqType){
	switch(reqType){
		case 'park':
		var ps = routing.getParkingSpots(function(o){
			if(o != null && 'placemarks' in o){

		var origin = (new messages.SpotRequest(req)).dest; //Grab the destination to look for car2go parking spots aroun
		var destinations = [];
		//TODO: Right now hardcoded to grab 100. When the grid works, we will use that instead.
		for(var x = 0; x < 100; x++){
			destinations.push(new Location(o['placemarks'][x]['name'], o['placemarks'][x]['coordinates']));
		}

		//Car2Go API returns longitude and then latitude but Google Maps require latitude and then longitude. Manipulate destination to reflect these requirements
		destinations.map((spot) => {
			spot['coordinates'] = [spot['coordinates'][1], spot['coordinates'][0], spot['coordinates'][2]];
		});

		//Rank all the parking spots and send back the list of parking spots in order based on distance
		//TODO: Improve algorthm to take account of availible spots
		var parkingspots = new PathRank(origin, destinations);
		var rankedParkingSpots;
		parkingspots.getRanked()
		.then( (rankedSpotsRes) => {
			var retObj = {
				name: 'Franklin',
				server: svinfo,
				args: req.query,
					parsedLocation: origin,
				parkingSpots: rankedSpotsRes
			};
			res.send(JSON.stringify(retObj));
			res.end();
		}, (err) => {
			console.log(err);
		});

	}else{
		res.end('error getting parking spots');
	}
});
		break;


		case 'login':
		console.log('got login request');
		res.end('login request handled');
		break;

		default:
		res.status(404).end('Why u no access real page?');
	}
};
