'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Establishment Schema
 */
var EstablishmentSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	account: {
		type: Schema.ObjectId,
		ref: 'Account'
	}
});

mongoose.model('Establishment', EstablishmentSchema);
