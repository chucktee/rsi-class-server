// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company 
var express = require('express');
var app = express();  

// Set the port to listen on. 3000 in this example
app.set('port', process.env.PORT || 3000);

// Setup to serve statis files
app.use(express.static(__dirname + '/public')); 

// Add / Setup handlebars view engine
var handlebars = require('express-handlebars');
// Point to a default template
app.engine('handlebars', handlebars({defaultLayout: 'main'})); 

// Add handlebars to the app
app.set('view engine', 'handlebars'); 

// Setup some basic routes
app.get('/', function(req,res){ 
	// Send the construction page
	res.render('construction');  
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