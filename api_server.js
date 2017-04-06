// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company
var express = require('express');
var app = express();

// Set the port to listen on. 3000 in this case
app.set('port', process.env.PORT || 3000);

// Setup to serve static files
app.use(express.static(__dirname + '/public'));

// Add BodyParser to read HTTP message body
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Morgan for logging
var morgan = require('morgan');
app.use(morgan(':date :remote-addr :method :url :status :response-time ms - :res[content-length]'));

// Kill cache 304 response
app.disable('etag');

// CORS for cross origin calls
// Study link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
var cors = require('cors');
app.use(cors());


// =============================================================================
// Postgres
// =============================================================================
var config = {
  user: 'postgres', 				// env var: PGUSER
  database: 'richwood-scentific', 	// env var: PGDATABASE
  password: 'postgres', 			// env var: PGPASSWORD
  host: 'localhost', 				// Server hosting the postgres database
  port: 5432, 						// env var: PGPORT ** CHECK YOUR PORT
  max: 10, 							// max number of clients in the pool
  idleTimeoutMillis: 30000	 		// how long a client is allowed to remain idle before being closed
};
var Pool = require('pg-pool')
global.pool = new Pool(config)

// attach an error handler to the pool for when a connected, idle client
// receives an error by being disconnected, etc
pool.on('error', function(error, client) {
  // handle this in the same way you would treat process.on('uncaughtException')
  // it is supplied the error as well as the idle client which received the error
  console.log('Pool received an error: ' + error)
});


//-----------------------------------------
// Startup the server
app.listen(app.get('port'), function(){
	console.log( 'The API Server is running at http://localhost:3000');
});


//-----------------------------------------
// API routes
//

//-----------------------------------------
// Products

var products = require('./routes/products');

// Create
app.post('/api/product', products.createProduct);

// Read all
app.get('/api/products', products.readProducts);

// Read all best sellers
app.get('/api/bestsellers', products.readBestSellers);
// Read all best sellers minified
app.get('/api/bestsellersmin', products.readBestSellersMin);

// Read one
app.get('/api/product/:id', products.readProduct);

// Update
app.put('/api/product', products.updateProduct);

// Delete
app.delete('/api/product', products.deleteProduct);

// Find one with LIKE
app.get('/api/like_product/:partial_name', products.searchProduct);

// Get the total cost of on-hand inventory
app.get('/api/product_cost', products.totalCostofOnHand);

//-----------------------------------------

//-----------------------------------------
// Product Types

var product_types = require('./routes/product_types');

// Create
app.post('/api/product_type', product_types.createProductType);

// Read all
app.get('/api/product_types', product_types.readProductTypes);

// Update
app.put('/api/product_type', product_types.updateProductType);

// Delete
app.delete('/api/product_type', product_types.deleteProductType);

//-----------------------------------------
// Scent Types

var scent_types = require('./routes/scent_types');

// Create
app.post('/api/scent_type', scent_types.createScentType);

// Read all
app.get('/api/scent_types', scent_types.readScentTypes);

// Update
app.put('/api/scent_type', scent_types.updateScentType);

// Delete
app.delete('/api/scent_type', scent_types.deleteScentType);

//-----------------------------------------
// Finally If no routes match, send 404
app.use(function(req,res) {
	res.status(404).json({result: 'not found', data:{}});
});

