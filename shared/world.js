
(function() {

	//
	if ( typeof require !== "undefined" ) {
		Simplex = require('../shared/simplex.js');
	}

	/**
	 * @constructor
	 */
	var world = function( opts = {} ) {
		
		// get values or set defaults
		this.chunkWidth = opts.chunkWidth || 16;
		this.chunkHeight = opts.chunkHeight || 16;
		this.width = opts.width || 1;
		this.height = opts.height || 1;
		this.chunks = {};

		// fill map
		this.generate();
		//this.generateTrees();

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

		for ( var x=0; x<this.width; x++ )
		for ( var y=0; y<this.height; y++ ) {
			this.chunks[x+"-"+y] = new Chunk({ x: x, y: y });
		}

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

	//
	var permutation = [];
	for (  var n=0; n<512; n++ ) {
		permutation[n] = ~~( Math.random() * 512 );
	}

	/**
	 * Iterates through the map and builds a HTML string.
	 */
	world.prototype.render = function() {

		//
		var html = "<div>";
		for ( var y=0; y<this.height*this.chunkHeight; y++ ) {
			html += "<div class='row'>";
			for ( var x=0; x<this.width*this.chunkWidth; x++ ) {
				
				var chunk = this.chunks[~~(x/this.chunkWidth)+"-"+~~(y/this.chunkHeight)];
				var cell = chunk.data[(x-chunk.x)+"-"+(y-chunk.y)];
				var tiles = cell.draw.tiles.length,
					index = permutation[(y + (y*48) + x) % 512] % tiles,
					tileX = cell.draw.tiles[index].x,
					tileY = cell.draw.tiles[index].y,
					colors = cell.draw.color.length,
					ci = permutation[(y + (y*48) + x) % 512] % colors,
					color = cell.draw.color[ci];

				html += "<div style=\"width: 12px; height: 12px; background-color: "+color+"; background-image: url(test/codepage-437.png); background-position: -"+tileX+"px -"+tileY+"px;\"></div>";

			}
			html += "</div>";
		}
		html += "</div>";

		//
		return html;

	}


	// export
	if ( typeof module === "undefined" )
		window["World"] = world
	else
		module.exports = world;

})();
