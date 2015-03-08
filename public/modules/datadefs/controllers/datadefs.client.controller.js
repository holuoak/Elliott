'use strict';

// Datadefs controller
angular.module('datadefs').controller('DatadefsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Datadefs',
	function($scope, $stateParams, $location, Authentication, Datadefs) {
		$scope.authentication = Authentication;

		// Create new Datadef
		$scope.create = function() {
			// Create new Datadef object
			var datadef = new Datadefs ({
				name: this.name
			});

			// Redirect after save
			datadef.$save(function(response) {
				$location.path('datadefs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Datadef
		$scope.remove = function(datadef) {
			if ( datadef ) { 
				datadef.$remove();

				for (var i in $scope.datadefs) {
					if ($scope.datadefs [i] === datadef) {
						$scope.datadefs.splice(i, 1);
					}
				}
			} else {
				$scope.datadef.$remove(function() {
					$location.path('datadefs');
				});
			}
		};

		// Update existing Datadef
		$scope.update = function() {
			var datadef = $scope.datadef;

			datadef.$update(function() {
				$location.path('datadefs/' + datadef._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Datadefs
		$scope.find = function() {
			$scope.datadefs = Datadefs.query();
		};

		// Find existing Datadef
		$scope.findOne = function() {
			$scope.datadef = Datadefs.get({ 
				datadefId: $stateParams.datadefId
			});
		};
	}
]);