const { Location } = require('../location.js');
const { PathRank } = require('../gmapsAccess.js');

var pr;

var makeLocation = (addr) => {
    return {
	location: new Location(addr)
    };
};

var makeCoord = function(lat, lng){
    return {
	location: new Location(null, [lat, lng])
    };

};

const makePr = function(){
    pr = new PathRank(makeLocation('Vancouver, BC, Canada'),
		      [makeLocation('Calgary, AB, Canada'),
		       makeLocation('Regina, SK, Canada'),
		       makeLocation('Edmonton, AB, Canada'),
		       makeLocation('Seattle, USA'),
		       makeCoord(45, -75)]); // Last one is somewhere near ottawa
};

const entryCount = 5;

describe('Google maps destination matrix', function(){
    beforeAll(function(){
	makePr();
    });

    it('should contain a list of objects with location property', function(){
	expect(pr.dest instanceof Array).toBeTruthy();
	expect(pr.dest.length).toEqual(entryCount);
	expect('location' in pr.dest[0]).toBeTruthy();
	expect(pr.dest[0].location instanceof Location).toBeTruthy();
    });

    it('should have a single origin', function(){
	expect(pr.origin.location instanceof Location).toBeTruthy();
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

describe('Initially empty PathRank object', function(){
    beforeAll(function(){
	pr = new PathRank(makeLocation('Vancouver, BC, Canada'), null);
    });

    it('should contain 0 destinations', function(){
	expect(pr.dest.length).toEqual(0);
    });

    describe('when a destination is added', function(){
	beforeAll(function(){
	    pr = new PathRank(makeLocation('Vancouver, BC, Canada'), null);
	    pr.addDest(makeLocation('Calgary, AB, Canada'));
	});
	
	it('should appear in the destination list', function(){
	    expect(pr.dest.length).toEqual(1);
	    expect(pr.dest[0].location.address).toEqual('Calgary, AB, Canada');
	});
    });
});
