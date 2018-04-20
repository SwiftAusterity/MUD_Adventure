
(function() {

	//
	if ( typeof require !== "undefined" ) {
		Simplex = require('../shared/simplex.js');
		Chunk = require('../shared/Chunk.js');
		Cell = require('../shared/Cell.js');
	}

	/**
	 * @constructor
	 */
	var world = function( opts = {} ) {

		// get values or set defaults
		this.chunkWidth = opts.chunkWidth || 64;
		this.chunkHeight = opts.chunkHeight || 64;
		this.width = opts.width || 2;
		this.height = opts.height || 2;
		this.chunks = {};
		this.name = opts.name || 'world';

		// fill map
		this.generate();

	}

	/**
	 *
	 */
	world.prototype.clear = function() {

		for ( var x=0; x<this.width; x++ )
		for ( var y=0; y<this.height; y++ ) {
			this.data[x+"-"+y] = new world.Cell();
		}

	}

	/**
	 *
	 */
	world.prototype.generate = function() {

		console.log( "generating world..." );
		for ( var x=0; x<this.width; x++ )
		for ( var y=0; y<this.height; y++ ) {
			this.chunks[x+"-"+y] = new Chunk({
				x: x,
				y: y,
				width: this.chunkWidth,
				height: this.chunkHeight
			});
		}
		console.log( "Done!" );

	},

	/**
	 * REMOVE/MOVE SOMEWHERE
	 */
	world.prototype.generateTrees = function() {

		// create some randomly place trees (TEST)
		for ( var n=0; n<50; n++ ) {
			var x = ~~( Math.random() * this.width );
			var y = ~~( Math.random() * this.height );
			this.data[x+"-"+y].set({ type: "tree" });
		}

	}

	// export
	if ( typeof module === "undefined" )
		window["World"] = world
	else
		module.exports = world;

})();
