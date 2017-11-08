var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser())		// Parse cookies from incoming messages

var dispatch = require('./dispatch.js');
var passport = require('passport');

const {Strategy} = require('passport-cookie');

app.set('port', (process.env.PORT || 5000));

// AUTHENTICATION STRATEGY
// ===============================================
passport.use(new Strategy(
    {cookieName: 'auth'},
    function(token, done){
	console.log(token)
	return done(null, 'Fred');
    }
));

// ROUTES
// ===============================================

// Define the home page route.
app.get('/', function(req, res) {
    res.send('Our first route is working.:)');
});

app.get('/test', function(req, res) {
    res.send(
	{
	    name: ["peter", "lois", "bryan"],
	    your_cookies: req.cookies
	}
    );
});

app.get('/parkingspots',
	passport.authenticate("cookie", { session: false }),
	function(req, res){
	    console.log('Was secure: ' + req.secure);
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
