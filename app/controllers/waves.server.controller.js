'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wafe = mongoose.model('Wafe'),
	_ = require('lodash');

/**
 * Create a Wafe
 */
exports.create = function(req, res) {
	var wafe = new Wafe(req.body);
	wafe.user = req.user;

	wafe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wafe);
		}
	});
};

/**
 * Show the current Wafe
 */
exports.read = function(req, res) {
	res.jsonp(req.wafe);
};

/**
 * Update a Wafe
 */
exports.update = function(req, res) {
	var wafe = req.wafe ;

	wafe = _.extend(wafe , req.body);

	wafe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wafe);
		}
	});
};

/**
 * Delete an Wafe
 */
exports.delete = function(req, res) {
	var wafe = req.wafe ;

	wafe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wafe);
		}
	});
};

/**
 * List of Waves
 */
exports.list = function(req, res) { 
	Wafe.find().sort('-created').populate('user', 'displayName').exec(function(err, waves) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(waves);
		}
	});
};

/**
 * Wafe middleware
 */
exports.wafeByID = function(req, res, next, id) { 
	Wafe.findById(id).populate('user', 'displayName').exec(function(err, wafe) {
		if (err) return next(err);
		if (! wafe) return next(new Error('Failed to load Wafe ' + id));
		req.wafe = wafe ;
		next();
	});
};

/**
 * Wafe authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wafe.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
