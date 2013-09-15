

	var   Class 		= require( "ee-class" )
		, project 		= require( "ee-project" )
		, type 			= require( "ee-types" )
		, util 			= require( "util" );


	module.exports = new Class( {


		gitRevision: "«loading»"


		, init: function(){
			this.loadGITRevision();
			this.moduleReg = /\n.*\n.*\n.*\n\s*at\s([^\)]+)\s*\(([^:]+)\:([0-9]+)\:([0-9]+)/i;
		}





		// get sscript name of the caller
		, getExecutingContext: function(){
			this.moduleReg.lastIndex = 0;
			var path = this.moduleReg.exec( ( new Error() ).stack );
			if ( path && path.length > 2 ) return { path: path[ 2 ].replace( project.root, "/" ), caller: path[ 1 ].trim(), line: parseInt( path[ 3 ], 10 ), char: parseInt( path[ 4 ], 10 ) };
			else return null;
		}


		// get project version
		, loadGITRevision: function(){
			project.getGITRevision, function( err, revision ){
				if ( err ) this.gitRevision = "«unknown»", console.log( err.message );
				else this.gitRevision = revision;
			}.bind( this ) );
		}
	} );


	new module.exports();


	revision, sequence, file, line, caller, type, message, err, data, initiator

	32udölfk, 1, webserver.js, 23, request(), info, "got a request", null, { source: { ip: 2, port, ua } } 