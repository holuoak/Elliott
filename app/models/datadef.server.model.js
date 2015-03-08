'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Datadef Schema
 */
var DatadefSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Datadef name',
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

mongoose.model('Datadef', DatadefSchema);