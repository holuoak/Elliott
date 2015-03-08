'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wafe = mongoose.model('Wafe'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wafe;

/**
 * Wafe routes tests
 */
describe('Wafe CRUD tests', function() {
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

		// Save a user to the test db and create new Wafe
		user.save(function() {
			wafe = {
				name: 'Wafe Name'
			};

			done();
		});
	});

	it('should be able to save Wafe instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wafe
				agent.post('/waves')
					.send(wafe)
					.expect(200)
					.end(function(wafeSaveErr, wafeSaveRes) {
						// Handle Wafe save error
						if (wafeSaveErr) done(wafeSaveErr);

						// Get a list of Waves
						agent.get('/waves')
							.end(function(wavesGetErr, wavesGetRes) {
								// Handle Wafe save error
								if (wavesGetErr) done(wavesGetErr);

								// Get Waves list
								var waves = wavesGetRes.body;

								// Set assertions
								(waves[0].user._id).should.equal(userId);
								(waves[0].name).should.match('Wafe Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wafe instance if not logged in', function(done) {
		agent.post('/waves')
			.send(wafe)
			.expect(401)
			.end(function(wafeSaveErr, wafeSaveRes) {
				// Call the assertion callback
				done(wafeSaveErr);
			});
	});

	it('should not be able to save Wafe instance if no name is provided', function(done) {
		// Invalidate name field
		wafe.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wafe
				agent.post('/waves')
					.send(wafe)
					.expect(400)
					.end(function(wafeSaveErr, wafeSaveRes) {
						// Set message assertion
						(wafeSaveRes.body.message).should.match('Please fill Wafe name');
						
						// Handle Wafe save error
						done(wafeSaveErr);
					});
			});
	});

	it('should be able to update Wafe instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wafe
				agent.post('/waves')
					.send(wafe)
					.expect(200)
					.end(function(wafeSaveErr, wafeSaveRes) {
						// Handle Wafe save error
						if (wafeSaveErr) done(wafeSaveErr);

						// Update Wafe name
						wafe.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wafe
						agent.put('/waves/' + wafeSaveRes.body._id)
							.send(wafe)
							.expect(200)
							.end(function(wafeUpdateErr, wafeUpdateRes) {
								// Handle Wafe update error
								if (wafeUpdateErr) done(wafeUpdateErr);

								// Set assertions
								(wafeUpdateRes.body._id).should.equal(wafeSaveRes.body._id);
								(wafeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Waves if not signed in', function(done) {
		// Create new Wafe model instance
		var wafeObj = new Wafe(wafe);

		// Save the Wafe
		wafeObj.save(function() {
			// Request Waves
			request(app).get('/waves')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wafe if not signed in', function(done) {
		// Create new Wafe model instance
		var wafeObj = new Wafe(wafe);

		// Save the Wafe
		wafeObj.save(function() {
			request(app).get('/waves/' + wafeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wafe.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wafe instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wafe
				agent.post('/waves')
					.send(wafe)
					.expect(200)
					.end(function(wafeSaveErr, wafeSaveRes) {
						// Handle Wafe save error
						if (wafeSaveErr) done(wafeSaveErr);

						// Delete existing Wafe
						agent.delete('/waves/' + wafeSaveRes.body._id)
							.send(wafe)
							.expect(200)
							.end(function(wafeDeleteErr, wafeDeleteRes) {
								// Handle Wafe error error
								if (wafeDeleteErr) done(wafeDeleteErr);

								// Set assertions
								(wafeDeleteRes.body._id).should.equal(wafeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wafe instance if not signed in', function(done) {
		// Set Wafe user 
		wafe.user = user;

		// Create new Wafe model instance
		var wafeObj = new Wafe(wafe);

		// Save the Wafe
		wafeObj.save(function() {
			// Try deleting Wafe
			request(app).delete('/waves/' + wafeObj._id)
			.expect(401)
			.end(function(wafeDeleteErr, wafeDeleteRes) {
				// Set message assertion
				(wafeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wafe error error
				done(wafeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wafe.remove().exec();
		done();
	});
});