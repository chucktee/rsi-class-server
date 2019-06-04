"use strict";

//-------------------------------------------------------------------------------------------
// GET Version
exports.version = function(req, res) {
	res.status(200).json({"result": "success", "data":{ "version": "1.0" }});
};

//-------------------------------------------------------------------------------------------
// GET Add two numbers
exports.addTwo = function(req, res) {

	if( isNaN(req.params.first_number) || isNaN(req.params.second_number) ) {
		// No Bueno
		res.status(400).json({"result": "error", "data":{ "error": "Both variables must be integers." }});	
	} else {
		// Bueno
		let answer = parseInt(req.params.first_number) + parseInt(req.params.second_number);
		res.status(200).json({"result": "success", "data":{ "answer": answer }});	
	}
};


//-------------------------------------------------------------------------------------------
// POST Format a mailing label
exports.makeHTMLMailingLabel = function(req, res) {

	let label = "";
	
	label += req.body.data.first_name + " " + req.body.data.last_name + "</br>";
	label += req.body.data.street_number + " " + req.body.data.street_name + "</br>";
	label += req.body.data.city + ", " + req.body.data.state + " " + req.body.zipcode + "</br>";

	label = 1 / 0;

	res.status(200).json({"result": "success", "data":{ "label": label }});		
};

