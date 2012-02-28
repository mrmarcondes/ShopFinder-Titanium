function AppTabGroup() {
	//declaracao de dependencia de outros modulos
	var AppWindow = require('ui/AppWindow');
	var MainSearchWindow = require('ui/MainSearchWindow');
	var MainSearchWindowAnimated = require('ui/MainSearchWindowAnimated');


	
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var win1 = new MainSearchWindow(),
		win2 = new MainSearchWindowAnimated(),
		win3 = new AppWindow('seilah'),
		win4 = new AppWindow('bla'),
		win5 = new AppWindow('ble');

	var tab1 = Ti.UI.createTab({
		title: 'Procurar',
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: 'outra',
		icon: '/images/KS_nav_views.png',
		window: win2
	});
	win2.containingTab = tab2;

	var tab3 = Ti.UI.createTab({
		title: 'seilah',
		icon: '/images/KS_nav_views.png',
		window: win3
	});
	win3.containingTab = tab3;

	var tab4 = Ti.UI.createTab({
		title: 'bla',
		icon: '/images/KS_nav_views.png',
		window: win4
	});
	win4.containingTab = tab4;
	
	var tab5 = Ti.UI.createTab({
		title: 'ble',
		icon: '/images/KS_nav_views.png',
		window: win5
	});
	win5.containingTab = tab5;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	self.addTab(tab5);
	
	return self;
};

module.exports = AppTabGroup;
