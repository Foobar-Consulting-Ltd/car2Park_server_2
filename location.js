////////////////////////////////////////////////////////////
//	Location Class
////////////////////////////////////////////////////////////

exports.Location = function(){
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
};
