'use strict';

var path = process.cwd();
var RouteController = require('../controllers/routeController.js')

module.exports = function (app, passport) {

	var logged = false;

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			console.log("User is logged in.");
			logged = true;
			return next();
		} else {
			console.log("User is signed out.");
			logged = false;
			if(req.url == '/') return next();
			else res.redirect('/');
		}
	}
	function getLogged() {
		return logged;
	}

	var routeController = new RouteController();

	app.route('/')
		.get(isLoggedIn,function (req, res) {
			routeController.getPolls(req,res,'index',getLogged());
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

	app.route('/mypolls')
		.get(isLoggedIn,function (req, res) {
			routeController.getPolls(req,res,'mypolls',getLogged());
		});

	app.route('/view/:id')
		.get(function (req, res) {
			routeController.passPoll(req, res, getLogged());
		});

	app.route('/newpoll')
		.get(isLoggedIn,function (req, res) {
			res.render('newpoll', {logged: getLogged()});
		});

	app.route('/newpoll/submit')
		.post(isLoggedIn,routeController.newPoll);

	app.route('/savepoll/:id')
		.post(isLoggedIn,function (req, res) {
			routeController.votePoll(req, res, getLogged());
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
};
