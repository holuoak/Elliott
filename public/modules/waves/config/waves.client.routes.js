'use strict';

//Setting up route
angular.module('waves').config(['$stateProvider',
	function($stateProvider) {
		// Waves state routing
		$stateProvider.
		state('listWaves', {
			url: '/waves',
			templateUrl: 'modules/waves/views/list-waves.client.view.html'
		}).
		state('createWafe', {
			url: '/waves/create',
			templateUrl: 'modules/waves/views/create-wafe.client.view.html'
		}).
		state('viewWafe', {
			url: '/waves/:wafeId',
			templateUrl: 'modules/waves/views/view-wafe.client.view.html'
		}).
		state('editWafe', {
			url: '/waves/:wafeId/edit',
			templateUrl: 'modules/waves/views/edit-wafe.client.view.html'
		});
	}
]);