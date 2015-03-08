'use strict';

(function() {
	// Datadefs Controller Spec
	describe('Datadefs Controller Tests', function() {
		// Initialize global variables
		var DatadefsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Datadefs controller.
			DatadefsController = $controller('DatadefsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Datadef object fetched from XHR', inject(function(Datadefs) {
			// Create sample Datadef using the Datadefs service
			var sampleDatadef = new Datadefs({
				name: 'New Datadef'
			});

			// Create a sample Datadefs array that includes the new Datadef
			var sampleDatadefs = [sampleDatadef];

			// Set GET response
			$httpBackend.expectGET('datadefs').respond(sampleDatadefs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datadefs).toEqualData(sampleDatadefs);
		}));

		it('$scope.findOne() should create an array with one Datadef object fetched from XHR using a datadefId URL parameter', inject(function(Datadefs) {
			// Define a sample Datadef object
			var sampleDatadef = new Datadefs({
				name: 'New Datadef'
			});

			// Set the URL parameter
			$stateParams.datadefId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/datadefs\/([0-9a-fA-F]{24})$/).respond(sampleDatadef);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datadef).toEqualData(sampleDatadef);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Datadefs) {
			// Create a sample Datadef object
			var sampleDatadefPostData = new Datadefs({
				name: 'New Datadef'
			});

			// Create a sample Datadef response
			var sampleDatadefResponse = new Datadefs({
				_id: '525cf20451979dea2c000001',
				name: 'New Datadef'
			});

			// Fixture mock form input values
			scope.name = 'New Datadef';

			// Set POST response
			$httpBackend.expectPOST('datadefs', sampleDatadefPostData).respond(sampleDatadefResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Datadef was created
			expect($location.path()).toBe('/datadefs/' + sampleDatadefResponse._id);
		}));

		it('$scope.update() should update a valid Datadef', inject(function(Datadefs) {
			// Define a sample Datadef put data
			var sampleDatadefPutData = new Datadefs({
				_id: '525cf20451979dea2c000001',
				name: 'New Datadef'
			});

			// Mock Datadef in scope
			scope.datadef = sampleDatadefPutData;

			// Set PUT response
			$httpBackend.expectPUT(/datadefs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/datadefs/' + sampleDatadefPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid datadefId and remove the Datadef from the scope', inject(function(Datadefs) {
			// Create new Datadef object
			var sampleDatadef = new Datadefs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Datadefs array and include the Datadef
			scope.datadefs = [sampleDatadef];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/datadefs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDatadef);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.datadefs.length).toBe(0);
		}));
	});
}());