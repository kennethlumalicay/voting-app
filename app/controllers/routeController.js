'use strict';

var Polls = require('../models/polls');

function RouteController () {
	this.getPolls = function(req, res, view, logged) {
		var filter = view == 'index' ? {} : { "poll.ownerId" : req.user.github.id };
		Polls.find(filter,function(err, data) {
			if(err) throw err;
			else {
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

	this.newPoll = function (req, res) {
		var ownerId = req.user.github.id;
		var id = new Date().getTime().toString(16);
		var title = req.body.title;
		var choices = req.body.options.replace(/\./gi, '').split(/ , |, | ,|,/g);
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
			if(data.votes.includes(req.ip)) {
				res.send({ anti_double_vote_mechanism: "sending an army of worms to user's address. please vote again in a few hours.",
						good_guy_link_saver: "here is link to the poll you were viewing (" + process.env.APP_URL+"view/"+req.params.id+")."});
			} else {
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
							if(e.choice==choice) {
								e.votes = e.votes+1
							} return e;
						});
					}
					data.votes.push(req.ip);
					data.save(function(err, data) {
						if(err) throw err;
						else console.log(data.poll.title, "has been updated.")
						res.redirect('/view/'+req.params.id);
					})
				}
			}
		});
	}
}

module.exports = RouteController;