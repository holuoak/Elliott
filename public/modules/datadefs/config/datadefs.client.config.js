'use strict';

// Configuring the Articles module
angular.module('datadefs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Defs', 'Datadefs', 'datadefs', 'dropdown', '/datadefs(/create)?');
		Menus.addSubMenuItem('Defs', 'datadefs', 'List Datadefs', 'datadefs');
		Menus.addSubMenuItem('Defs', 'datadefs', 'New Datadef', 'datadefs/create');
	}
]);