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
var spotUpdateTimer, requestCount = 0;;
const SPOTGRIDTIMEOUT = 30000;
const MAXDIST = 2500;

var updateGrid = function(){
    return new Promise(function(resolve, reject){
	if(spotGrid){
	    requestCount ++;	// Increment the request count
	    resolve();
	}else{
	    requestCount = 0;	// Reset the request count for this interval
	    
	    routing.getParkingSpots(function(o){
		if(o && 'placemarks' in o){
		    c2gSpots = o.placemarks;
		    c2gSpots.map((spot) => {
			spot.coordinates = [spot.coordinates[1], spot.coordinates[0], spot.coordinates[2]];
		    });

		    spotGrid = new PsGrid(7, 7, c2gSpots.map((s) => {
			return {
			    location: new Location(null, s.coordinates),
			    spot: s
			};
		    }));

		    setTimeout(() => {
			spotGrid = null;
			if(requestCount > 0){
			    updateGrid();
			}
		    }, SPOTGRIDTIMEOUT);

		    resolve();
		}

		reject();
	    });
	}
    });
};

////////////////////////////////////////////////////////////
//	Main Dispatch Routine
////////////////////////////////////////////////////////////

exports.main = function(req, res, reqType){
    switch(reqType){
    case 'park':
	var ps = routing.getParkingSpots(function(o){
	    if(o != null && 'placemarks' in o){

		m = new messages.SpotRequest(req);
		if(!m || !m.dest.valid()){
		    // User is dumb
		    res.status(400).send('Invalid request format');
		    res.end();
		    return;
		}
		
		var origin = m.dest; //Grab the destination to look for car2go parking spots aroun

		//Trigger grid update
		updateGrid()
		    .then(function(){

			//Get nearest gridded spots
			var destinations = spotGrid.findSpots(origin.coordinates[0], origin.coordinates[1], 25);
			
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
				    parkingSpots: rankedSpotsRes.filter(s => s.distance < MAXDIST)
				};
				res.send(JSON.stringify(retObj));
				res.end();
			    }, (err) => {
				console.log(err);
				res.send('Big fat error: ' + err)
				res.end();
			    });
		    }, function(){
			res.end('error getting parking spots');
		    })
	    }else{
		res.end('error getting parking spots');
	    }
	});
	break;


    case 'login':
	var email = 'user_email' in req.body ? req.body.user_email : null;
	console.log('got login request');
	console.log(email);
	res.end('login request handled');
	break;

    default:
	res.status(404).end('Why u no access real page?');
    }
};

