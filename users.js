const {Client} = require('pg');
var pHash = require('password-hash');

// The user authentication system
const Users = module.exports = (function(){
    // Initialize database with desired structure
    var client = new Client({
	connectionString: process.env.DATABASE_URL
    });

    client.connect();
    client.query(
	`SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'c2gdat';`, (err, res) =>
	    {
		if(err){
		    client.end();
		    throw err;
		}

		if(res.rowCount < 1){
		    console.log('Schema missing: adding c2gdat schema');
		    client.query(
			'CREATE SCHEMA c2gdat', (err, res) =>
			    {
				if(err){
				    client.end();
				    throw err;
				}
			    });
		}

		
		// Check for the correct table
		client.query(
		    `SELECT table_name
FROM information_schema.tables
WHERE table_name = 'users'
AND table_schema = 'c2gdat'`, (err2, res2) =>
			{
			    if(err2){
				clent.end();
				throw err2;
			    }

			    if(res2.rowCount < 1){
				console.log('Table missing: adding users table');
				client.query(
				    `CREATE TABLE c2gdat.users(
access_key	varchar(256) PRIMARY KEY,
email		varchar(128) NOT NULL,
key_valid	bool
);
INSERT INTO c2gdat.users
VALUES('peanut', 'will@starfleet.net', true);`, (err3, res3) =>
					{
					    client.end();
					    
					    if(err3){
						throw err3;
					    }
					});
			    }else{
				client.end();
			    }
			});
	    });
    
    // Return all rows matching the provided access_key
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

    // Return a list of users with pending access
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

    // Remove all user records with a matching email address.
    const _deleteUserByEmail = function(email, pending = true){
	return new Promise(function(resolve, reject){
	    var client = new Client({
		connectionString: process.env.DATABASE_URL
	    });

	    client.connect();
	    client.query(`
		DELETE FROM c2gdat.users
WHERE email = '` + email + `'
AND key_valid = ` + !pending + ';',
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
	    _deleteUserByEmail(email, true)
		.then(
		    (res) => {
			insertUser(email, resolve, reject);
		    }, (err) => {
			console.log(err);
		    });
	});
    };

    //Validates a user based on the provided email
    this.verifyUser = function(email){
	return new Promise(function(resolve, reject){
	    _getPendingUsers()
		.then(
		    (res) => {
			r = res.find(r => r['email'] == email);
			if(r){
			    _deleteUserByEmail(email, false);
			    
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
				    resolve();
				});
			}else{
			    console.log('User ' + email + ' not pending');
			    reject();
			}
		    }, (err) => {
			console.log(err);
			reject();
		    });
	});
    };
    
    return {
	authenticate: this.authenticate,
	verifyUser: this.verifyUser,
	addUser: this.addUser
    };
})();

// Users.addUser('will@starfleet.net')
//     .then((r) => {
// 	console.log(r);
// 	Users.addUser('will@starfleet.net')
// 	    .then((r) => {
// 		console.log(r)
// 		Users.verifyUser('will@starfleet.net')
// 		setTimeout(() => {
// 		    Users.addUser('will@starfleet.net');
// 		}, 1000);
// 	    });
//     });


