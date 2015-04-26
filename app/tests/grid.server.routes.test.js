'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grid = mongoose.model('Grid'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, grid;

/**
 * Grid routes tests
 */
describe('Grid CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Grid
		user.save(function() {
			grid = {
				name: 'Grid Name'
			};

			done();
		});
	});

	it('should be able to save Grid instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grid
				agent.post('/grids')
					.send(grid)
					.expect(200)
					.end(function(gridSaveErr, gridSaveRes) {
						// Handle Grid save error
						if (gridSaveErr) done(gridSaveErr);

						// Get a list of Grids
						agent.get('/grids')
							.end(function(gridsGetErr, gridsGetRes) {
								// Handle Grid save error
								if (gridsGetErr) done(gridsGetErr);

								// Get Grids list
								var grids = gridsGetRes.body;

								// Set assertions
								(grids[0].user._id).should.equal(userId);
								(grids[0].name).should.match('Grid Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Grid instance if not logged in', function(done) {
		agent.post('/grids')
			.send(grid)
			.expect(401)
			.end(function(gridSaveErr, gridSaveRes) {
				// Call the assertion callback
				done(gridSaveErr);
			});
	});

	it('should not be able to save Grid instance if no name is provided', function(done) {
		// Invalidate name field
		grid.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grid
				agent.post('/grids')
					.send(grid)
					.expect(400)
					.end(function(gridSaveErr, gridSaveRes) {
						// Set message assertion
						(gridSaveRes.body.message).should.match('Please fill Grid name');
						
						// Handle Grid save error
						done(gridSaveErr);
					});
			});
	});

	it('should be able to update Grid instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grid
				agent.post('/grids')
					.send(grid)
					.expect(200)
					.end(function(gridSaveErr, gridSaveRes) {
						// Handle Grid save error
						if (gridSaveErr) done(gridSaveErr);

						// Update Grid name
						grid.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Grid
						agent.put('/grids/' + gridSaveRes.body._id)
							.send(grid)
							.expect(200)
							.end(function(gridUpdateErr, gridUpdateRes) {
								// Handle Grid update error
								if (gridUpdateErr) done(gridUpdateErr);

								// Set assertions
								(gridUpdateRes.body._id).should.equal(gridSaveRes.body._id);
								(gridUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Grids if not signed in', function(done) {
		// Create new Grid model instance
		var gridObj = new Grid(grid);

		// Save the Grid
		gridObj.save(function() {
			// Request Grids
			request(app).get('/grids')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Grid if not signed in', function(done) {
		// Create new Grid model instance
		var gridObj = new Grid(grid);

		// Save the Grid
		gridObj.save(function() {
			request(app).get('/grids/' + gridObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', grid.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Grid instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grid
				agent.post('/grids')
					.send(grid)
					.expect(200)
					.end(function(gridSaveErr, gridSaveRes) {
						// Handle Grid save error
						if (gridSaveErr) done(gridSaveErr);

						// Delete existing Grid
						agent.delete('/grids/' + gridSaveRes.body._id)
							.send(grid)
							.expect(200)
							.end(function(gridDeleteErr, gridDeleteRes) {
								// Handle Grid error error
								if (gridDeleteErr) done(gridDeleteErr);

								// Set assertions
								(gridDeleteRes.body._id).should.equal(gridSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Grid instance if not signed in', function(done) {
		// Set Grid user 
		grid.user = user;

		// Create new Grid model instance
		var gridObj = new Grid(grid);

		// Save the Grid
		gridObj.save(function() {
			// Try deleting Grid
			request(app).delete('/grids/' + gridObj._id)
			.expect(401)
			.end(function(gridDeleteErr, gridDeleteRes) {
				// Set message assertion
				(gridDeleteRes.body.message).should.match('User is not logged in');

				// Handle Grid error error
				done(gridDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Grid.remove().exec();
		done();
	});
});