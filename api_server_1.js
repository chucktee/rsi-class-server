// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company
const express = require("express");
const app = express();

// Set the port to listen on. 3000 in this case
app.set("port", process.env.PORT || 3000);

// Add BodyParser to read HTTP message body
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Morgan for logging
//const morgan = require("morgan");
//app.use(morgan(":date :remote-addr :method :url :status :response-time ms - :res[content-length]"));


// =============================================================================
// Postgres
// =============================================================================
var config = {
	user: "piuser", 				    // env var: PGUSER
	database: "ClassDatabase", 			// env var: PGDATABASE
	password: "piuserpassword", 		// env var: PGPASSWORD
	host: "piserver.local", 			// Server hosting the postgres database
	port: 5432, 						// env var: PGPORT ** CHECK YOUR PORT
	max: 10, 							// max number of clients in the pool
	idleTimeoutMillis: 30000	 		// how long a client is allowed to remain idle before being closed
  };
  const Pool = require("pg-pool");
  global.pool = new Pool(config);
  
  // attach an error handler to the pool for when a connected, idle client
  // receives an error by being disconnected, etc
  pool.on("error", function(error, client) {
	// handle this in the same way you would treat process.on('uncaughtException')
	// it is supplied the error as well as the idle client which received the error
	console.log("Pool received an error: " + error);
  });


//-----------------------------------------
// Startup the server
app.listen(app.get("port"), function(){
	console.log( "The API Server is running at http://localhost:" + app.get("port"));
});

module.exports = app;



//-----------------------------------------
// API routes
//

const play = require("./routes/play");
const users = require("./routes/users");

//-----------------------------------------
// Play Functions
// App Version
app.get("/api/version", play.version);
// Add Two Version
app.get("/api/add-two/:x/:y", play.addTwo);
// Make an HTML mailing label
app.post("/api/make-mailer", play.makeHTMLMailingLabel);
//-----------------------------------------

//-----------------------------------------
// Users Functions
// Add User Version
app.post("/api/user", users.createUser);
//-----------------------------------------

//-----------------------------------------
// Finally If no routes match, send 404
app.use(function(req,res) {
	res.status(404).json({"result": "not found", "data":{}});
});

