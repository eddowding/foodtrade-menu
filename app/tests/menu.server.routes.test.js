'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Menu = mongoose.model('Menu'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, menu;

/**
 * Menu routes tests
 */
describe('Menu CRUD tests', function() {
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

		// Save a user to the test db and create new Menu
		user.save(function() {
			menu = {
				name: 'Menu Name'
			};

			done();
		});
	});

	it('should be able to save Menu instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menu
				agent.post('/menus')
					.send(menu)
					.expect(200)
					.end(function(menuSaveErr, menuSaveRes) {
						// Handle Menu save error
						if (menuSaveErr) done(menuSaveErr);

						// Get a list of Menus
						agent.get('/menus')
							.end(function(menusGetErr, menusGetRes) {
								// Handle Menu save error
								if (menusGetErr) done(menusGetErr);

								// Get Menus list
								var menus = menusGetRes.body;

								// Set assertions
								(menus[0].user._id).should.equal(userId);
								(menus[0].name).should.match('Menu Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Menu instance if not logged in', function(done) {
		agent.post('/menus')
			.send(menu)
			.expect(401)
			.end(function(menuSaveErr, menuSaveRes) {
				// Call the assertion callback
				done(menuSaveErr);
			});
	});

	it('should not be able to save Menu instance if no name is provided', function(done) {
		// Invalidate name field
		menu.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menu
				agent.post('/menus')
					.send(menu)
					.expect(400)
					.end(function(menuSaveErr, menuSaveRes) {
						// Set message assertion
						(menuSaveRes.body.message).should.match('Please fill Menu name');
						
						// Handle Menu save error
						done(menuSaveErr);
					});
			});
	});

	it('should be able to update Menu instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menu
				agent.post('/menus')
					.send(menu)
					.expect(200)
					.end(function(menuSaveErr, menuSaveRes) {
						// Handle Menu save error
						if (menuSaveErr) done(menuSaveErr);

						// Update Menu name
						menu.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Menu
						agent.put('/menus/' + menuSaveRes.body._id)
							.send(menu)
							.expect(200)
							.end(function(menuUpdateErr, menuUpdateRes) {
								// Handle Menu update error
								if (menuUpdateErr) done(menuUpdateErr);

								// Set assertions
								(menuUpdateRes.body._id).should.equal(menuSaveRes.body._id);
								(menuUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Menus if not signed in', function(done) {
		// Create new Menu model instance
		var menuObj = new Menu(menu);

		// Save the Menu
		menuObj.save(function() {
			// Request Menus
			request(app).get('/menus')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Menu if not signed in', function(done) {
		// Create new Menu model instance
		var menuObj = new Menu(menu);

		// Save the Menu
		menuObj.save(function() {
			request(app).get('/menus/' + menuObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', menu.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Menu instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menu
				agent.post('/menus')
					.send(menu)
					.expect(200)
					.end(function(menuSaveErr, menuSaveRes) {
						// Handle Menu save error
						if (menuSaveErr) done(menuSaveErr);

						// Delete existing Menu
						agent.delete('/menus/' + menuSaveRes.body._id)
							.send(menu)
							.expect(200)
							.end(function(menuDeleteErr, menuDeleteRes) {
								// Handle Menu error error
								if (menuDeleteErr) done(menuDeleteErr);

								// Set assertions
								(menuDeleteRes.body._id).should.equal(menuSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Menu instance if not signed in', function(done) {
		// Set Menu user 
		menu.user = user;

		// Create new Menu model instance
		var menuObj = new Menu(menu);

		// Save the Menu
		menuObj.save(function() {
			// Try deleting Menu
			request(app).delete('/menus/' + menuObj._id)
			.expect(401)
			.end(function(menuDeleteErr, menuDeleteRes) {
				// Set message assertion
				(menuDeleteRes.body.message).should.match('User is not logged in');

				// Handle Menu error error
				done(menuDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Menu.remove().exec();
		done();
	});
});