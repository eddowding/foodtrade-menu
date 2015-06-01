'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grid Schema
 */
var GridSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please give this a name',
		trim: true
	},
    tableData: {
      type: Array,
      default: {}
    },
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

GridSchema.set('versionKey', false);

mongoose.model('Grid', GridSchema);
