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

//-----------------------------------------
// Startup the server
app.listen(app.get("port"), function(){
	console.log( "The API Server is running at http://localhost:" + app.get("port"));
});

module.exports = app;



//-----------------------------------------
// API routes
//

//-----------------------------------------
// Play Functions

const play = require("./routes/play");

// App Version
app.get("/api/version", play.version);

// Add Two Version
app.get("/api/add-two/:x/:y", play.addTwo);

// Make an HTML mailing label
app.post("/api/make-mailer", play.makeHTMLMailingLabel);

//-----------------------------------------


//-----------------------------------------
// Finally If no routes match, send 404
app.use(function(req,res) {
	res.status(404).json({"result": "not found", "data":{}});
});

