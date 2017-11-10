const {Client} = require('pg');

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
WHERE access_key = ` + key + ';',
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
			    resolve();
			}else{
			    reject('key not yet valid');
			}
		    },
		    (err) => {
			reject('key not found');
		    }
		);
	});
    };

    this.addUser = function(email){
	return new Promise(function(resolve, reject){
	    var insertUser = function(email){
		var client = new Client({
		    connectionString: process.env.DATABASE_URL
		});

		var key;
		
		client.connect();
		client.query(
		    `INSERT INTO c2gdat.users
VALUES (` + key + ", '" + email + "', false);",
		    (err, res) => {
			if(err){
			    if(err.code == 23505){
				insertUser(email);
			    }
			}
			client.end();
		    });
	    }
	    
	    _getPendingUsers()
		.then(
		    (res) => {
			r = res.find(r => r['email'] == email);
			if(r){
			    resolve();
			}else{
			    insertUser(email);
			    resolve();
			}
		    }, (err) => {
			reject(err);
		    });
	});
    };

    //Validates a user based on the provided email
    this.validateUser = function(email){
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
WHERE access_key = ` + r.access_key + ';',
			    (err, res) => {
				client.end();
			    });
		    }
		});
    };
    
    return {
	authenticate: this.authenticate,
	validateUser: this.validateUser,
	addUser: this.addUser
    };
})();


Users.authenticate(1)
    .then(
	(res) => {
	    console.log('all good');
	}, (err) => {
	    console.log(err);
	}
    );

Users.authenticate(2)
    .then(
	(res) => {
	    console.log('all good');
	}, (err) => {
	    console.log(err);
	}
    );

Users.addUser('will@mail.net');
