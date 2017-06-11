'use strict';

var Polls = require('../models/polls');

function RouteController () {
	this.newPoll = function (req, res) {
		var ownerId = req.user.github.id;
		var id = new Date().getTime().toString(16);
		var title = req.body.title;
		var choices = req.body.options.split(/ , |, | ,|,/g);

		var newPollItem = new Polls({
			poll: {
				ownerId: ownerId,
				id: id,
				title: title,
				choices: choices
			}
		});
		
		newPollItem.save(function(err) {
			if(err) throw err;
			else console.log(newPollItem.title,"has been successfully added to the database.");
		});

		res.redirect('/');
	};

	this.getPolls = function(req, res, view, logged) {
		var filter = view == 'index' ? {} : { "poll.ownerId" : req.user.github.id };
		Polls.find(filter,function(err, data) {
			if(err) throw err;
			else {
				console.log(filter);
				var htmlStr = [];
				data.forEach((val,i) => {
					htmlStr.unshift('<a href=\''+process.env.APP_URL+val.poll.id+'\' class=\'poll-item\'>'+val.poll.title+'?</a>');
				});
				res.render(view, {logged: logged, htmlStr: htmlStr.join('')});
			}
		})
	}
}

module.exports = RouteController;