'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var establishments = require('../../app/controllers/establishments.server.controller');

	// Establishments Routes
	app.route('/establishments')
		.get(establishments.list)
		.post(users.requiresLogin, establishments.create);

	app.route('/establishments/:establishmentId')
		.get(establishments.read)
		.put(users.requiresLogin, establishments.hasAuthorization, establishments.update)
		.delete(users.requiresLogin, establishments.hasAuthorization, establishments.delete);

	// Finish by binding the Establishment middleware
	app.param('establishmentId', establishments.establishmentByID);
};
