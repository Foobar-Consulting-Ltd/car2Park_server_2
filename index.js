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
})

app.get('/test2', function(req, res){
	dispatch.main(res, "");
})

// START THE SERVER
// ===============================================

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
