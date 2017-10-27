const {PsGrid} = require('../psGrid.js');
const {Location} = require('../location.js');
var c2g = require('../c2g.js');

//Create a list of location objects
c2g.getParkingSpots(function(c2gResponse){
    c2gResponse = c2gResponse.placemarks;
    var spots = [];
    for(var i in c2gResponse){
	var ps = c2gResponse[i];
	// console.log(JSON.stringify(ps));
	spots.push({location: new Location([ps.coordinates[1], ps.coordinates[0], ps.coordinates[2]]),
		    spot: ps});
    }

    var grid = new PsGrid(4, 4, spots);


    var sum = 0, count = 0;
    for(var x in grid.grid){
	for(var y in grid.grid[x]){
	    var g = grid.grid[x][y];
	    // console.log('Grid[', x, '][', y, '] at (', g.lat, ',', g.lng, ') has ', g.points.length);
	    sum += g.points.length;
	    count ++;
	}
    }

    console.log('Average ps/gridPoint:  ', sum / count);

    var pr = grid.findSpots(49.2603, -123.24940, 15);
    var pr2 = new Array(pr.length);
    for(var i in pr){
	pr2[i] = pr[i].spot;
    }
    
    console.log('Found ', pr2.length, ' spots by UBC: ', pr2);
    console.log('Found: ', pr2.length, ' of total: ', sum);
});
