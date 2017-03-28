"use strict";

// UUID
var uuid = require('node-uuid');

// Dates
var dateutil = require('dateutil');

// Stream
var QueryStream = require('pg-query-stream');


//-------------------------------------------------------------------------------------------
// Create a Product
exports.createProduct = function(req, res) {
	
	pool.connect(function(err, client, done) {
		
		var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			res.status(500).json({ error: err });
			return true;
	    };
	    // handle an error from the connect
		if(handleError(err)) return;
		
		// Validate then insert
		if(req.params.first_name && req.params.last_name) {
			
			var queryText = 'INSERT INTO customers (id, date_created, date_updated, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id'
			client.query(queryText, [uuid.v4(), dateutil.date(), dateutil.date(), req.params.first_name, req.params.last_name], function(err, result) {
				done();
				// handle an error from the query
				if(handleError(err)) return;
				res.status(200).json({result: 'success', data:{ id : result.rows[0].id }});	
	  		});
	  	
		} else {
			done();
	    	res.status(400).json({ error: 'first_name and last_name are required' });
		}
		
	});
	
}


//-------------------------------------------------------------------------------------------
// Get all Products as a Stream
exports.readProducts = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
		
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ error: err });
			return true;
    	};
    	
    	// handle an error from the connect
		if(handleError(err)) return;
			
			// Setup the query		
			var query = new QueryStream('SELECT * FROM products LIMIT 100');
			
			// handle an error from the query	
			if(handleError(err)) return;
			
			var wrappedStream = require('stream-wrap')({
				result: 'success',
				data: {
					products:'{{__target__}}'
        		}
			})
			var stream = client.query(query);
			stream.on('end', done);
			stream.pipe(JSONStream.stringify()).pipe(wrappedStream).pipe(res);

	});
};



//-------------------------------------------------------------------------------------------
// Get specific Product
exports.readProduct = function(req, res) {
	
	console.log("In Get specific Product");

	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
		
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done(client);
			res.status(500).json({ error: err });
			return true;
    	};
    	
    	// handle an error from the connect
		if(handleError(err)) return;

			var queryText = 'SELECT * FROM products WHERE id = $1;';
			client.query(queryText, [req.params.id], function(err, result) {
				if(handleError(err)) return;
				done();
				if(result.rowCount > 0) {
					for(var x=0;x<result.rowCount;x++) {
						res.send(result.rows[x].first_name + ' ' + result.rows[x].last_name);
					}
					res.status(200).json({result: 'success', data:{ result }});
				} else {
					done();
					res.status(200).json({result: 'success', data:{}});
				}
	  		}); 
	});
};

//---------------------------------------------------------------------------------------
// Update
exports.updateProduct = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};

    	// handle an error from the connect
		if(handleError(err)) return;

		// Validate then insert
		if(req.params.id) {
			done();
			res.status(200).json({result: 'success', data:{count : result.rowCount}});
    	} else {
	    	done();
	    	res.status(400).json({ error: 'id is required' });
    	}
   
  	});
};

//---------------------------------------------------------------------------------------
// Delete
exports.deleteProduct = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};

    	// handle an error from the connect
		if(handleError(err)) return;

		// Validate then insert
		if(req.params.id) {
			
			var queryText = 'DELETE FROM products WHERE id = $1'
			client.query(queryText, [req.params.id], function(err, result) {
    			// handle an error from the query
				if(handleError(err)) return;
				done();
				res.status(200).json({result: 'success', data:{count : result.rowCount}});
      		});
      	
    	} else {
	    	done();
	    	res.status(400).json({ error: 'id is required' });
    	}
   
  	});
};


