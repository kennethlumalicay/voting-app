'use strict';

var path = process.cwd();

var NavController = require(path + '/app/controllers/navController.js');

module.exports = function (app, passport) {

	var logged = false;

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			console.log("User is logged in.");
			//NavController.changeNav(true);
			logged = true;
			return next();
		} else {
			//res.redirect('/login');
			console.log("User is signed out.");
			console.log("req",req.url);
			//NavController.changeNav(false);
			logged = false;
			if(req.url == '/') return next();
			else res.redirect('/');
		}
	}
	function getLogged() {
		return logged;
	}


	app.route('/') // removed isloggedin
		.get(isLoggedIn,function (req, res) {
			res.render('index', {logged: getLogged()});
		});

	app.route('/login')
		.get(function (req, res) {
			res.redirect('/auth/github');
		});

	app.route('/signout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/mypolls') // removed isloggedin
		.get(isLoggedIn,function (req, res) {
			res.render('mypolls', {logged: getLogged()});
		});

	app.route('/newpoll') // removed isloggedin
		.get(isLoggedIn,function (req, res) {
			res.render('newpoll', {logged: getLogged()});
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
};
