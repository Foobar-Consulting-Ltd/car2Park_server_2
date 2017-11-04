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
    })
});
