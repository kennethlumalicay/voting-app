'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Polls = new Schema({
	poll: {
		ownerId: String,
		id: String,
		title: String,
		choices: [{
					choice: String,
					votes: {type: Number, default: 0}
				}]
	}, votes: {type:[String], default: ['']}
}, {collection: 'polls'});

module.exports = mongoose.model('Polls', Polls);
