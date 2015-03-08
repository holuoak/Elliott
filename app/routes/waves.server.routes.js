'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var waves = require('../../app/controllers/waves.server.controller');

	// Waves Routes
	app.route('/waves')
		.get(waves.list)
		.post(users.requiresLogin, waves.create);

	app.route('/waves/:wafeId')
		.get(waves.read)
		.put(users.requiresLogin, waves.hasAuthorization, waves.update)
		.delete(users.requiresLogin, waves.hasAuthorization, waves.delete);

	// Finish by binding the Wafe middleware
	app.param('wafeId', waves.wafeByID);
};
