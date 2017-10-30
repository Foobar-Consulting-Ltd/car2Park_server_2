var routing = require('./c2g.js');
var messages = require('./messages.js');
const {Location} = require('./location.js');
const {PathRank} = require('./gmapsAccess.js');
const {PsGrid} = require('./psGrid.js');

var svinfo = {
    version: 0.1,
    updated: '2017-10-11',
    name: 'senor pointy'
};

////////////////////////////////////////////////////////////
//	Parking Spot Manager
////////////////////////////////////////////////////////////

var spotGrid;
var c2gSpots;

var updateGrid = function(){
    routing.getParkingSpots(function(o){
	if(o && 'placemarks' in o){
	    c2gSpots = o.placemarks;
	    c2gSpots.map((spot) => {
		spot.coordinates = [spot.coordinates[1], spot.coordinates[0], spot.coordinates[2]];
	    });

	    spotGrid = new PsGrid(4, 4, c2gSpots.map((s) => {
		return {
		    location: new Location(null, s.coordinates),
		    spot: s
		};
	    }));
	}
    });
};

updateGrid();

////////////////////////////////////////////////////////////
//	Main Dispatch Routine
////////////////////////////////////////////////////////////

exports.main = function(req, res, reqType){
    switch(reqType){
    case 'park':
	var ps = routing.getParkingSpots(function(o){
	    if(o != null && 'placemarks' in o){

		var origin = (new messages.SpotRequest(req)).dest; //Grab the destination to look for car2go parking spots aroun
		//Create a new gird if it doesn't exist.
		if(!spotGrid){
		    console.log('Creating grid');
		    updateGrid();
		}
		
		var destinations = spotGrid
		    .findSpots(origin.coordinates[0], origin.coordinates[1], 15);
		
		console.log('SpotGrid returned # destination: ', destinations.length);
		
		//Rank all the parking spots and send back the list of parking spots in order based on distance
		//TODO: Improve algorthm to take account of availible spots
		var parkingspots = new PathRank({location: origin}, destinations);
		var rankedParkingSpots;
		parkingspots.getRanked()
		    .then( (rankedSpotsRes) => {
			var retObj = {
			    name: 'Franklin',
			    server: svinfo,
			    args: req.query,
			    parsedLocation: origin,
			    parkingSpots: rankedSpotsRes // TODO: Attach parking spot object to this as well.
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

