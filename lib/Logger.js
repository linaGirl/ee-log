

	
	// colorful strings
	var stylize = function ( str, style ) {
		var styles = {
			  "bold": 		[ 1, 22 ]
			, "italic": 	[ 3, 23 ]
			, "underline": 	[ 4, 24 ]
			, "inverse": 	[ 7, 27 ]
			, "white": 		[ 37, 39 ]
			, "grey": 		[ 90, 39 ]
			, "black": 		[ 90, 39 ]
			, "blue": 		[ 34, 39 ]
			, "cyan": 		[ 36, 39 ]
			, "green": 		[ 32, 39 ]
			, "magenta": 	[ 35, 39 ]
			, "red": 		[ 31, 39 ]
			, "yellow": 	[ 33, 39 ]
		};
		return '\x1b[' + ( styles[ style ][ 0 ] ) + "m" + str + '\x1b[' + ( styles[ style ][ 1 ] ) + "m";
	};
	
	[ "bold", "underline", "italic", "inverse", "grey", "yellow", "red", "green", "blue", "white", "cyan", "magenta" ].forEach( function( style ) {
	
		Object.defineProperty( String.prototype, style, {
			get: function () {
				return stylize(this, style);
			}
			, configurable: true
		} );	
	} );




	var   Class 	= require( "ee-class" )
		, project 	= require( "ee-project" )
		, type 		= require( "ee-types" )
		, util 		= require( "util" );


	module.exports = new Class( {

		// debug
		debug: function debug(){
			this.log( arguments, "grey" );
		}

		// info
		, info: function info(){
			this.log( arguments, "white" );
		}

		// warn
		, warn: function warn(){
			this.log( arguments, "yellow", true );
		}

		// error ( uncatchable )
		, error: function error(){
			this.log( arguments, "red", true );
		}



		// highlight a message
		, highlight: function highlight(){
			this.log( arguments, "cyan", true );
		}


		, log: function( args, color, bold ){
			var logs = this.buildMessage( Array.prototype.slice.call( args ) );
			console.log( this.createSignature( color, bold ) + ( bold ? logs.text[ color ].bold : logs.text[ color ] ) );

			this.printDir( logs.dir ); 
			logs.errors.forEach( function( e ){ this.trace( e, true ); }.bind( this ) );
		}



		, buildMessage: function( items ){		
			if ( items.length > 0 ){
				if ( type.s( items[ 0 ] ) ){
					var reg = /\%s/gi, i = 0;
					while( reg.exec( items[ 0 ] ) ){
						i++;
						if ( items.length > i ) {
							var formatted = this.formatItem( items[ i ] );
							items[ 0 ] = items[ 0 ].replace( /\%s/i, formatted );
							reg.lastIndex += formatted.length - 1; 
						}
						else return this.processItems( "", items );						
					}

					return this.processItems( items[ 0 ], items.slice( i + 1 ) );
				}
				else return this.processItems( "", items );
			}
			return this.processItems( "", [] );
		}


		, processItems: function( text, items ){
			var logs = { text: [], dir: [], errors: [] }, currentItem;

			if ( text ) logs.text.push( text);

			for ( var i = 0, l = items.length; i < l; i++ ){
				currentItem = this.formatItem( items[ i ] );
				if ( type.error( currentItem ) ) logs.errors.push( currentItem );
				else if ( type.object( currentItem ) ) logs.dir.push( items[ i ] );
				else logs.text.push( currentItem );
			}

			logs.text = logs.text.join( ", " );

			return logs;
		}


		, formatItem: function( input ){
			switch ( type( input ) ){
				case "string":
					return input.length > 1000 ? input.substr( 0, 1000 ) + " [ ... ]" : input;
				case "null":
					return "null";
				case "undefined":
					return "undefined";
				case "buffer":
					var str = "";
					for ( var k = 0, m = input.length; k < m; k++ ){
						str += input[ k ].toString( 16 ) + " ";
						if ( k > 400 ) {
							str += "[ ... ]"
							break;
						}
					}
					return str;
				case "error":
					return input.name + ": " + input.message;
				case "array":
				case "object":
					return input;
				default:
					return input + "";
			}
		}


		// dir an object displaying an optional message
		, dir: function(){
			// required for creating the correct signature ( nede to add a line to the stack );
			( function(){
				console.log( this.createSignature( "white" ) + "[Dir]".white );
			}.bind( this ) )()
			
			this.printDir( Array.prototype.slice.call( arguments ) );
		}


		, printDir: function( items ){
			for ( var i = 0, l = items.length; i < l; i++ ){
				this.__dir( items[ i ], 0, null, true, [] );
			}
		}


		// private dir
		, __dir: function( data, margin, name, first, knownObjects  ){
			var fnname = name;
			name = ( typeof name === "string" ? name + ": " : "" ).white;

			switch ( typeof data ){
				case "object":
					// null
					if ( data === null ){
						console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + "null".white );
					}

					// date
					else if ( data instanceof Date ){
						console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + data.toString().white );
					}

					// buffer
					else if ( Buffer.isBuffer( data ) ){
						var result =  this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name;

						for ( var i = 0, l = data.length; i < l; i++ ){
							if ( i > 66 ){
								result += "... ( omitted ".grey + ( ( data.length - 66 ) + "" ).grey + " )".grey
								break;
							}
							else {
								result += ( data[ i ].toString( 16 ) + " " ).white;
							}
						}
						console.log( result );
					}
					else {
						// dont do circular things
						if ( knownObjects.indexOf( data ) >= 0 ){
							return console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + "[ circular ]".grey );
						}
						else {
							knownObjects.push( data );
						}
						var keys = Object.keys( data ), i = keys.length, l = i, k = 0
							, isArray = data instanceof Array;

						if ( margin > 20 ) return console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + ": ".grey + ( isArray ?  "(" + data.length + "):[ ... ]" : "{ ... }" ).grey + " // max inspection depth reached".grey );

						if ( i === 0 ){
							return console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + ( isArray ? "(" + data.length + "):[]" : "{}" ).grey );
						}

						console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + ( isArray ? "(" + data.length + "):[" : "{" ).grey );
						first = true;
						while( i-- ){
							if ( k > 200 ) {
								console.log( this.__pad( "", ( margin + 1 ) * 4, " " ) + ", ".grey + ( isArray ? "" + name : name ) + "... ( omitted ".grey + ( i + 1 + "" ).grey + " ) // max items per object reached".grey );
								console.log( this.__pad( "", margin * 4, " " ) + ( isArray ? "]" : "}" ).grey );
								return;
							}
							//console.log(keys[ l - i - 1  ] );
							if ( data.hasOwnProperty( keys[ l - i - 1  ] ) ) this.__dir( data[ keys[ l - i - 1  ] ], margin + 1, ( isArray ? "" +  keys[ l - i - 1  ]  : keys[ l - i - 1  ] ), first, knownObjects );
							if ( first ) first = false;
							k++
						}
						console.log( this.__pad( "", margin * 4, " " ) + ( isArray ? "]" : "}" ).grey );
					}
					break;

				case "string":
					if ( data.length > 200 ){
						console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + "\"".white + data.substr( 0, 200 ).green + "...\"".white + " ( omitted ".grey + ( data.length - 200 + "" ).grey + " )".grey);
					}
					else {
						console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + "\"".white + data.green + "\"".white );
					}
					break;

				case "number":
					console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + ( data + "" ).blue.bold );
					break;

				case "boolean":
					console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + data.toString().yellow );
					break;

				case "function":
					console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + ( "function " + ( fnname || "" ) ).grey );
					break;

				default:
					console.log( this.__pad( "", margin * 4, " " ) + ( ! first ? ", " : "" ).grey + name + data );
					break;

			}
		}



		// trace an error displaying an optional message
		, trace: function trace( err, skip ){
			var lines, current, i, l;
			if ( err && err.stack ){

				if ( !skip )( function(){ console.log( this.createSignature( "red", true ) + "[Trace]".red.bold ); }.bind( this ) )();
				else console.log( this.createSignature( "red", true ) + "[Trace]".red.bold );

				console.log( this.__pad( "", 80, "-" ).grey );
				console.log( ( err.name + ": " ).red.bold + ( err.message ? err.message : "-" ).white.bold  );
				console.log( this.__pad( "", 80, "-" ).grey );
			
				lines = err.stack.split( "\n" );
				i = lines.length, l = i;

				while( i-- ){
					current = /at (.*) \((.*)\:([0-9]+)\:([0-9]+)\)$/.exec( lines[ l - i ] );
					
					if ( !current ){
						current = /at ()(.*)\:([0-9]+)\:([0-9]+)$/.exec( lines[ l - i ] );
					}
					if ( current ) {
						console.log( this.__pad( current[ 2 ].replace( project.root, "/" ), 30, " " ).yellow + this.__pad( current[ 3 ], 5, " " ).white + ":".grey + this.__pad( current[ 4 ], 4, " ", true ).grey + current[ 1 ].white  );
					}
				}

				console.log( this.__pad( "", 80, "-" ).grey );
			}
		}



		// create logsignature
		, createSignature: function( color, bold ){
			var date = new Date(), result, pos = /\n.*\n.*\n.*\n\s*at\s([^\)]+)\s*\(([^:]+)\:([0-9]+)\:([0-9]+)/i.exec( ( new Error() ).stack );
		
			result  = this.__pad( date.getDate(), 2 ) + " ";
			result += this.__pad( date.getHours(), 2 ) + ":";
			result += this.__pad( date.getMinutes(), 2 ) + ":";
			result += this.__pad( date.getSeconds(), 2 ) + ".";
			result += this.__pad( date.getMilliseconds(), 3 );

			result += " > ";
			if ( pos ){
				var tlen = 65 - ( pos[ 1 ].length + pos[ 2 ].length + pos[ 3 ].length + pos[ 4 ].length ) + 1;
				if ( tlen < 1 ) tlen = 1;
				result += ( ( pos[ 2 ].replace( project.root, "/" ) + " " ).grey  + pos[ 3 ].grey + ( ":" + pos[ 4 ] ).grey + ", ".grey + pos[ 1 ].grey ) + new Array( tlen ).join( " " );
			}
			result += " >>> ".grey;

			return result.grey;
		}



		// pad
		, __pad: function( text, len, char, invert ){
			text = text + "";
			return text.length >= len ? text : ( invert ? text + new Array( len - text.length + 1).join( char || "0" ) : new Array( len - text.length + 1).join( char || "0" ) + text );			
		}
	} );