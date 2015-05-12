'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Establishment = mongoose.model('Establishment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, establishment;

/**
 * Establishment routes tests
 */
describe('Establishment CRUD tests', function() {
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

		// Save a user to the test db and create new Establishment
		user.save(function() {
			establishment = {
				name: 'Establishment Name'
			};

			done();
		});
	});

	it('should be able to save Establishment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Establishment
				agent.post('/establishments')
					.send(establishment)
					.expect(200)
					.end(function(establishmentSaveErr, establishmentSaveRes) {
						// Handle Establishment save error
						if (establishmentSaveErr) done(establishmentSaveErr);

						// Get a list of Establishments
						agent.get('/establishments')
							.end(function(establishmentsGetErr, establishmentsGetRes) {
								// Handle Establishment save error
								if (establishmentsGetErr) done(establishmentsGetErr);

								// Get Establishments list
								var establishments = establishmentsGetRes.body;

								// Set assertions
								(establishments[0].user._id).should.equal(userId);
								(establishments[0].name).should.match('Establishment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Establishment instance if not logged in', function(done) {
		agent.post('/establishments')
			.send(establishment)
			.expect(401)
			.end(function(establishmentSaveErr, establishmentSaveRes) {
				// Call the assertion callback
				done(establishmentSaveErr);
			});
	});

	it('should not be able to save Establishment instance if no name is provided', function(done) {
		// Invalidate name field
		establishment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Establishment
				agent.post('/establishments')
					.send(establishment)
					.expect(400)
					.end(function(establishmentSaveErr, establishmentSaveRes) {
						// Set message assertion
						(establishmentSaveRes.body.message).should.match('Please fill Establishment name');
						
						// Handle Establishment save error
						done(establishmentSaveErr);
					});
			});
	});

	it('should be able to update Establishment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Establishment
				agent.post('/establishments')
					.send(establishment)
					.expect(200)
					.end(function(establishmentSaveErr, establishmentSaveRes) {
						// Handle Establishment save error
						if (establishmentSaveErr) done(establishmentSaveErr);

						// Update Establishment name
						establishment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Establishment
						agent.put('/establishments/' + establishmentSaveRes.body._id)
							.send(establishment)
							.expect(200)
							.end(function(establishmentUpdateErr, establishmentUpdateRes) {
								// Handle Establishment update error
								if (establishmentUpdateErr) done(establishmentUpdateErr);

								// Set assertions
								(establishmentUpdateRes.body._id).should.equal(establishmentSaveRes.body._id);
								(establishmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Establishments if not signed in', function(done) {
		// Create new Establishment model instance
		var establishmentObj = new Establishment(establishment);

		// Save the Establishment
		establishmentObj.save(function() {
			// Request Establishments
			request(app).get('/establishments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Establishment if not signed in', function(done) {
		// Create new Establishment model instance
		var establishmentObj = new Establishment(establishment);

		// Save the Establishment
		establishmentObj.save(function() {
			request(app).get('/establishments/' + establishmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', establishment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Establishment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Establishment
				agent.post('/establishments')
					.send(establishment)
					.expect(200)
					.end(function(establishmentSaveErr, establishmentSaveRes) {
						// Handle Establishment save error
						if (establishmentSaveErr) done(establishmentSaveErr);

						// Delete existing Establishment
						agent.delete('/establishments/' + establishmentSaveRes.body._id)
							.send(establishment)
							.expect(200)
							.end(function(establishmentDeleteErr, establishmentDeleteRes) {
								// Handle Establishment error error
								if (establishmentDeleteErr) done(establishmentDeleteErr);

								// Set assertions
								(establishmentDeleteRes.body._id).should.equal(establishmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Establishment instance if not signed in', function(done) {
		// Set Establishment user 
		establishment.user = user;

		// Create new Establishment model instance
		var establishmentObj = new Establishment(establishment);

		// Save the Establishment
		establishmentObj.save(function() {
			// Try deleting Establishment
			request(app).delete('/establishments/' + establishmentObj._id)
			.expect(401)
			.end(function(establishmentDeleteErr, establishmentDeleteRes) {
				// Set message assertion
				(establishmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Establishment error error
				done(establishmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Establishment.remove().exec();
		done();
	});
});