var routing = require('./c2g.js');
var messages = require('./messages.js');
var location = require('./location.js');

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
		var retObj = {
		    name: 'Franklin',
		    server: svinfo,
		    args: req.query,
		    parkingspots: o['placemarks'],
		    parsed_location: (new messages.SpotRequest(req)).dest
		};
		res.send(JSON.stringify(retObj));
		res.end();
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
