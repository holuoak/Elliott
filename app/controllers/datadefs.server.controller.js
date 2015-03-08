'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Datadef = mongoose.model('Datadef'),
	_ = require('lodash');

/**
 * Create a Datadef
 */
exports.create = function(req, res) {
	var datadef = new Datadef(req.body);
	datadef.user = req.user;

	datadef.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datadef);
		}
	});
};

/**
 * Show the current Datadef
 */
exports.read = function(req, res) {
	res.jsonp(req.datadef);
};

/**
 * Update a Datadef
 */
exports.update = function(req, res) {
	var datadef = req.datadef ;

	datadef = _.extend(datadef , req.body);

	datadef.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datadef);
		}
	});
};

/**
 * Delete an Datadef
 */
exports.delete = function(req, res) {
	var datadef = req.datadef ;

	datadef.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datadef);
		}
	});
};

/**
 * List of Datadefs
 */
exports.list = function(req, res) { 
	Datadef.find().sort('-created').populate('user', 'displayName').exec(function(err, datadefs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datadefs);
		}
	});
};

/**
 * Datadef middleware
 */
exports.datadefByID = function(req, res, next, id) { 
	Datadef.findById(id).populate('user', 'displayName').exec(function(err, datadef) {
		if (err) return next(err);
		if (! datadef) return next(new Error('Failed to load Datadef ' + id));
		req.datadef = datadef ;
		next();
	});
};

/**
 * Datadef authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.datadef.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
