"use strict";

const uuid = require("uuid");
const dateutil = require("dateutil");
const password = require("password-hash-and-salt");

//-------------------------------------------------------------------------------------------
// POST Sign Up

exports.createUser = function(req, res) {
	
	if(req.body.data) {
		if(req.body.data.email && req.body.data.password) {

			// get a pg client from the connection pool
			pool.connect(function(err, client, done) {

				var handleError = function(err) {
					// no error occurred, continue with the request
					if(!err) return false;
					done();
					res.status(500).json({ "result":"error", "data":{ "error":err } });
					return true;
				};
				
				// handle an error from the connect
				if(handleError(err)) return;

				var first_name = req.body.data.first_name ? req.body.data.first_name : "";
				var last_name = req.body.data.last_name ? req.body.data.last_name : "";
						
				// Does this username / email already exist?
				emailExists(req.body.data.email, function(err, result) {	
					if(err) {
						done();
						res.status(500).json({ "result":"error", "data":{ "error":err } });
					} else {
						// No error from the call, so check result of if it exists
						if(result == true) {
							done();
							res.status(400).json({ "result":"error", "data":{ "error":'user account already exists' } });
						} else {
							// Email doesn't already exist, so create account
							//password function
							password(req.body.data.password).hash(function(err, hash) {
								if(handleError(err)) return;
								//Otherwise- Save				
								var queryText = 'INSERT INTO users (id, first_name, last_name, email, password, date_created, date_updated) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id'
								client.query(queryText, [uuid.v4(), first_name, last_name, req.body.data.email, hash, dateutil.date(), dateutil.date()], function(err, result) {
									// handle an error from the query
									if(handleError(err)) return;	
									done();
									res.status(200).json({"result": 'success', "data":{id : result.rows[0].id}});
								});
							});
						}
					}
				});
				
			});
						
		} else {
			done();
			res.status(400).json({ "result":"error", "data":{"error":"email and password are required" } });
		}
		
	} else {
		done();
		res.status(400).json({ "result":"error", "data":{ "error":"Missing data object" } });
	}
   
};


//---------------------------------------------------------------------------------------------
//
// Functions for Customers
//

// Does this email already exist in the database?
function emailExists(emailValue, callback) {
		
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
    	
		var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			callback({"error":"Database Error"},false);
    	};
    	
    	// handle an error from the connect
		if(handleError(err)) return;
		
		var queryText = "SELECT email FROM users WHERE email = $1;";
		client.query(queryText, [emailValue], function(err, result) {
			if(handleError(err)) return;

			done();

			if(result.rowCount > 0) {
				callback(null,true);	
			} else {
				callback(null,false);
			}		
		});
   
  	});
};