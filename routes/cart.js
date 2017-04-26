"use strict";

// UUID
var uuid = require('uuid');

// Dates
var dateutil = require('dateutil');

//-------------------------------------------------------------------------------------------
// Version
exports.readCartVersion = function(req, res) {
	res.status(200).json({result: 'success', data:{ version : "1.0" }});		
};

//-------------------------------------------------------------------------------------------
// Add an item to the Cart
exports.addCart = function(req, res) {
	
	pool.connect(function(err, client, done) {
		
		var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			console.log(err);
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
	    };
	    // handle an error from the connect
		if(handleError(err)) return;

		// Validate
		if(req.body.id_product && req.body.id_customer) {
			// Let's grab / verify the item
			// NOTE: in the query, we are converting the money type into a numeric type so we can do math on it.
			// Postgres lets you do this without a loss of precision
			var queryText = 'SELECT unit_price::numeric FROM products WHERE id = $1;'
			client.query(queryText, [req.body.id_product], function(err, product_result) {
				// handle an error from the query
				if(handleError(err)) return;

				if(product_result.rowCount > 0) {

					var use_quantity = parseInt(req.body.quantity);
					var save_query_text;
					var bind_array;

					var queryText = 'SELECT id, quantity FROM cart WHERE id_customer = $1 AND id_product = $2;'
					client.query(queryText, [req.body.id_customer, req.body.id_product], function(err, quantity_result) {
						// handle an error from the query
						if(handleError(err)) return;

						if(quantity_result.rowCount > 0) {
							use_quantity += parseInt(quantity_result.rows[0].quantity);
							save_query_text = "UPDATE cart SET quantity = $1, date_updated = $2 WHERE id = $3 returning id, quantity;"
							bind_array = [use_quantity, dateutil.date(), quantity_result.rows[0].id];
							//console.log("Found an item already with quantity of " + quantity_result.rows[0].quantity + " setting quantity to " + use_quantity);
						} else {
							save_query_text = 'INSERT INTO cart (id, date_created, date_updated, id_product, id_customer, quantity) VALUES ($1, $2, $3, $4, $5, $6) returning id, quantity;'
							bind_array = [uuid.v4(), dateutil.date(), dateutil.date(), req.body.id_product, req.body.id_customer, use_quantity];
							//console.log("Did not find a matching item. Setting quantity to " + use_quantity);
						}

						client.query(save_query_text, bind_array, function(err, result) {
							done();
							// handle an error from the query
							if(handleError(err)) return;
							var totalForThisAddition = parseInt(req.body.quantity) * product_result.rows[0].unit_price;
							res.status(200).json({result: 'success', data:{ id : result.rows[0].id, quantity: result.rows[0].quantity, unit_price: product_result.rows[0].unit_price, total: totalForThisAddition }});	
						});

					});

				} else {
					done();
					res.status(200).json({result: 'success', data:{ id : 0, unit_price: 0, total: 0 }});	
				}
			});

		} else {
			done();
	    	res.status(400).json({ result: 'error', data:{error: 'id of the product and id of the customer are required'} });
		}
		
	});
	
}


//-------------------------------------------------------------------------------------------
// Get all Cart items for a customer
exports.readCart = function(req, res) {
	
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
		
		var queryText = 'SELECT c.*, (p.unit_price::numeric * c.quantity) AS line_total FROM cart c LEFT JOIN products p ON (p.id = c.id_product) WHERE c.id_customer = $1;';
		client.query(queryText, [req.params.id_customer], function(err, result) {
			if(handleError(err)) return;
			done();
			if(result.rowCount > 0) {
				var items = result.rows;
				res.status(200).json({result: 'success', data:{ items : items }});
			} else {
				res.status(200).json({result: 'success', data:{}});
			}
		});
	});
};


//---------------------------------------------------------------------------------------
// Update
exports.updateCart = function(req, res) {
	
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
			if(req.body) {
			
				if(req.body.id) {	
					
					var queryText = 'UPDATE cart SET date_updated = $2';			
					var argumentCount = 2;
					var valueArray = [req.body.id, dateutil.date()];
										
					if(req.body.quantity) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', quantity = $' + argumentCount; 
						valueArray.push(req.body.quantity);
					}

					queryText = queryText + ' WHERE id = $1 RETURNING id;';
					
					client.query(queryText, valueArray, function(err, result) {
		    			// handle an error from the query
						if(handleError(err)) return;
						done();
						if(result.rowCount > 0) {
							res.status(200).json({result: 'success', data:{ id : result.rows[0].id }});
						} else {
							res.status(400).json({ error: 'id not found' });	
						}
	      		});
      		
      		} else {
	      		done();
	      		res.status(400).json({ result:'error', data:{ error:'the cart line id is required inside the body object'} });
    		}
      	
    	} else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'Missing body object' } });
    	}
   
  	});
};

//---------------------------------------------------------------------------------------
// Delete
exports.deleteCartLine = function(req, res) {
	
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
			
			var queryText = 'DELETE FROM cart WHERE id = $1'
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





