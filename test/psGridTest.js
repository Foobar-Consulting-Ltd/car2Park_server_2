// const {PsGrid} = require('../psGrid.js');
// const {Location} = require('../location.js');
// var c2g = require('../c2g.js');


// describe('Parking Spot Grid', function(){
//     var grid;			// Eventual PsGrid object

//     beforeAll(function(done){
// 	c2g.getParkingSpots(function(c2gResponse){
// 	    c2gResponse = c2gResponse.placemarks;
// 	    var spots = [];
// 	    for(var i in c2gResponse){
// 		var ps = c2gResponse[i];

// 		spots.push({
// 		    location: new Location(null, [ps.coordinates[1], ps.coordinates[0], ps.coordinates[2]]),
// 		    spot: ps
// 		});
// 	    }

// 	    grid = new PsGrid(4, 4, spots);
	    
// 	    done();
// 	});
//     });

//     it('should have a 9 by 9 grid', function(){
// 	expect(grid.grid.length).toEqual(9);
// 	expect(grid.grid[0].length).toEqual(9);
//     });

//     it('Should have avg. 1-2 spots per point', function(){
//    	var sum = 0, count = 0;
// 	for(var x in grid.grid){
// 	    for(var y in grid.grid[x]){
// 		var g = grid.grid[x][y];
// 		sum += g.points.length;
// 		count ++;
// 	    }
// 	}

// 	expect(sum).toBeGreaterThan(50);
// 	expect(sum).toBeLessThan(200);
// 	expect(sum / count).toBeLessThan(2);
// 	expect(sum / count).toBeGreaterThan(1);
//     });

//     describe('when 15 nearby spots requested', function(){
// 	var pr

// 	beforeAll(function(){
// 	    pr = grid.findSpots(49.2603, -123.24940, 15); // Somewhere near ubc
// 	    pr.forEach((cv) => cv.spot);
// 	});

// 	it('should return at least 15 spots', function(){
// 	    expect(pr.length).toBeGreaterThanOrEqual(15);
// 	});
//     });

//     describe('when more spots requested than available', function(){
// 	var pr

// 	beforeAll(function(){
// 	    pr = grid.findSpots(49.2603, -123.24940, 400); // Somewhere near ubc
// 	    pr.forEach((cv) => cv.spot);
// 	});

// 	it('should return all the spots', function(){
// 	    expect(pr.length).toEqual(grid._points.length);
// 	});
//     });

    
// });
