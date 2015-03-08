'use strict';

//Datadefs service used to communicate Datadefs REST endpoints
angular.module('datadefs').factory('Datadefs', ['$resource',
	function($resource) {
		return $resource('datadefs/:datadefId', { datadefId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);