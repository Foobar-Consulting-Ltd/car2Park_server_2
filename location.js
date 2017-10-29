////////////////////////////////////////////////////////////
//	Location Class
////////////////////////////////////////////////////////////

exports.Location = function(addr = null, cord = null){
	this.coordinates = cord;
	this.address = addr;

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

	this.toGmap = function(){
		if(this.coordinates[0] == null || this.coordinates[1] == null) {
			return this.address;
		}
		else {
			return this.coordinates[0].toString() + ',' + this.coordinates[1].toString();
		}
	};

};
