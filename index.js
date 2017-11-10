var express = require('express');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser());		// Parse cookies from incoming messages
app.use(bodyParser.json());		// Parse json-encoded body of post request

var dispatch = require('./dispatch.js');
var passport = require('passport');

const {Strategy} = require('passport-cookie');
var Users = require('./users.js');

console.log(Users);

app.set('port', (process.env.PORT || 5000));

// AUTHENTICATION STRATEGY
// ===============================================
passport.use(new Strategy(
    {cookieName: 'auth'},
    function(token, done){
	Users.authenticate(token)
	    .then(
		(res) => {
		    done(null, res);
		}, (err) => {
		    done(err);
		});
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
	    your_cookies: req.cookies,
	    protocol: req.protocol
	}
    );
});

app.get('/parkingspots',
	passport.authenticate("cookie", { session: false }),
	function(req, res){
	    console.log(req.user)
	    if(1 || req.protocol == 'https'){
		dispatch.main(req, res, "park");
	    }else{
		res.status(400);
	    }
	});

app.post('/login', function(req, res){
    if(1 || req.protocol == 'https'){
	dispatch.main(req, res, "login");
    }else{
	res.status(400);
    }
});

// START THE SERVER
// ===============================================

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
