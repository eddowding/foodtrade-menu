'use strict';

// Configuring the Articles module
angular.module('grids').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Grids', 'grids', 'dropdown', '/grids(/create)?');
		Menus.addSubMenuItem('topbar', 'grids', 'List Grids', 'grids');
		Menus.addSubMenuItem('topbar', 'grids', 'New Grid', 'grids/create');
	}
]);