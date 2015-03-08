'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wafe Schema
 */
var WafeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Wafe name',
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

mongoose.model('Wafe', WafeSchema);