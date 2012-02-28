function MainSearchWindowAnimated(){
	var _ = require('/lib/underscore'); //Modulo externo prar algumas magicas com JS

	var data = []; //armazena resultado da pesquisa

	var self = Ti.UI.createWindow({
		navBarHidden: true,
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
	var mainView = Ti.UI.createView({
		top: 0,
		height: self.height,
		backgroundColor: 'green',
		borderColor: 'blue',
		borderWidth: 1,
		zIndex: 0
	});
	
	var searchView = Ti.UI.createView({
		top: 0,
		height: 200, //alterar se for android
		backgroundColor: '#fff',
		borderColor: 'blue',
		borderWidth: 1,
		zIndex: 1
	});
	
	
	var logoImg = Ti.UI.createImageView({
		image: 'images/shopfinder-logo.png',
		top: 75,
		left: 50,
		height: 46,
		width:216,
		zIndex: 1
	});
	
	logoImg.addEventListener('click', function(e){
		alert('left:' + logoImg.getLeft() );
	});
	
	searchView.add(logoImg);
	
	//Campo de pesquisa
	var searchField = Titanium.UI.createTextField({
		color:'#336699',
		height:35,
		bottom:5,
		left:5,
		width: self.width - 10,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	
	searchView.add(searchField);

	var animation = Titanium.UI.createAnimation();
	animation.top = -156; //height da searchView (200) - 44
	animation.duration = 700;
	//animation.autoreverse = true;
	animation.addEventListener('complete',function(e) {
		//animation.removeEventListener('complete',this);
		//animation.backgroundColor = 'orange';
		//searchView.animate(animation);
	 });
	searchView.animate(animation); 

	searchView.addEventListener('click', function(e) {
		this.animate(animation); 
	});
	

	mainView.add(searchView);

	
	//tabela com resultado da pesquisa
	var tableResult = Ti.UI.createTableView({
		borderColor: 'transparent',
		backgroundColor: '#F4F4F4',
		data: data
	});


	mainView.add(tableResult);


	searchField.addEventListener('return', function(e) {
			//simular carregamento de dados
		var _ultimaLinha = 1;
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
	
					
		searchField.blur();
	});		





	self.add(mainView);
	
	return self;
	
};

module.exports = MainSearchWindowAnimated;
