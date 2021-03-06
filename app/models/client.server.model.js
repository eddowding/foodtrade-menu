'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Client Schema
 */
var ClientSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Client name',
		trim: true
	},
	subdomain: {
		type: String,
		required: true,
		unique: true
	},
	logo: {
		type: String,
		required: false
	},
	favicon: {
		type: String,
		required: false
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

mongoose.model('Client', ClientSchema);
