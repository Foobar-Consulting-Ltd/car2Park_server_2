var routing = require('./c2g.js');
var url = require('url');

var svinfo = {
    version: 0.1,
    updated: '2017-10-11',
    name: 'senor pointy'
};

////////////////////////////////////////////////////////////
//	Location Class
////////////////////////////////////////////////////////////

var Location = function(){
    this.coordinates = null;
    this.address = null;

    this.setCoords = function(lat, lng, elv){
	this.coordinates = [lat, lng, elv];
    };
    this.setFromParkingSpot = function(ps){
	if('coordinates' in ps){
	    this.setCoords(ps.coordinates[0],
			   ps.coordinates[1],
			   ps.coordinates[2]);
	    return true;
	}
	return false;
};



////////////////////////////////////////////////////////////
//	Messaging Classes
////////////////////////////////////////////////////////////

//Top-Level Message class
var Message = function(){
    this.sender = "";
    this.time_sent = null;
    this.type = "Message";

    //Serialize this object
    this.serialize = function(){
	return JSON.stringify(this);
    };
};


//General request class
var Request = function(req){
    Message.call();
    
};
Request.prototype = new Message();
Request.prototype.constructor = Request;


//Parking spot request class
var SpotRequest = function(req){
    Request.call(req);
    
};
SpotRequest.prototype = new Request();
SpotRequest.prototype.constructor = SpotRequest;


//Geenral Response class
var Response = function(req){
    Message.call();
    
};
Response.prototype = new Message();
Response.prototype.constructor = Response;

////////////////////////////////////////////////////////////
//	Main Dispatch Routine
////////////////////////////////////////////////////////////

exports.main = function(req, res, url_string){
    
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
