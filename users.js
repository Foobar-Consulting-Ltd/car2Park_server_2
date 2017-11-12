const {Client} = require('pg');
var pHash = require('password-hash');

// The user authentication system
const Users = module.exports = (function(){
    // TODO: Some stuff

    const _getRowByKey = function(key){
	return new Promise(function(resolve, reject){
	    var client = new Client({
		connectionString: process.env.DATABASE_URL
	    });

	    client.connect();
	    client.query(
		`SELECT * 
FROM c2gdat.users
WHERE access_key = '` + key + "';",
		(err, res) => {
		    if(err){
			reject(err);
		    }else{
			if(res.rows.length > 0){
			    resolve(res.rows);
			}else{
			    reject(null);
			}
		    }
		    client.end();
		});
	});
    };

    const _getPendingUsers = function(){
	return new Promise(function(resolve, reject){
	    var client = new Client({
		connectionString: process.env.DATABASE_URL
	    });

	    client.connect();
	    client.query(
		`SELECT * 
FROM c2gdat.users
WHERE key_valid = false;`,
		(err, res) => {
		    if(err){
			reject(err);
		    }else{
			resolve(res.rows);
		    }
		    client.end();
		});
	});
    };

    const _deleteUserByEmail = function(email){
	return new Promise(function(resolve, reject){
	    var client = new Client({
		connectionString: process.env.DATABASE_URL
	    });

	    client.connect();
	    client.query(`
		DELETE FROM c2gdat.users
WHERE email = '` + email + "';",
		(err, res) => {
		    if(err){
			reject(err);
		    }else{
			resolve(res.rows);
		    }
		    client.end();
		});
	});
    }

    // Check to see the provided key exists and is valid.
    // Resolves if the key is valide.
    // Rejects otherwise
    // Returns a promise
    this.authenticate = function(userKey){
	return new Promise(function(resolve, reject){
	    var urow;
	    _getRowByKey(userKey)
		.then(
		    (res) => {
			urow = res[0];
			if(urow['key_valid']){
			    resolve(urow.email);
			}else{
			    resolve(null); // No user
			}
		    },
		    (err) => {
			resolve(null); // User not yet valid
		    }
		);
	});
    };

    // Adds a user account
    // Returns a promise that resolves if successful
    this.addUser = function(email){
	var insertUser = function(email, resolve, reject){
	    var client = new Client({
		connectionString: process.env.DATABASE_URL
	    });

	    console.log('here');
	    var nonce = Math.floor(Math.random() * 256)
	    var key = pHash.generate(email + nonce);
	    console.log('inserting ' + email + ' with key ' + key);
	    
	    client.connect();
	    client.query(
		`INSERT INTO c2gdat.users
VALUES ('` + key + "', '" + email + "', false);",
		(err, res) => {
		    if(err){
			console.log(err);
			if(err.code == 23505){
			    insertUser(email, resolve, reject);
			}else{
			    reject();
			}
		    }else{
			console.log('we did it!');
			resolve(key);
		    }
		    
		    client.end();
		});
	}

	return new Promise(function(resolve, reject){
	    _getPendingUsers()
		.then(
		    (res) => {
			r = res.find(r => r['email'] == email);
			if(!r){
			    console.log('replacing user');
			    _deleteUserByEmail(email)
				.then((res) => {
				    console.log('about to insert');
				    insertUser(email, resolve, reject);
				}, (err) => {
				    console.log(err);
				    reject();
				});
			}else{
			    resolve(r['access_key']);
			}
		    }, (err) => {
			reject(err);
		    });
	});
    };

    //Validates a user based on the provided email
    this.verifyUser = function(email){
	_getPendingUsers()
	    .then(
		(res) => {
		    r = res.find(r => r['email'] == email);
		    if(r){
			var client = new Client({
			    connectionString: process.env.DATABASE_URL
			});
			
			client.connect();
			client.query(
			    `UPDATE c2gdat.users
SET key_valid = true
WHERE access_key = '` + r.access_key + "';",
			    (err, res) => {
				client.end();
			    });
		    }else{
			console.log('User ' + email + ' not pending');
		    }
		}, (err) => {
		    console.log(err);
		});
    };
    
    return {
	authenticate: this.authenticate,
	verifyUser: this.verifyUser,
	addUser: this.addUser
    };
})();
