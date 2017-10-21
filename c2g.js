var http = require('https');

var c2gApi = 'https://www.car2go.com/api/v2.1/parkingspots?loc=Vancouver&oauth_consumer_key=HandiCar&format=json'

exports.getParkingSpots = function(callback) {
	http.get(c2gApi, res => {
		let body = '';
		res.on('data', data => {
			body += data;
		});
		res.on('end', () => {
			callback(JSON.parse(body));
		});
		res.on('error', () => {
			callback(null);
		});
	});
};