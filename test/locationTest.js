const {Location} = require('../location.js');

describe('Location', function(){
    describe('when created with 2 coordinates', function(){
	var c;
	
	beforeAll(function(){
	    c = new Location(null, [12, 13]);
	});
	
	it('.hasCoords() should be true', function(){
	    expect(c.hasCoords()).toBeTruthy();
	});

	it('should default altitude to 0', function(){
	    expect(c.coordinates[2]).toEqual(0);
	});
    });

    describe('when created with 3 coordinates', function(){
	var c;

	beforeAll(function(){
	    c = new Location(null, [12, 13, 14]);
	});

	it('.hasCoords() should be true', function(){
	    expect(c.hasCoords()).toBeTruthy();
	});

	it('should print a valid gmap string', function(){
	    expect(c.toGmap()).toEqual('12,13');
	});
    });

    describe('when created with an address', function(){
	var c;
	const addr = '123 Sesame Street';

	beforeAll(function(){
	    c = new Location(addr);
	});

	it('should not have coordinates', function(){
	    expect(c.hasCoords()).toBeFalsy();
	    expect(c.coordinates instanceof Array).toBeTruthy();
	    expect(c.coordinates.length).toEqual(3);
	});

	it('should return its address on .toGmap()', function(){
	    expect(c.toGmap()).toEqual(addr);
	});
    });

    describe('when set from a parkinspot object', function(){
	var c;

	beforeAll(function(){
	    c = new Location();
	    var spot = JSON.parse('{"chargingPole":false,"coordinates":[-123.07033,49.2631,0],"name":"1593 E 8th Ave, on street.","totalCapacity":2,"usedCapacity":1}');
	    c.setFromParkingSpot(spot);
	});

	it('should set lat, lng and alt correctly', function(){
	    expect(c.coordinates[0]).toEqual(49.2631);
	    expect(c.coordinates[1]).toEqual(-123.07033);
	    expect(c.coordinates[2]).toEqual(0);
	});
    });
});
