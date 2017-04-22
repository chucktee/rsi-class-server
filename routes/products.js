"use strict";

// UUID
var uuid = require('uuid');

// Dates
var dateutil = require('dateutil');

//-------------------------------------------------------------------------------------------
// Create a Product
exports.createProduct = function(req, res) {
	
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
		if(req.body.product_name) {

			// If these are undefined, set to 0
			var qty_on_hand = req.body.qty_on_hand ? req.body.qty_on_hand : 0;
			var unit_price = req.body.unit_price ? req.body.unit_price : 0;
			var cost = req.body.cost ? req.body.cost : 0.00;

			var queryText = 'INSERT INTO products (id, date_created, product_name, id_type, id_scent_type, qty_on_hand, size, unit_price, cost, in_store) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, product_name'
			client.query(queryText, [uuid.v4(), dateutil.date(), req.body.product_name, req.body.id_type, req.body.id_scent_type, qty_on_hand, req.body.size, unit_price, cost, req.body.in_store], function(err, result) {
				done();
				// handle an error from the query
				if(handleError(err)) return;
				res.status(200).json({result: 'success', data:{ id : result.rows[0].id, product_name : result.rows[0].product_name }});	
			});
	  	
		} else {
			done();
	    	res.status(400).json({ result: 'error', data:{error: 'product_name is required'} });
		}
		
	});
	
}


//-------------------------------------------------------------------------------------------
// Get all Products
exports.readProducts = function(req, res) {
	
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
		var queryText = 'SELECT p.*, t.label as product_type, s.label as scent_type FROM products p LEFT JOIN product_types t ON (t.id = p.id_type) LEFT JOIN scent_types s ON (s.id = p.id_scent_type);';
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
// Get all Best Selling Products
exports.readBestSellers = function(req, res) {
	
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
		var queryText = 'SELECT product_name, unit_price FROM products WHERE best_seller = true;';
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
// Get all Best Selling Products stripped for a table
exports.readBestSellersMin = function(req, res) {
	
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
		var queryText = 'SELECT product_name, unit_price FROM products WHERE best_seller = true;';
		client.query(queryText, [], function(err, result) {
			if(handleError(err)) return;
			done();
			if(result.rowCount > 0) {
				var data = result.rows;
				res.status(200).json({data});
			} else {
				res.status(200).json({data});
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
			res.status(500).json({ result:'error', data:{ error:err } });
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

//-------------------------------------------------------------------------------------------
// Get Product with LIKE
exports.searchProduct = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
		
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done(client);
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};
    	
    	// handle an error from the connect
		if(handleError(err)) return;

		var queryText = "SELECT * FROM products WHERE product_name ILIKE $1;";
		var param = '%' + req.params.partial_name + '%';
		client.query(queryText, [param], function(err, result) {
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
			if(req.body) {
			
				if(req.body.id) {	
					
					var queryText = 'UPDATE products SET date_updated = $2';			
					var argumentCount = 2;
					var valueArray = [req.body.id, dateutil.date()];
										
					if(req.body.product_name) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', product_name = $' + argumentCount; 
						valueArray.push(req.body.product_name);
					}
					if(req.body.id_type) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', id_type = $' + argumentCount; 
						valueArray.push(req.body.id_type);
					}
					if(req.body.id_scent_type) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', id_scent_type = $' + argumentCount; 
						valueArray.push(req.body.id_scent_type);
					}
					if(req.body.qty_on_hand) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', qty_on_hand = $' + argumentCount; 
						valueArray.push(req.body.qty_on_hand);
					}
					if(req.body.size) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', size = $' + argumentCount; 
						valueArray.push(req.body.size);
					}
					if(req.body.unit_price) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', unit_price = $' + argumentCount; 
						valueArray.push(req.body.unit_price);
					}
					if(req.body.cost) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', cost = $' + argumentCount; 
						valueArray.push(req.body.cost);
					}
					if(req.body.in_store) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', in_store = $' + argumentCount; 
						valueArray.push(req.body.in_store);
					}

					queryText = queryText + ' WHERE id = $1 RETURNING id;';
		
					// Remove for production
					console.log("Query: " + queryText);
					console.log("Values: " + valueArray);
					// End
					
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
	      		res.status(400).json({ result:'error', data:{ error:'the product id is required inside the body object'} });
    		}
      	
    	} else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'Missing body object' } });
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
	    	res.status(400).json({ result: 'error', data:{error: 'id is required'} });
    	}
   
  	});
};

//-------------------------------------------------------------------------------------------
// Get dollar amount of our on-hand inventory
exports.totalCostofOnHand = function(req, res) {
	
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
		var queryText = 'SELECT SUM(qty_on_hand * cost) as total_cost FROM products;';
		client.query(queryText, [], function(err, result) {
			if(handleError(err)) return;
			done();
			if(result.rowCount > 0) {
				var products = result.rows;
				res.status(200).json({result: 'success', data:{ total_cost : result.rows[0].total_cost }});
			} else {
				res.status(200).json({result: 'success', data:{ total_cost : 0.00 }});
			}
		});
	});
};


