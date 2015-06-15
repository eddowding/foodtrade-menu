'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Account Schema
 */
var AccountSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	client: {
		type: Schema.ObjectId,
		ref: 'Client'
	}
});

mongoose.model('Account', AccountSchema);
