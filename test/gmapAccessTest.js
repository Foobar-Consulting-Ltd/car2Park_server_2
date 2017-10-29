const { Location } = require('../location.js');
const {PathRank } = require('../gmapsAccess.js');
var pr;

const makePr = function(){
	var makeLocation = (addr) => {
		var o = new Location();
		o.address = addr;
		return o;
	};

	var makeCoord = function(lat, lng){
		var o = new Location();
		o.setCoords(lat, lng, 0);
		return o;
	};

	pr = new PathRank(makeLocation('Vancouver, BC, Canada'),
			  [makeLocation('Calgary, AB, Canada'), makeLocation('Regina, SK, Canada'),
			   makeLocation('Edmonton, AB, Canada'), makeLocation('Seattle, USA'),
			   makeCoord(45, -75)]); // Last one is somewhere near ottawa
};

const entryCount = 5;

makePr();

describe('Google maps destination matrix', function(){
    beforeAll(function(){
	// nothing?
    });

    it('should contain a list of location objects', function(){
	expect(pr.dest instanceof Array).toBeTruthy();
	expect(pr.dest.length).toEqual(entryCount);
	expect(pr.dest[0] instanceof Location).toBeTruthy();
    });

    it('should have a single origin', function(){
	expect(pr.origin instanceof Location).toBeTruthy();
    });

    describe('when ranked distances requested', function(){
	var results;
	
	//Pass in done function for async setup.
	beforeAll(function(done){
	    pr.getRanked()
		.then(res => {
		    results = res;
		    done()
		}, (err) => {
		    fail();
		});
	}, 10000);

	it('should have a result of length ' + entryCount, function(){
	    expect(results).toBeDefined();
	    expect(results instanceof Array).toBeTruthy();
	    expect(results.length).toEqual(entryCount);
	    expect('distance' in results[0]).toBeTruthy();
	});

	it('should sort results by distance', function(){
	    var last = results[0].distance;
	    
	    for(var i = 1; i < results.length; i++){
		expect(results[i].distance).toBeGreaterThan(last);
		last = results[i].distance;
	    }
	});
    });
});
