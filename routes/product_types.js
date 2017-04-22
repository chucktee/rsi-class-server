"use strict";

// UUID
var uuid = require('uuid');

// Dates
var dateutil = require('dateutil');


//-------------------------------------------------------------------------------------------
// Create a Product Type
exports.createProductType = function(req, res) {
	
	pool.connect(function(err, client, done) {
		
		var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
	    };
	    // handle an error from the connect
		if(handleError(err)) return;
		
		// Validate then insert
		if(req.body.label) {
            
			var queryText = 'INSERT INTO product_types (id, date_created, label, description) VALUES ($1, $2, $3) RETURNING id, label'
			client.query(queryText, [uuid.v4(), dateutil.date(), req.body.label, req.body.description], function(err, result) {
				done();
				// handle an error from the query
				if(handleError(err)) return;
				res.status(200).json({result: 'success', data:{ id : result.rows[0].id, label : result.rows[0].label }});	
			});
	  	
		} else {
			done();
	    	res.status(400).json({ result: 'error', data:{error: 'label is required'} });
		}
		
	});
	
}


//-------------------------------------------------------------------------------------------
// Get all Product Types
exports.readProductTypes = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
		
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			console.log(err);
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};
    	
    	// handle an error from the connect
		if(handleError(err)) return;
		var queryText = 'SELECT * FROM product_types;';
		client.query(queryText, [], function(err, result) {
			if(handleError(err)) return;
			done();
			if(result.rowCount > 0) {
				var product_types = result.rows;
				res.status(200).json({result: 'success', data:{ product_types : product_types }});
			} else {
				res.status(200).json({result: 'success', data:{}});
			}
		});
	});
};

//---------------------------------------------------------------------------------------
// Update
exports.updateProductType = function(req, res) {
	
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
	    	rres.status(400).json({ result: 'error', data:{error: 'id is required'} });
    	}
   
  	});
};

//---------------------------------------------------------------------------------------
// Delete
exports.deleteProductType = function(req, res) {
	
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
			
			var queryText = 'DELETE FROM product_types WHERE id = $1'
			client.query(queryText, [req.params.id], function(err, result) {
    			// handle an error from the query
				if(handleError(err)) return;
				done();
				res.status(200).json({result: 'success', data:{count : result.rowCount}});
      		});
      	
    	} else {
	    	done();
	    	res.status(400).json({ result: 'error', data:{error: 'id is required'} });
    	}
   
  	});
};