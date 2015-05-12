'use strict';

(function() {
	// Establishments Controller Spec
	describe('Establishments Controller Tests', function() {
		// Initialize global variables
		var EstablishmentsController,
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

			// Initialize the Establishments controller.
			EstablishmentsController = $controller('EstablishmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Establishment object fetched from XHR', inject(function(Establishments) {
			// Create sample Establishment using the Establishments service
			var sampleEstablishment = new Establishments({
				name: 'New Establishment'
			});

			// Create a sample Establishments array that includes the new Establishment
			var sampleEstablishments = [sampleEstablishment];

			// Set GET response
			$httpBackend.expectGET('establishments').respond(sampleEstablishments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.establishments).toEqualData(sampleEstablishments);
		}));

		it('$scope.findOne() should create an array with one Establishment object fetched from XHR using a establishmentId URL parameter', inject(function(Establishments) {
			// Define a sample Establishment object
			var sampleEstablishment = new Establishments({
				name: 'New Establishment'
			});

			// Set the URL parameter
			$stateParams.establishmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/establishments\/([0-9a-fA-F]{24})$/).respond(sampleEstablishment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.establishment).toEqualData(sampleEstablishment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Establishments) {
			// Create a sample Establishment object
			var sampleEstablishmentPostData = new Establishments({
				name: 'New Establishment'
			});

			// Create a sample Establishment response
			var sampleEstablishmentResponse = new Establishments({
				_id: '525cf20451979dea2c000001',
				name: 'New Establishment'
			});

			// Fixture mock form input values
			scope.name = 'New Establishment';

			// Set POST response
			$httpBackend.expectPOST('establishments', sampleEstablishmentPostData).respond(sampleEstablishmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Establishment was created
			expect($location.path()).toBe('/establishments/' + sampleEstablishmentResponse._id);
		}));

		it('$scope.update() should update a valid Establishment', inject(function(Establishments) {
			// Define a sample Establishment put data
			var sampleEstablishmentPutData = new Establishments({
				_id: '525cf20451979dea2c000001',
				name: 'New Establishment'
			});

			// Mock Establishment in scope
			scope.establishment = sampleEstablishmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/establishments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/establishments/' + sampleEstablishmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid establishmentId and remove the Establishment from the scope', inject(function(Establishments) {
			// Create new Establishment object
			var sampleEstablishment = new Establishments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Establishments array and include the Establishment
			scope.establishments = [sampleEstablishment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/establishments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEstablishment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.establishments.length).toBe(0);
		}));
	});
}());