const {Location} = require('./location.js');
var m2 = require('mathjs');

////////////////////////////////////////////////////////////
//	System Conversion Functions
////////////////////////////////////////////////////////////
var d2r = x => x * Math.PI / 180;
var r2d = x => x * 180 / Math.PI;

//Surface distance across sphere.
var sdist = (lat1, lng1, lat2, lng2) =>
    Math.acos(Math.sin(lat1) * Math.sin(lat2) +
	      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1));
//Make a lat/lng pair into cartesian vector
var l2c = (lat, lng) => [
    Math.cos(lat) * Math.cos(lng),
    Math.cos(lat) * Math.sin(lng),
    Math.sin(lat)
];

//Returns [lat, lng, hyp] from [x, y, z] in standard coordinates
var c2l = c => {
    var ret = [
	0,
	Math.atan2(c[1], c[0]),
	Math.sqrt(Math.pow(c[0], 2) + Math.pow(c[1], 2))
    ];

    ret[0] = Math.atan2(c[2], ret[2]);
    return ret;
};

////////////////////////////////////////////////////////////
//	Basis Converter Class
////////////////////////////////////////////////////////////
//Applies a rotation matrix to determine a point's re-mapped coordinates
//Returned coordinates are relative to the new point, with [1, 0, 0] being the origin
var BasisConverter = function(originLat, originLng, rotation = 0){
    this.ta = -originLat;	// Matrix alpha
    this.tb = -originLng;	// Matrix beta
    this.tc = -rotation;	// Matrix gamma

    //Create component matrices
    this.ma = m2.matrix([[Math.cos(this.tb),	-Math.sin(this.tb),	0],
			 [Math.sin(this.tb),	Math.cos(this.tb),	0],
			 [0,			0,			1]]);
    
    this.mb = m2.matrix([[Math.cos(this.ta),	0,			-Math.sin(this.ta)],
			 [0,			1,			0],
			 [Math.sin(this.ta),	0,			Math.cos(this.ta)]]);
    
    this.mc = m2.matrix([[1,			0,			0],
			 [0,			Math.cos(this.tc),	-Math.sin(this.tc)],
			 [0,			Math.sin(this.tc),	Math.cos(this.tc)]]);

    //Compute the aggregate transformation matrix
    this.matrix = m2.multiply(this.mc, m2.multiply(this.mb, this.ma));
    this.invMatrix = m2.inv(this.matrix);

    
    //Convert a standard lat/lng pair to a transformed coordinate
    this.convert = function(lat, lng){
	//Convert to point and transform
	var p = l2c(lat, lng);
	p = m2.multiply(this.matrix, p);

	return p._data;
    }

    this.revert = function(c){
	c = m2.multiply(this.invMatrix, c);
	return c2l(c._data);
    };
}


