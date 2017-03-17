//import db connection 
var users = require('../models/users.js');



module.exports = {

	//gets user details based on the ID passed through in params
	getUserDetail: function(req, res) {
		console.log('getProfile called with userID ' + req.params.id);
		users.findFullUserById(req.params.id, function(err, user) {
			console.log(user);
			if (err) {
				return (err);
			}
			if (!user) {
				return cb(null, false);
			} else {
				return res.json(user);
			}
		});
	},

	//gets user details based on the current logged in users ID
	getCurrentUser: function(req, res) {
		console.log('getProfile called with userID ' + req.user.id);
		//will need to add some error handling for people hitting this endpoint that aren't logged in
		users.findFullUserById(req.user.id, function(err, user) {
			console.log(user);
			if (err) {
				return (err);
			}
			if (!user) {
				return cb(null, false);
			} else {
				return res.json(user);
			}
		});
	},

	//gets user details based on the current logged in users ID
	getAllUsers: function(req, res) {
		console.log('getall users controller called');

		users.getAllUsers(function(err, users) {
			console.log(users);
			if (err) {
				return (err);
			}
			if (!users) {
				return cb(null, false);
			} else {

				return res.status(200).json(users);
			}
		});
	},



	//updates the user profile information based on the logged in user in req.user.id
	updateCurrentUser: function(req, res) {
		console.log('updateCurrentUser called with userID ' + req.user.id + 'and data ' + req.body);
		//will need to add some error handling for people hitting this endpoint that aren't logged in
		users.updateUserDetails(req.user.id, req.body, function(err, user) {
			console.log(user);
			if (err) {
				return (err);
			} else {
				console.log('response callback called with ' + user);
				return res.json(user);
			}
		});
	},

	//updates the user profile information based on the logged in user in req.user.id
	updateUserDetails: function(req, res) {
		console.log('updateUserDetails called with userID ');
		console.log(req.body);
		console.log(req);
		//will need to add some error handling for people hitting this endpoint that aren't logged in
		users.updateUserDetails(req.params.id, req.body, function(err, user) {
			console.log(user);
			if (err) {
				return (err);
			} else {
				console.log('response callback called with ' + user);
				return res.json(user);
			}
		});
	}



};