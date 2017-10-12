var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8080));
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

// START THE SERVER
// ===============================================

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