////////////////////////////////////////////////////////////
//	PsGrid Class
////////////////////////////////////////////////////////////
//Param: points		An array of objects with a member 'location' of type Location
//Param: columns	Number of column to draw on this grid.
//Param: rows		Number of rows to draw on this grid
//Param: rotOffset	Rotational offset clockwise (in degrees);
var PsGrid = exports.PsGrid = function(columns, rows, points, rotOffset = 0){
    //PsGridSpot Class
    //Takes center position and neighbouring gridspots
    var PsGridSpot = function(lat, lng, neighbours){
	this.lat = lat;
	this.lng = lng;
	this.neighbours = neighbours ? neighbours : new Array(4); // [right, up, left, down]
	this.points = [];	      // A list of all contained points
    }

    // Assign fields.
    this._columns = 2 * columns + 1; // have 'columns' columns on either side
    this._rows = 2 * rows + 1;	     // Same as columns
    this._centerCol = columns;
    this._centerRow = rows;
    this.skew = d2r(rotOffset);
    this.grid;			// Lookup grid
    this._points = [];		// Blank points array; will insert points later

    ////////////////////////////////////////////////////////////
    //Methods
    ////////////////////////////////////////////////////////////
    //Find the centroid given the current points
    this._findCentroid = function(){
	var count = 0;
	var cartesianSum = [0, 0, 0];



	for(var p in this._points){
	    var point = this._points[p];
	    count++;

	    //Aggregate in centroid calculation
	    var lat = d2r(point.location.coordinates[0]);
	    var lng = d2r(point.location.coordinates[1]);
	    var c = l2c(lat, lng);
	    cartesianSum[0] += c[0];
	    cartesianSum[1] += c[1];
	    cartesianSum[2] += c[2];
	}

	//Cartesian center as mean of cartesian coordinates (unweighted)
	cartesianSum[0] /= count;
	cartesianSum[1] /= count;
	cartesianSum[2] /= count;

	//Centroid coordinate computed from cartesian center.
	c = c2l(cartesianSum);
	this.origin = {
	    lat: c[0],
	    lng: c[1],
	    hyp: c[2]
	};			// Origin coordinates in radians, hyp as fraction of geoid radius

	this.bConverter = new BasisConverter(c[0], c[1]);
    }

    //Setup the grid with (not quite) equally spaced points
    this._setupGrid = function(){
	this._findCentroid();

	var dy = 0, dz = 0;
	
	//Find maximum x/y deviation from center
	for(var p in this._points){
	    var point = this._points[p];
	    var c = this.bConverter.convert(d2r(point.location.coordinates[0]), d2r(point.location.coordinates[1]));

	    if(Math.abs(c[1]) > dy) dy = Math.abs(c[1]);
	    if(Math.abs(c[2]) > dz) dz = Math.abs(c[2]);
	}

	//Optimal dX/dY est. at max deviation / count
	dy /= (this._columns - 1) / 2 ;
	dz /= (this._rows - 1) / 2;

	//Populate grid reference points
	this.grid = new Array(this._columns);
	for(var y = 0; y < this._columns; y++){
	    this.grid[y] = new Array(this._rows);	//Add cell for each row

	    for(var z = 0; z < this._rows; z++){
		//Revert grid point to standard coordinates
		var c = this.bConverter.revert(
		    [1,
		     dy * (y - this._centerCol),
		     dz * (z - this._centerRow)]);
		
		this.grid[y][z] = new PsGridSpot(r2d(c[0]), r2d(c[1]));
	    }
	}

	//Connect grid points (y => vert, x => horiz)
	for(var x = 0; x < this._columns; x++){
	    for(var y = 0; y < this._rows; y++){
		var spot = this.grid[x][y];
		
		//Right
		if(x + 1 < this._columns){
		    spot.neighbours[0] = this.grid[x + 1][y];
		}

		//Up
		if(y + 1 < this._rows){
		    spot.neighbours[1] = this.grid[x][y + 1];
		}

		//Left
		if(x - 1 >= 0){
		    spot.neighbours[2] = this.grid[x - 1][y];
		}

		//Down
		if(y - 1 >= 0){
		    spot.neighbours[3] = this.grid[x][y - 1];
		}
	    }
	}
    }

    //Finds the grid spot closest to the provided  location.
    this._getClosest = function(lat, lng){
	var next = this.grid[this._centerCol][this._centerRow];
	var d = sdist(lat, lng, next.lat, next.lng);
	var res;

	do{
	    res = next;
	    next = null;

	    for(var i = 0; i < 4; i++){
		var s2 = res.neighbours[i];
		if(s2 == null) continue;

		var d2 = sdist(lat, lng, s2.lat, s2.lng);

		if(d2 < d){
		    next = s2;
		    d = d2;
		}
	    }
	}while(next);

	return res;
    };

    //Bin a single point
    this._bin = function(point){
	if(!(this._points.some((p) => p === point))) this._points.push(point); // Insert point if not contained.
	if(!this.grid) this._setupGrid();

	this._getClosest(point.location.coordinates[0], point.location.coordinates[1])
	    .points.push(point);
    }
    
    //Resets the grid and bins all of the points
    this.reBinAll = function(){
	this._setupGrid();	
	
	for(var p in this._points){
	    this._bin(this._points[p]);
	}
    };

    //Returns a list of vehicles in adjacent grid cells.
    this.findSpots = function(lat, lng, minSpots = 5){
	var c = this._getClosest(lat, lng);
	var res = c.points;

	if(minSpots < 0)
	    minSpots = 0;
	if(minSpots > this._points.length)
	    minSpots = this._points.length;

	
	var searched = [c], toSearch = [];
	var markForSearch = function(x){
	    if(x == null) return;
	    if(searched.some( a => a === x)) return;
	    if(toSearch.some( a => a === x)) return;
	    toSearch.push(x);
	};
	var nextSearch = function(){
	    toSearch.sort((a, b) =>
			  sdist(a.lat, a.lng, lat, lng) <
			  sdist(b.lat, b.lng, lat, lng));
	    return toSearch.shift();
	};

	for(var i in c.neighbours)
	    markForSearch(c.neighbours[i]);

	//Keep searching if we don't have enough spots
	do{
	    c = nextSearch();
	    if(!c) break;	// Ran out of searchable nodes
	    searched.push(c);
	    res = [].concat(res, c.points);
	    
	    for(var i in c.neighbours)
		markForSearch(c.neighbours[i]);
	}while(res.length < minSpots);

	return res; // Return if we have enough spots
    }

    
    //Add all the points to the inner points object after checks.
    for(var p in points){
	var point = points[p];
	//Check that point satisfies data requirements.
	//TODO: Geocode location if address only?
	if(!('location' in point && point.location instanceof Location &&
	     point.location.hasCoords())) continue;
	
	this._points.push(point); // Save each point
    }

    //Finally, bin all the data points (creates grid)
    this.reBinAll();
};
