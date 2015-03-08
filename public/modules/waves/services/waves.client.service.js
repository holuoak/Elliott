'use strict';

//Waves service used to communicate Waves REST endpoints
angular.module('waves').factory('Waves', ['$resource',
	function($resource) {
		return $resource('waves/:wafeId', { wafeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);