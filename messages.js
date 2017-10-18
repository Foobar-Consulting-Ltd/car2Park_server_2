var location = require('./location.js');

////////////////////////////////////////////////////////////
//	Messaging Classes
////////////////////////////////////////////////////////////

//Top-Level Message class
var Message = exports.Message = function(){
    this.sender = "";
    this.time_sent = null;
    this.type = "Message";

    //Serialize this object
    this.serialize = function(){
	return JSON.stringify(this);
    };
};


//General request class
var Request = exports.Request = function(req){
    Message.call();
    this.type = 'Request';
};
Request.prototype = new Message();
Request.prototype.constructor = Request;


//Parking spot request class
var SpotRequest = exports.SpotRequest = function(req){
    Request.call(req);
    this.type = 'SpotRequest';
    this.dest = new location.Location();
};
SpotRequest.prototype = new Request();
SpotRequest.prototype.constructor = SpotRequest;


//Geenral Response class
var Response = exports.Response = function(req){
    Message.call();
    this.type = 'Response';
};
Response.prototype = new Message();
Response.prototype.constructor = Response;
