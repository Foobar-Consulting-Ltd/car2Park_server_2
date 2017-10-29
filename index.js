var express = require('express');
var app = express();

var dispatch = require('./dispatch.js');

app.set('port', (process.env.PORT || 5000));
// ROUTES
// ===============================================

// Define the home page route.
app.get('/', function(req, res) {
	res.send('Our first route is working.:)');
});

app.get('/test', function(req, res) {
	res.send(
		{name: ["peter", "lois", "bryan"]}
		);
});

app.get('/parkingspots', function(req, res){
	dispatch.main(req, res, "park");
});

app.get('/applogin', function(req, res){
	dispatch.main(req, res, "login");
});

// START THE SERVER
// ===============================================

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
