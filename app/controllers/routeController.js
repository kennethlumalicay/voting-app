'use strict';

var Polls = require('../models/polls');

function RouteController () {
	this.newPoll = function (req, res) {
		var ownerId = req.user.github.id;
		var id = new Date().getTime().toString(16);
		var title = req.body.title;
		var choices = req.body.options.split(/ , |, | ,|,/g);
		choices = choices.map(e=>({choice: e, votes: 0}));

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
					htmlStr.unshift('<a href=\''+process.env.APP_URL+'view/'+val.poll.id+'\' class=\'poll-item\'>'+val.poll.title+'?</a>');
				});
				res.render(view, {
					logged: logged,
					htmlStr: htmlStr.join('')
				});
			}
		})
	}

	this.passPoll = function(req, res, logged) {
		Polls.findOne({ "poll.id" : req.params.id}, function(err, data) {
			if(err) throw err;
			else {
				var arr = data.poll.choices.map(e=>[e.choice,e.votes]);
				res.render('poll', {
					logged: logged,
					pollId: data.poll.id,
					choicesArr: arr,
					pollTitle: data.poll.title
				});
			}
		});
	}

	this.votePoll = function(req, res, logged) {
		Polls.findOne({ "poll.id" : req.params.id}, function(err, data) {
			console.log("req.ip", req.ip, "req.ips", req.ips);
			if(err) throw err;
			else {
				var choice = req.body.choice;
				var newchoice = req.body.otherchoice;
				if(choice=='other')
					data.poll.choices.push({
						choice: newchoice,
						votes: 1
					});
				else {
					var index = -1;
					data.poll.choices = data.poll.choices.map(e=>{
						console.log(e.choice,newchoice);
						if(e.choice==choice) {
							e.votes = e.votes+1
						} return e;
					});
				}
				data.save(function(err, data) {
					if(err) throw err;
					else console.log(data.poll.title, "has been updated.")
					res.redirect('/view/'+req.params.id);
				})
			}
		});
	}
}

module.exports = RouteController;