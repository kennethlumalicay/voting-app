'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Polls = new Schema({
	poll: {
		ownerId: String,
		id: String,
		title: String,
		choices: [String]
	},
	voted: {
		github: {
			id: String
		}
	}
}, {collection: 'polls'});

module.exports = mongoose.model('Polls', Polls);
