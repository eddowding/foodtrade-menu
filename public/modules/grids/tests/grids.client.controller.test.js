'use strict';

(function() {
	// Grids Controller Spec
	describe('Grids Controller Tests', function() {
		// Initialize global variables
		var GridsController,
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

			// Initialize the Grids controller.
			GridsController = $controller('GridsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grid object fetched from XHR', inject(function(Grids) {
			// Create sample Grid using the Grids service
			var sampleGrid = new Grids({
				name: 'New Grid'
			});

			// Create a sample Grids array that includes the new Grid
			var sampleGrids = [sampleGrid];

			// Set GET response
			$httpBackend.expectGET('grids').respond(sampleGrids);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grids).toEqualData(sampleGrids);
		}));

		it('$scope.findOne() should create an array with one Grid object fetched from XHR using a gridId URL parameter', inject(function(Grids) {
			// Define a sample Grid object
			var sampleGrid = new Grids({
				name: 'New Grid'
			});

			// Set the URL parameter
			$stateParams.gridId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/grids\/([0-9a-fA-F]{24})$/).respond(sampleGrid);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grid).toEqualData(sampleGrid);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Grids) {
			// Create a sample Grid object
			var sampleGridPostData = new Grids({
				name: 'New Grid'
			});

			// Create a sample Grid response
			var sampleGridResponse = new Grids({
				_id: '525cf20451979dea2c000001',
				name: 'New Grid'
			});

			// Fixture mock form input values
			scope.name = 'New Grid';

			// Set POST response
			$httpBackend.expectPOST('grids', sampleGridPostData).respond(sampleGridResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grid was created
			expect($location.path()).toBe('/grids/' + sampleGridResponse._id);
		}));

		it('$scope.update() should update a valid Grid', inject(function(Grids) {
			// Define a sample Grid put data
			var sampleGridPutData = new Grids({
				_id: '525cf20451979dea2c000001',
				name: 'New Grid'
			});

			// Mock Grid in scope
			scope.grid = sampleGridPutData;

			// Set PUT response
			$httpBackend.expectPUT(/grids\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/grids/' + sampleGridPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gridId and remove the Grid from the scope', inject(function(Grids) {
			// Create new Grid object
			var sampleGrid = new Grids({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Grids array and include the Grid
			scope.grids = [sampleGrid];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/grids\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrid);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.grids.length).toBe(0);
		}));
	});
}());