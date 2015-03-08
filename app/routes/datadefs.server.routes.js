'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var datadefs = require('../../app/controllers/datadefs.server.controller');

	// Datadefs Routes
	app.route('/datadefs')
		.get(datadefs.list)
		.post(users.requiresLogin, datadefs.create);

	app.route('/datadefs/:datadefId')
		.get(datadefs.read)
		.put(users.requiresLogin, datadefs.hasAuthorization, datadefs.update)
		.delete(users.requiresLogin, datadefs.hasAuthorization, datadefs.delete);

	// Finish by binding the Datadef middleware
	app.param('datadefId', datadefs.datadefByID);
};
