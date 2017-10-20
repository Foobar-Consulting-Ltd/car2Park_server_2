////////////////////////////////////////////////////////////
//	Location Class
////////////////////////////////////////////////////////////

exports.Location = function(){
    this.coordinates = null;
    this.address = null;

    this.setCoords = function(lat, lng, alt){
	this.coordinates = [lat, lng, alt];
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

    this.toGmapString = function(){
	if(this.address != null)
	    return this.address;
	else
	    return {lat: this.coordinates[0], lng: this.coordinates[1]};
    };
};
