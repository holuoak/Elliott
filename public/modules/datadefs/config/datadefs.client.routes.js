'use strict';

//Setting up route
angular.module('datadefs').config(['$stateProvider',
	function($stateProvider) {
		// Datadefs state routing
		$stateProvider.
		state('listDatadefs', {
			url: '/datadefs',
			templateUrl: 'modules/datadefs/views/list-datadefs.client.view.html'
		}).
		state('createDatadef', {
			url: '/datadefs/create',
			templateUrl: 'modules/datadefs/views/create-datadef.client.view.html'
		}).
		state('viewDatadef', {
			url: '/datadefs/:datadefId',
			templateUrl: 'modules/datadefs/views/view-datadef.client.view.html'
		}).
		state('editDatadef', {
			url: '/datadefs/:datadefId/edit',
			templateUrl: 'modules/datadefs/views/edit-datadef.client.view.html'
		});
	}
]);