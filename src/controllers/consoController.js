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
	listConsoToday().then(data => createTabPerHours(data));
}

function getEvolution() {
	var today = new Date().getTime().toString().substr(0, 5);
	
	return new Promise((resolve, reject) => {
		consoModel.find({ $or: [ { "tags.timestamp": new RegExp('^' + today) }, { "tags.timestamp": new RegExp('^' + (today-1)) } ] }, function(err, result) {
			resolve(result);
		});
	})
	
}

function listConsoToday() {
	var today = new Date().getTime().toString().substr(0, 5);
	
	return new Promise((resolve, reject) => {
		consoModel.find({ "tags.timestamp": new RegExp('^' + today) }, function(err, result) {
			resolve(result);
		});
	})
}

function createTabPerHours(array) {
	var hours = new Date(array[0].timestamp).getHours()
	var tabHours = [];
	var reccurent = 1;
	
	for (var i = 0, len = array.length; i < len; i++) {
		var currHours = new Date(array[i].timestamp).getHours();
		
		if(currHours == hours) {
			
			if(reccurent > 1 ) {
				tabHours[currHours] = {
					inject: (tabHours[currHours].inject + array[i].fields.inject)/reccurent,
					soutir: (tabHours[currHours].soutir + array[i].fields.soutir)/reccurent,
					autoconso: (tabHours[currHours].autoconso + array[i].fields.autoconso)/reccurent,
					prod: (tabHours[currHours].prod + array[i].fields.prod)/reccurent
				}
			} else {
				tabHours[currHours] = {
					inject: array[i].fields.inject,
					soutir: array[i].fields.soutir,
					autoconso: array[i].fields.autoconso,
					prod: array[i].fields.prod
				}
			}
		
			reccurent++;
		} else {
			hours = currHours;
			reccurent = 1;
			
			tabHours[currHours] = {
				inject: array[i].fields.inject,
				soutir: array[i].fields.soutir,
				autoconso: array[i].fields.autoconso,
				prod: array[i].fields.prod
			}
		}
	}
	
	console.log(tabHours);
}
