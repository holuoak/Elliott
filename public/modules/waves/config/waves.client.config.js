'use strict';

// Configuring the Articles module
angular.module('waves').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('Waves', 'Waves', 'waves', 'dropdown', '/waves(/create)?');
		Menus.addSubMenuItem('Waves', 'waves', 'List Waves', 'waves');
		Menus.addSubMenuItem('Waves', 'waves', 'New Wafe', 'waves/create');
	}
]);