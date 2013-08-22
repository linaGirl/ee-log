

	var log = require( "./" );


	log.debug( "debug %s ==> %s", 1, new Buffer( "whoa!" ), { go: "is a cool language!"} );
	log.info( "info" );
	log.warn( "warn", new Date(), 455 );
	log.error( "error", { "test": 3 } );
	log.highlight( "highlight" );
	log.dir( { hi: 1 } );
	log.trace( new Error( "testing the sh*t" ) );