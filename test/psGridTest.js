const {PsGrid} = require('../psGrid.js');
const {Location} = require('../location.js');

var c2gResponse =[
    {"chargingPole":false,"coordinates":[-123.11364,49.28427,0],"name":"443 Seymour Floor 4 (Spaces 324 to 342)","totalCapacity":15,"usedCapacity":19},
    {"chargingPole":false,"coordinates":[-123.13091,49.26656,0],"name":"1100 The Castings (surface lot, Fits 2 car2go)","totalCapacity":2,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.11597,49.26637,0],"name":"595 West 6th Ave (surface lot.2 spots w/overflow)","totalCapacity":50,"usedCapacity":3},
    {"chargingPole":false,"coordinates":[-123.10026,49.27259,0],"name":"EasyPark 1500 Main St","totalCapacity":8,"usedCapacity":5},
    {"chargingPole":false,"coordinates":[-123.11194,49.28008,0],"name":"688 Cambie St, surface lot","totalCapacity":12,"usedCapacity":15},
    {"chargingPole":false,"coordinates":[-123.10785,49.28397,0],"name":"160 Water St. EasyPark, P1 (overflow on roof)","totalCapacity":50,"usedCapacity":595},
    {"chargingPole":false,"coordinates":[-123.09972,49.27038,0],"name":"200 Industrial on street","totalCapacity":4,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.08163,49.26631,0],"name":"MEC parking lot off Glen Drive","totalCapacity":2,"usedCapacity":4},
    {"chargingPole":false,"coordinates":[-123.24599,49.26054,0],"name":"UBC Lot C2 (2446 Health Sciences Mall - 4 cars)","totalCapacity":4,"usedCapacity":3},
    {"chargingPole":false,"coordinates":[-123.13606,49.27269,0],"name":"1694 Duranleau (surface lot next to Bridges)","totalCapacity":3,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.13282,49.26948,0],"name":"1290 Cartwright St(surface lot.6 spots w/overflow)","totalCapacity":6,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.15965,49.27294,0],"name":"1400 Balsam St, on street.","totalCapacity":2,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.13051,49.27905,0],"name":"1030 Burnaby (enter frm alley btwn Davie&Burnaby)","totalCapacity":8,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.07033,49.2631,0],"name":"1593 E 8th Ave, on street.","totalCapacity":2,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.1276,49.17526,0],"name":"Kwantlen Richmond","totalCapacity":10,"usedCapacity":6},
    {"chargingPole":false,"coordinates":[-123.12784,49.28545,0],"name":"845 Bute St, on street.","totalCapacity":4,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.13931,49.28173,0],"name":"1378 Broughton St, on street.","totalCapacity":2,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.13876,49.26442,0],"name":"1503 W 8th Ave, on street.","totalCapacity":2,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.12287,49.27548,0],"name":"1188 Homer St, on street","totalCapacity":2,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.11981,49.28848,0],"name":"1102 Cordova St, on street","totalCapacity":4,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.11426,49.28246,0],"name":"592 Richards St, on street","totalCapacity":2,"usedCapacity":2},
    {"chargingPole":false,"coordinates":[-123.13024,49.28176,0],"name":"1125 Pendrell Alley (off Bute)","totalCapacity":2,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.12476,49.28253,0],"name":"1001 Smithe St, on street","totalCapacity":4,"usedCapacity":3},
    {"chargingPole":false,"coordinates":[-123.10335,49.28325,0],"name":"32 Powell St, on street","totalCapacity":2,"usedCapacity":2},
    {"chargingPole":false,"coordinates":[-123.11815,49.2773,0],"name":"975 Mainland St, on street","totalCapacity":4,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.2494,49.2646,0],"name":"2166 East Mall UBC","totalCapacity":4,"usedCapacity":2},
    {"chargingPole":false,"coordinates":[-123.23119,49.25623,0],"name":"UNA:3300 Binning Road (car share only spots)","totalCapacity":2,"usedCapacity":0},
    {"chargingPole":false,"coordinates":[-123.12461,49.27331,0],"name":"1300 Pacific Blvd, on street.","totalCapacity":2,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.11637,49.27602,0],"name":"934 Beatty St. on street.","totalCapacity":2,"usedCapacity":2},
    {"chargingPole":false,"coordinates":[-122.87079,49.13346,0],"name":"KPU Surrey - spots in visitor parking off 72nd","totalCapacity":4,"usedCapacity":1},
    {"chargingPole":false,"coordinates":[-123.14093,49.27116,0],"name":"1500 W1st Ave, on street.","totalCapacity":2,"usedCapacity":3},
    {"chargingPole":false,"coordinates":[-123.24954,49.26022,0],"name":"UBC 6359 Agronomy Rd (Lot B4, fits 4 cars)","totalCapacity":4,"usedCapacity":6}];

//Create a list of location objects
var spots = [];

for(var i in c2gResponse){
    var ps = c2gResponse[i];
    console.log(JSON.stringify(ps));
    spots.push({location: new Location([ps.coordinates[1], ps.coordinates[0], ps.coordinates[2]]),
		spot: ps});
}

var grid = new PsGrid(12, 12, spots);

