function MainSearchWindow(){
	var _ = require('/lib/underscore'); //Modulo externo prar algumas magicas com JS

	var data = []; //armazena resultado da pesquisa

	var self = Ti.UI.createWindow({
		title:'Procurar',
		barColor: '#0181EB',
		//barColor: '#E5E3DC',
		//borderColor: '#E5E3DC',
		layout:'vertical',
		borderWidth: 0,
		backgroundColor: '#F2F2F2'
	});
	
	var titleLabel = Ti.UI.createLabel({
		color: 'white',
		height: 18,
		width: 210,
		top: 10,
		text: 'ShopFinder',
		textAlign: 'center',
		font: {fontaFamily:'Helvetica Neue', fontSize: 18, fontWeight: 'bold'},
		//shadowColor: '#fff', shadowOffset: {x:0,y:1}
	});
	self.setTitleControl(titleLabel);


	//view que envolve todos objetos da tela
	var view = Ti.UI.createView({
		top: 0,
		height: self.height - 40, //alterar se for android
		backgroundColor: '#F2F2F2',
	});
	
	
	//Campo de pesquisa
	var searchField = Ti.UI.createSearchBar({
			showCancel: false,
			top:0,
			height: 43,
			hintText: 'Procure por shopping ou loja',
			barColor: '#EDECEA',
			//backgroundColor: '#F2F2F2',
			backgroundColor: 'yellow',
	    	borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE,
	    	keyboardType: Ti.UI.KEYBOARD_APPEARANCE_DEFAULT,
	    	returnKeyType: Ti.UI.RETURNKEY_SEARCH
		});

		//Eventos do campo de pesquisa/teclado
		searchField.addEventListener('focus', function(e){
			this.setShowCancel(true);
		});
		searchField.addEventListener('cancel', function(e){
			Ti.API.info('search bar cancel fired');
			this.setShowCancel(false);
			this.blur();
		});
		searchField.addEventListener('return', function(e) {
			cleanDataTable();
			loadData(); //carregar dados fake
			
			 //botao load more
			var footerView = Ti.UI.createView({height: 70});
			var btnLoadMore = Ti.UI.createButton({
				top: 10,
				height:44,
				width:180,
				title: 'Buscar mais...',
				textAlign: 'center',
				font: {fontaFamily:'Helvetica Neue', fontSize: 16, fontWeight: 'bold'},
				//shadowColor: '#fff', shadowOffset: {x:0,y:1}
				//codigo abaixo eh frescura de botao gradiente
				style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
				borderRadius:10,
				backgroundGradient:{type:'linear',
					colors:['#000001','#666666'],
					startPoint:{x:0,y:0},
					endPoint:{x:2,y:50},
					backFillStart:false
				},
				borderWidth:1,
				borderColor:'#666'
			});
			
			btnLoadMore.addEventListener('click', function(e){
				loadData();
			});
			
			
			footerView.add(btnLoadMore);
			tableResult.setFooterView(footerView);
			
			searchField.blur();
		});	
		view.add(searchField);

	
	
	//tabela com resultado da pesquisa
	var tableResult = Ti.UI.createTableView({
		borderColor: 'transparent',
		backgroundColor: '#F4F4F4',
		height: 326,
		width: 320,
		top: 43,
		left: 0,
		data: data
	});
	view.add(tableResult);
	
	//exibir detalhes quando linha clicada
	tableResult.addEventListener('click', function(e) {
		Ti.API.info('linha clicada! ' + e.row.title);
		var detailWindow = Ti.UI.createWindow({
			title:'detalhe',
			barColor: '#0181EB',
			borderColor: '#E5E3DC',
			layout:'vertical',
			borderWidth: 0,
			backgroundColor: '#F2F2F2',
		});
		self.containingTab.open(detailWindow);
		
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
					backgroundGradient: {
						type: 'linear',
						startPoint: { x: '0%', y: '100%'},
						endPoint: { x: '0%', y: '0%'},
						colors: [{ color: '#F4F4F4', offset: 0.0}, { color: '#FCFCFC', offset: 1.0}]
					}				
				});
					
				var rowView = Ti.UI.createView({height: 60, layout:'vertical', top: 10, right: 10, bottom: 10, left: 10});
				
				
				//imagem logo da linha
				var rowImg = Ti.UI.createImageView({
					//image: 'images/img_logo.png',
					top: 0,
					left: 0,
					height: 40,
					width:65,
					backgroudColor: 'grey',
					borderColor: 'grey',
					borderWidth: 2
				});
				rowView.add(rowImg);
				
				var rowTitle = Ti.UI.createLabel({
					text: '' + shopping.name,
					left: 75,
					width: 200,
					top: -40,
					bottom: 2,
					height: 16,
					textAlign: 'left',
					color: '#404351',
					font: {fontaFamily:'Helvetica Neue', fontSize: 13, fontWeight: 'bold'}
				});
				rowView.add(rowTitle);

				var rowAddress = Ti.UI.createLabel({
					text: '' + shopping.address.city + ' - ' + shopping.address.state,
					left: 75,
					width: 260,
					top: 0,
					bottom: 2,
					height: 16,
					textAlign: 'left',
					color: '#999999',
					font: {fontaFamily:'Helvetica Neue', fontSize: 10, fontWeight: 'normal'}
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

	function cleanDataTable(){
		_ultimaLinha = 1;
		tableResult.setData([]);	
	}



	//BEGIN_BLOCK - Tudo isso vai para componente em outro arquivo para ser reaproveitado ################
	var toolActInd = Titanium.UI.createActivityIndicator();

	//mostra status
	Ti.addEventListener('shopfinder:activity_indicator.start', function (e) {
		Ti.API.info('evento:  shopfinder:activity_indicator.start' + e);
		toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Loading...';
		self.setToolbar([toolActInd],{animated:true});
		toolActInd.show();
		// setTimeout(function()
		// {
			// toolActInd.hide();
			// self.setToolbar(null,{animated:true});
		// },3000);
	});
	
	Ti.addEventListener('shopfinder:activity_indicator.stop', function (e) {
		toolActInd.hide();
		self.setToolbar(null,{animated:true});
	});	

	//END_BLOCK - Tudo isso vai para componente em outro arquivo para ser reaproveitado ################
	

	//simular carregamento de dados
	var _ultimaLinha = 1;
	function loadDataFake(queryPesquisa){
		for (var i=_ultimaLinha; i<_ultimaLinha+12; i++) {
			tableResult.appendRow({
					leftImage: 'images/img_logo.png',
					hasChild: false,
					title: 'Registro ' + i,
					height: 90,
					borderColor: 'transparent',
					borderWidth: 5,
					backgroundGradient: {
						type: 'linear',
						startPoint: { x: '0%', y: '100%'},
						endPoint: { x: '0%', y: '0%'},
						colors: [{ color: '#f2f2f2', offset: 0.0}, { color: 'white', offset: 1.0}]
					}
			}, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE});
		}		
		_ultimaLinha += 12;
	}
	

	self.add(view);
	
	return self;
	
};

module.exports = MainSearchWindow;
