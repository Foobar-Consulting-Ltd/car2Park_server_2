////////////////////////////////////////////////////////////
//	Location Class
////////////////////////////////////////////////////////////

exports.Location = function(addr = null, cord = null){
    this.coordinates = cord ? cord : [];
    if(!this.coordinates[2]) this.coordinates[2] = 0; // Default altitude to 0
    this.address = addr;

    this.setCoords = function(lat, lng, alt){
	this.coordinates = [lat, lng, (alt ? alt : 0)];
    };
    this.setFromParkingSpot = function(ps){
	if('coordinates' in ps){
	    this.setCoords(ps.coordinates[1],
			   ps.coordinates[0],
			   ps.coordinates[2]);
	    return true;
	}
	return false;
    };

    this.toGmap = function(){
	if(this.coordinates[0] == null || this.coordinates[1] == null) {
	    return this.address;
	}
	else {
	    return this.coordinates[0].toString() + ',' + this.coordinates[1].toString();
	}
    };

    this.valid = () => this.address || (this.coordinates[0] && this.coordinates[1]);

    this.hasCoords = () => this.coordinates[0] != null &&
	this.coordinates[1] != null &&
	this.coordinates[2] != null;
};
