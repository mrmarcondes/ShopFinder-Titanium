function MainSearchWindowAnimated(){
	var _ = require('/lib/underscore'); //Modulo externo prar algumas magicas com JS

	var data = [], firstLoad = true; //armazena resultado da pesquisa
	

	var self = Ti.UI.createWindow({
		navBarHidden: true,
		layout:'vertical',
		borderWidth: 0,
		backgroundColor: '#414144'
	});



	//view que envolve todos objetos da tela
	var mainView = Ti.UI.createView({
		top: 0,
		height: self.height,
		backgroundColor: 'green',
		borderColor: 'transparent',
		borderWidth: 1,
		zIndex: 0
	});
	
	var searchViewHolder = Ti.UI.createView({
		top: 0,
		height: 200, //alterar se for android
		backgroundColor: '#fff',
		borderColor: 'transparent',
		borderWidth: 1,
		zIndex: 2
	});
	
	var logoImg = Ti.UI.createImageView({
		image: 'images/shopfinder-logo.png',
		top: 75,
		left: 50,
		height: 46,
		width:216,
		zIndex: 2
	});
	searchViewHolder.add(logoImg);
	
	var searchViewBar = Ti.UI.createView({
		bottom: 0,
		height: 44,
		backgroundColor: '#fff',
		backgroundGradient: {
			type: 'linear',
			startPoint: { x: '0%', y: '100%'},
			endPoint: { x: '0%', y: '0%'},
			colors: [{ color: '#F4F4F4', offset: 0.0}, { color: '#FFFFFF', offset: 1.0}]
		},
		zIndex: 2
	});
	searchViewHolder.add(searchViewBar);
	
	var btnShowSearch = Ti.UI.createView({
		bottom: 5,
		right: 5,
		height: 35,
		width: 40,
		backgroundColor: 'transparent',
		zIndex: 2,
		isOpen: true
	});
		var iconShowSearch = Ti.UI.createImageView({
			image: 'images/icons/06-magnify.png',
			height: 16,
			width: 16
		});
		btnShowSearch.add(iconShowSearch);
	
	searchViewBar.add(btnShowSearch);
	
	//Campo de pesquisa
	var searchField = Titanium.UI.createTextField({
		hintText:'procure por shopping ou loja',
		clearOnEdit: true,
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
		autocapitalization: false,
		height:35,
		bottom:5,
		left:5,
		width: self.width - 55,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType: Ti.UI.KEYBOARD_ASCII,
		color: '#393A47',
		font: {fontFamily:'Myriad Pro', fontSize: 19},
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	searchViewBar.add(searchField);

	var closeAnimation = Titanium.UI.createAnimation();
	closeAnimation.top = -156; //height da searchView (200) - 44
	closeAnimation.curve = Ti.UI.iOS.ANIMATION_CURVE_EASE_IN_OUT;

	var openAnimation = Titanium.UI.createAnimation();
	openAnimation.top = 0; //height da searchView (200) - 44
	openAnimation.curve = Ti.UI.iOS.ANIMATION_CURVE_EASE_IN_OUT;

	btnShowSearch.addEventListener('click', function(e) { //click no botao abre/fecha view de pesquisa
		if(btnShowSearch.isOpen) {
			btnShowSearch.isOpen = false;
			searchViewHolder.animate(closeAnimation);			
		} else {
			btnShowSearch.isOpen = true;
			searchViewHolder.animate(openAnimation);				
		}
	});	
	
	mainView.add(searchViewHolder);

	var initialBackgroundView = Ti.UI.createView({
		top: 0,
		height: self.height,
		backgroundColor: '#54545B',
		borderWidth: 1,
		zIndex: 1
	});
	mainView.add(initialBackgroundView);

	
	//tabela com resultado da pesquisa
	var tableResult = Ti.UI.createTableView({
		top: 44,
		height: self.height - 93,
    	borderWidth: 0,
    	borderColor: 'transparent',
		backgroundColor: '#FFF',
		data: data
	});
	mainView.add(tableResult);
	
	//exibir detalhes quando linha clicada
	tableResult.addEventListener('click', function(e) {
		Ti.API.info('linha clicada! ' + e.row.title);
		var detailWindow = Ti.UI.createWindow({
			navBarHidden: false,
			title:'detalhe shopping',
			barColor: '#0181EB',
			borderColor: '#E5E3DC',
			layout:'vertical',
			borderWidth: 0,
			backgroundColor: '#F2F2F2'
		});

		var tt = Ti.UI.createView({
			height: 50,
			backgroundColor: 'yellow'
		});
		texto = Ti.UI.createLabel({
			text: 'texto de teste'
		});
		tt.add(texto);
		detailWindow.add(tt);
		
		//var t = Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT;
		//self.containingTab.animate({view:detailWindow,transition:t});
		self.containingTab.open(detailWindow);
	});
	
	//status indicator
	var statusIndicatorView = Ti.UI.createView({height: 40, backgroundColor: '#6F6F75'});	
	var activityIndicator = Ti.UI.createActivityIndicator({
		color: '#fff',
		font: {fontFamily:'Helvetica Neue', fontSize:12, fontWeight:'bold'},
		message: 'Carregando...',
		style:Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		top:10,
		left:95,
		height:'auto',
		width:'auto'
	});
	statusIndicatorView.add(activityIndicator);
	tableResult.setHeaderView(statusIndicatorView);

	
	Ti.addEventListener('shopfinder:activity_indicator.start', function (e) {
		tableResult.scrollToIndex(0,{animated:true});	
		tableResult.setHeaderView(statusIndicatorView);
		activityIndicator.show();
	});	

	Ti.addEventListener('shopfinder:activity_indicator.stop', function (e) {		
		  setTimeout(function(){
		   var fadeOut = Titanium.UI.createAnimation({
			    opacity: 0,
			    duration: 200
		   });
		   statusIndicatorView.animate(fadeOut);

		   fadeOut.addEventListener('complete', function(e){
		   		tableResult.headerView = null;
		   		activityIndicator.hide();
		   });

		  }, 2000);
	});	


	searchField.addEventListener('return', function(e) {
		if(firstLoad) {
			firstLoad = false;
			mainView.remove(initialBackgroundView);
		}
		searchViewHolder.animate(closeAnimation); 
		loadData();
			//simular carregamento de dados
		// var _ultimaLinha = 1;
		// for (var i=_ultimaLinha; i<_ultimaLinha+12; i++) {
			// tableResult.appendRow({
					// leftImage: 'images/img_logo.png',
					// hasChild: false,
					// title: 'Registro ' + i,
					// height: 90,
					// borderColor: 'transparent',
					// borderWidth: 5,
					// backgroundGradient: {
						// type: 'linear',
						// startPoint: { x: '0%', y: '100%'},
						// endPoint: { x: '0%', y: '0%'},
						// colors: [{ color: '#f2f2f2', offset: 0.0}, { color: 'white', offset: 1.0}]
					// }
			// }, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE});
		// }		
		// _ultimaLinha += 12;
	
					
		searchField.blur();
	});		



	function loadData(){
		Ti.fireEvent('shopfinder:activity_indicator.start');
		var loader = Ti.Network.createHTTPClient();
		loader.open('GET', 'http://shopfinder.com.br/shoppings.json');
		loader.onload = function(e) {
			var shoppings = eval('('+this.responseText+')');
			_.each(shoppings, function(shopping, idx){
				//Ti.API.info(JSON.stringify(shopping)); //imprime JSON como string
				
				var row = Ti.UI.createTableViewRow({
					height: 'auto',
					backgroundColor: '#FFF'			
				});
					
				var rowView = Ti.UI.createView({height: 60, layout:'vertical', top: 10, right: 10, bottom: 10, left: 10});
				
				//imagem logo da linha
				// var rowImg = Ti.UI.createImageView({
					// //image: 'images/img_logo.png',
					// top: 0,
					// left: 0,
					// height: 40,
					// width:65,
					// backgroundColor: '#EDEDED',
					// borderColor: '#E5E5E5',
					// borderWidth: 1
				// });
				// rowView.add(rowImg);
				
				var rowTitle = Ti.UI.createLabel({
					text: '' + shopping.name,
					left: 0, //75
					width: 260,
					top: 0, //-40
					bottom: 2,
					height: 24,
					textAlign: 'left',
					color: '#2A2C38',
					font: {fontFamily:'Myriad Pro', fontSize: 18}
				});
				rowView.add(rowTitle);


				var rowAddressStreet = Ti.UI.createLabel({
					text: '' + shopping.address.street + ', ' + shopping.address.number + ' - ' + shopping.address.neighborhood,
					left: 0, //75
					width: 260,
					top: 0,
					bottom: 2,
					height: 16,
					textAlign: 'left',
					color: '#999CA3',
					//font: {fontFamily:'Aller Light', fontSize: 10}
					font: {fontFamily:'Myriad Pro', fontSize: 12}
				});
				rowView.add(rowAddressStreet);	

				
				var rowAddress = Ti.UI.createLabel({
					text: '' + shopping.address.city + ' - ' + shopping.address.state,
					left: 0, //75
					width: 260,
					top: 0,
					bottom: 2,
					height: 16,
					textAlign: 'left',
					color: '#999CA3',
					//font: {fontFamily:'Aller Light', fontSize: 10}
					font: {fontFamily:'Myriad Pro', fontSize: 12}
				});
				rowView.add(rowAddress);				
				
				row.add(rowView);
				tableResult.appendRow(row, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.FADE});

			});
			
			Ti.fireEvent('shopfinder:activity_indicator.stop');

		};
		
		loader.onerror = function(e) {
			Ti.API.debug(e.error);
         	alert('error');
		}
		loader.timeout = 10000;
		loader.send();
	}



	self.add(mainView);
	
	return self;
	
};

module.exports = MainSearchWindowAnimated;
