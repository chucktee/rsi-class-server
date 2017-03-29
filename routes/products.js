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
		if(req.params.product_name) {
			
			var queryText = 'INSERT INTO products (id, product_name) VALUES ($1, $2) RETURNING id'
			client.query(queryText, [uuid.v4(), req.params.product_name], function(err, result) {
				done();
				// handle an error from the query
				if(handleError(err)) return;
				res.status(200).json({result: 'success', data:{ id : result.rows[0].id }});	
	  		});
	  	
		} else {
			done();
	    	res.status(400).json({ error: 'product_name is required' });
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
		var queryText = 'SELECT * FROM products;';
		client.query(queryText, [], function(err, result) {
			if(handleError(err)) return;
			done();
			if(result.rowCount > 0) {
				var products = result.rows;
				res.status(200).json({result: 'success', data:{ products : products }});
			} else {
				res.status(200).json({result: 'success', data:{}});
			}
		});
	});
};



//-------------------------------------------------------------------------------------------
// Get specific Product
exports.readProduct = function(req, res) {
	
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
				var products = result.rows;
				res.status(200).json({result: 'success', data:{ products : products }});
			} else {
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


