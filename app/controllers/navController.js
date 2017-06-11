'use strict';

var loggedIn = function(isLoggedIn) {
	var login = $('#login-a') || null;
	var polls = $('#polls-a') || null;
	var myPoll = $('#mypolls-a') || null;
	var newPoll = $('#newpoll-a') || null;
	var signout = $('#signout-a') || null;

	if(isLoggedIn) {
		login.addClass('hide').removeClass('show');
		polls.addClass('show').removeClass('hide');
		myPoll.addClass('show').removeClass('hide');
		newPoll.addClass('show').removeClass('hide');
		signout.addClass('show').removeClass('hide');
	} else {
		login.addClass('show').removeClass('hide');
		polls.addClass('hide').removeClass('show');
		myPoll.addClass('hide').removeClass('show');
		newPoll.addClass('hide').removeClass('show');
		signout.addClass('hide').removeClass('show');
	}
};