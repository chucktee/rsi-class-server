"use strict";

//-------------------------------------------------------------------------------------------
// GET Version
exports.version = function(req, res) {
	res.status(200).json({"result": "success", "data":{ "version": "1.0" }});		
};

//-------------------------------------------------------------------------------------------
// GET Add two numbers
exports.addTwo = function(req, res) {

	let answer = req.params.x + req.params.y;

	res.status(200).json({"result": "success", "data":{ "answer": answer }});		
};

//-------------------------------------------------------------------------------------------
// POST Format a mailing label
exports.makeHTMLMailingLabel = function(req, res) {

	let label = "";

	console.log(req.body);
	
	label += req.body.data.first_name + " " + req.body.data.last_name + "</br>";
	label += req.body.data.street_number + " " + req.body.data.street_name + "</br>";
	label += req.body.data.city + ", " + req.body.data.state + " " + req.body.zipcode + "</br>";

	res.status(200).json({"result": "success", "data":{ "label": label }});		
};

