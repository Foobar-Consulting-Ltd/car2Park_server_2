var routing = require('./c2g.js');
var url = require('url');

var svinfo = {
    version: 0.1,
    updated: '2017-10-11',
    name: 'senor pointy'
};

exports.main = function(res, url_string){
    
    var u = url.parse(url_string, true);
    var ps = routing.getParkingSpots(function(o){
	if(o != null && 'placemarks' in o){
	    var retObj = {
		name: 'Franklin',
		server: svinfo,
		args: u,
		parkingspots: o['placemarks'],
	    };

	    res.send(JSON.stringify(retObj), 200);
	    res.end();
	}else{
	    res.end('error getting parking spots');
	}
    });
};