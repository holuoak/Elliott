'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Datadef = mongoose.model('Datadef'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, datadef;

/**
 * Datadef routes tests
 */
describe('Datadef CRUD tests', function() {
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

		// Save a user to the test db and create new Datadef
		user.save(function() {
			datadef = {
				name: 'Datadef Name'
			};

			done();
		});
	});

	it('should be able to save Datadef instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datadef
				agent.post('/datadefs')
					.send(datadef)
					.expect(200)
					.end(function(datadefSaveErr, datadefSaveRes) {
						// Handle Datadef save error
						if (datadefSaveErr) done(datadefSaveErr);

						// Get a list of Datadefs
						agent.get('/datadefs')
							.end(function(datadefsGetErr, datadefsGetRes) {
								// Handle Datadef save error
								if (datadefsGetErr) done(datadefsGetErr);

								// Get Datadefs list
								var datadefs = datadefsGetRes.body;

								// Set assertions
								(datadefs[0].user._id).should.equal(userId);
								(datadefs[0].name).should.match('Datadef Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Datadef instance if not logged in', function(done) {
		agent.post('/datadefs')
			.send(datadef)
			.expect(401)
			.end(function(datadefSaveErr, datadefSaveRes) {
				// Call the assertion callback
				done(datadefSaveErr);
			});
	});

	it('should not be able to save Datadef instance if no name is provided', function(done) {
		// Invalidate name field
		datadef.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datadef
				agent.post('/datadefs')
					.send(datadef)
					.expect(400)
					.end(function(datadefSaveErr, datadefSaveRes) {
						// Set message assertion
						(datadefSaveRes.body.message).should.match('Please fill Datadef name');
						
						// Handle Datadef save error
						done(datadefSaveErr);
					});
			});
	});

	it('should be able to update Datadef instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datadef
				agent.post('/datadefs')
					.send(datadef)
					.expect(200)
					.end(function(datadefSaveErr, datadefSaveRes) {
						// Handle Datadef save error
						if (datadefSaveErr) done(datadefSaveErr);

						// Update Datadef name
						datadef.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Datadef
						agent.put('/datadefs/' + datadefSaveRes.body._id)
							.send(datadef)
							.expect(200)
							.end(function(datadefUpdateErr, datadefUpdateRes) {
								// Handle Datadef update error
								if (datadefUpdateErr) done(datadefUpdateErr);

								// Set assertions
								(datadefUpdateRes.body._id).should.equal(datadefSaveRes.body._id);
								(datadefUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Datadefs if not signed in', function(done) {
		// Create new Datadef model instance
		var datadefObj = new Datadef(datadef);

		// Save the Datadef
		datadefObj.save(function() {
			// Request Datadefs
			request(app).get('/datadefs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Datadef if not signed in', function(done) {
		// Create new Datadef model instance
		var datadefObj = new Datadef(datadef);

		// Save the Datadef
		datadefObj.save(function() {
			request(app).get('/datadefs/' + datadefObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', datadef.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Datadef instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Datadef
				agent.post('/datadefs')
					.send(datadef)
					.expect(200)
					.end(function(datadefSaveErr, datadefSaveRes) {
						// Handle Datadef save error
						if (datadefSaveErr) done(datadefSaveErr);

						// Delete existing Datadef
						agent.delete('/datadefs/' + datadefSaveRes.body._id)
							.send(datadef)
							.expect(200)
							.end(function(datadefDeleteErr, datadefDeleteRes) {
								// Handle Datadef error error
								if (datadefDeleteErr) done(datadefDeleteErr);

								// Set assertions
								(datadefDeleteRes.body._id).should.equal(datadefSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Datadef instance if not signed in', function(done) {
		// Set Datadef user 
		datadef.user = user;

		// Create new Datadef model instance
		var datadefObj = new Datadef(datadef);

		// Save the Datadef
		datadefObj.save(function() {
			// Try deleting Datadef
			request(app).delete('/datadefs/' + datadefObj._id)
			.expect(401)
			.end(function(datadefDeleteErr, datadefDeleteRes) {
				// Set message assertion
				(datadefDeleteRes.body.message).should.match('User is not logged in');

				// Handle Datadef error error
				done(datadefDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Datadef.remove().exec();
		done();
	});
});