


	var   assert 	= require( "assert" )
		, index 	= 0
		, lens 		= []
		, results 	= [172,31,40,69,15,50,11,199,31,79,11,176,186,31,50,11,190,31,48,11,173,182,238,192,180,202,172,31,75,11,181,180,189,190,194,192,172,31,89,57,50,91,57,49,76,48,72,19,15,72,11];



	console.log = function( data ){
		//lens.push( data.length);
		assert.equal( data.length, results[ index ], "log line has the wrong length: " + data );
		index++;
	}


	var log = require( "./" );


	log({
		a: { c: '234234'}
		, b: 33
	});

	log.debug( "debug %s ==> %s", 1, new Buffer( "whoa!" ), { go: "is a cool language!"} );
	log.info( "info" );
	log.error( "error", { "test": 3 } );
	log.highlight( "highlight" );
	log.dir( { hi: 1 } );



	log( 2, "er %s: %s", 22,  "hui", new Buffer(22) );


	log.info( "this should show up!" );

	log(Symbol())
	log.wtf( "nope nope nope!" );

	log({blah: /hui/gi});


	log.debug('debug log');
	log.info('info log');
	log.warn('warn log');
	log.error('error log');
	log.highlight('highlight log');
	log.success('success log');
	log({
		  strings: 'hi, my name is michael'
		, numbers: 139
		, booleans: true
		, regexps: /matching stuff/gi
		, symbols: Symbol(1337)
		, maps: new Map([['key-a', 'value-a'], ['key-b', {value: 'b'}]])
		, and: 'many more'
	});


	//console.dir( JSON.stringify( lens ) );
