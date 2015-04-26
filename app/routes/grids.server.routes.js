'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var grids = require('../../app/controllers/grids.server.controller');

	// Grids Routes
	app.route('/grids')
		.get(grids.list)
		.post(users.requiresLogin, grids.create);

	app.route('/grids/:gridId')
		.get(grids.read)
		.put(users.requiresLogin, grids.hasAuthorization, grids.update)
		.delete(users.requiresLogin, grids.hasAuthorization, grids.delete);

	// Finish by binding the Grid middleware
	app.param('gridId', grids.gridByID);
};
