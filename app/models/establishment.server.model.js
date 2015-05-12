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
	name: {
		type: String,
		default: '',
		required: 'Please fill Establishment name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Establishment', EstablishmentSchema);