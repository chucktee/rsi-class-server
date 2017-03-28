// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company
var express = require('express');
var app = express();

// Set the port to listen on. 3000 in this example
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

// Add / Setup handlebars view engine
var handlebars = require('express-handlebars');
// Point to a default template
app.engine('handlebars', handlebars({defaultLayout: 'main'}));

// Add handlebars to the app
app.set('view engine', 'handlebars');

//-----------------------------------------
// Setup some basic routes
//

// Default page
app.get('/construction', function(req,res){
	// Send the construction page
	res.render('construction');
});

app.get('/', function(req,res){
	// Send the construction page
	res.render('home');
});

// Stub of login page
app.get("/login", function (req, res) {
	// Send the login page
	res.render('login');
});
app.post("/login", function (req, res) {
    console.log(req.body.first_name);
		// Close connection
		res.status(200).json({result: 'success', data:{}});
});

// If no routes match, send the 404 page
app.use(function(req,res){
	res.status(404);
	// Send 404 status code
	res.render('404');
});

// Finally startup the server
app.listen(app.get('port'), function(){
	console.log( 'The Server is running. Open a browser and navigate to: http://localhost:3000');
});
