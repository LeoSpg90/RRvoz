
let altoGestor = 100;
let anchoGestor = 400;



class GestorSenial{


	//----------------------------------------

	constructor( minimo_ , maximo_ ){

		this.minimo = minimo_;
		this.maximo = maximo_;

		this.puntero = 0;
		this.cargado = 0;
		this.mapeada = [];
		this.filtrada = 0;
		this.anterior = 0;
		this.derivada = 0;
		this.histFiltrada = [];		
		this.histDerivada = [];		
		this.amplificadorDerivada = 15.0;
		this.dibujarDerivada = false;

		this.f = 0.80;
	}
	//----------------------------------------


	actualizar( entrada_ ){

		this.mapeada[ this.puntero ] = map( entrada_ , this.minimo , this.maximo , 0.0 , 1.0 );
		this.mapeada[ this.puntero ] = constrain( this.mapeada[ this.puntero ] , 0.0 , 1.0 );

		this.filtrada = this.filtrada * this.f + this.mapeada[ this.puntero ] * ( 1-this.f );
		this.histFiltrada[ this.puntero ] = this.filtrada;

		this.derivada = ( this.filtrada - this.anterior ) * this.amplificadorDerivada;
		this.histDerivada[ this.puntero ] = this.derivada;

		this.anterior = this.filtrada;

		//console.log( entrada_ + "  " + "    " + 
		//	this.mapeada[this.puntero] + "     " + this.puntero );

		this.puntero++;
		if( this.puntero >= anchoGestor ){
			this.puntero = 0;			
		}
		this.cargado = max( this.cargado , this.puntero );

	}
	//----------------------------------------

	dibujar( x_ , y_ ){

		push();
		fill(0);
		stroke(255);
		rect( x_ , y_ , anchoGestor , altoGestor );

		//console.log( this.cargado );

		for( let i=1 ; i<this.cargado ; i++ ){
			let altura1 = map( this.mapeada[i-1] , 0.0 , 1.0 , y_+altoGestor , y_ );
			let altura2 = map( this.mapeada[i] , 0.0 , 1.0 , y_+altoGestor , y_ );

			stroke(255);
			line( x_+i-1 , altura1 , x_+i , altura2 );

			altura1 = map( this.histFiltrada[i-1] , 0.0 , 1.0 , y_+altoGestor , y_ );
			altura2 = map( this.histFiltrada[i] , 0.0 , 1.0 , y_+altoGestor , y_ );

			stroke(0,255,0);
			line( x_+i-1 , altura1 , x_+i , altura2 );

			if( this.dibujarDerivada ){
				altura1 = map( this.histDerivada[i-1] , -1.0 , 1.0 , y_+altoGestor , y_ );
				altura2 = map( this.histDerivada[i] , -1.0 , 1.0 , y_+altoGestor , y_ );

				stroke(255,255,0);
				line( x_+i-1 , altura1 , x_+i , altura2 );	
			}
			
		}
		stroke( 255 , 0 , 0 );
		line( x_+this.puntero , y_ , x_+this.puntero , y_+altoGestor );
		pop();
	}
	//----------------------------------------
}