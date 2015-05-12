'use strict';

// Configuring the Articles module
angular.module('establishments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Establishments', 'establishments', 'dropdown', '/establishments(/create)?');
		Menus.addSubMenuItem('topbar', 'establishments', 'List Establishments', 'establishments');
		Menus.addSubMenuItem('topbar', 'establishments', 'New Establishment', 'establishments/create');
	}
]);