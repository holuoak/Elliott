'use strict';

// Waves controller
angular.module('waves').controller('WavesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Waves',
	function($scope, $stateParams, $location, Authentication, Waves) {
		$scope.authentication = Authentication;

		// Create new Wafe
		$scope.create = function() {
			// Create new Wafe object
			var wafe = new Waves ({
				name: this.name
			});

			// Redirect after save
			wafe.$save(function(response) {
				$location.path('waves/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wafe
		$scope.remove = function(wafe) {
			if ( wafe ) { 
				wafe.$remove();

				for (var i in $scope.waves) {
					if ($scope.waves [i] === wafe) {
						$scope.waves.splice(i, 1);
					}
				}
			} else {
				$scope.wafe.$remove(function() {
					$location.path('waves');
				});
			}
		};

		// Update existing Wafe
		$scope.update = function() {
			var wafe = $scope.wafe;

			wafe.$update(function() {
				$location.path('waves/' + wafe._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Waves
		$scope.find = function() {
			$scope.waves = Waves.query();
		};

		// Find existing Wafe
		$scope.findOne = function() {
			$scope.wafe = Waves.get({ 
				wafeId: $stateParams.wafeId
			});
		};
	}
]);