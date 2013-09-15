


	var   Logger 		= require( "./Logger" )
		, type 			= require( "ee-types" );



	var logger = new Logger();



	var log = function(){
		var items = Array.prototype.slice.call( arguments, 0 );

		for ( var i = 0, l = items.length; i <l; i++ ){
			var item = items[ i ];

			if ( type.error( item ) ){
				logger.trace( item, true );
			}

			else if ( type.s( item ) ){
				var occurences = item.split( /\%s/gi ).length - 1;
				var list = items.slice( i+1, i+occurences+1 );
				list.unshift( item );
				logger.log( list, "white" );

				i += occurences;
			}
			else logger.log( [ item ], "white" );
		}
	};


	log.__proto__ = logger;


	module.exports = log;


	