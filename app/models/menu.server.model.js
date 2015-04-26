'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Menu Schema
 */
var MenuSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Menu name',
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

mongoose.model('Menu', MenuSchema);