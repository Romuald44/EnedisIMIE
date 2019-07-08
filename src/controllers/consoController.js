const mongoose = require('mongoose');
var consoModel = require('../models/consoModel.js');

exports.index = function(req, res) {
	//getConsoCumulToday().then(data => console.log(data));//res.render('conso', {conso: data})
	
	/*Promise.all([getConsoCumulToday(), getConsoPerHoursToday()]).then(function(data) {
	  console.log(data)
	});*/
	
	getConsoPerHoursToday();
};

function getConsoCumulToday() {
	var today = new Date().getTime().toString().substr(0, 5);
	
	return new Promise((resolve, reject) => {
		consoModel.aggregate([
		   { $match: { "tags.timestamp": new RegExp('^' + today) } },
		   { $group: { _id: "consommation", 
			   tot_inject: { $sum: "$fields.inject" }, 
			   tot_soutir: { $sum: "$fields.soutir" },
			   tot_autoconso: { $sum: "$fields.autoconso" },
			   tot_prod: { $sum: "$fields.prod" }
			    } }
		], function(err, result) {
			resolve(result);
		});
	})
}

function getConsoPerHoursToday() {
	listConsoToday().then(data =>
		console.log(data[0].timestamp)
	);
}

function listConsoToday() {
	var today = new Date().getTime().toString().substr(0, 5);
	
	return new Promise((resolve, reject) => {
		consoModel.find({ "tags.timestamp": new RegExp('^' + today) }, function(err, result) {
			resolve(result);
		});
	})
}
