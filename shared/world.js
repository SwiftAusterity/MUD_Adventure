
/**
 * @constructor
 */
var module = function( opts = {} ) {

	// get values or set defaults
	this.width = opts.width || 32,
	this.height = opts.height || 32;
	this.data = {};
	
	// fill map
	for ( var x=0; x<this.width; x++ )
	for ( var y=0; y<this.height; y++ ) {
		this.data[x+"-"+y] = new module.Cell();
	}

}

/**
 * Iterates through the map and writes characters to a string as HTML.
 */
module.prototype.render = function() {
	
	//
	var html = "<div>";
	for ( var y=0; y<this.height; y++ ) {
		html += "<p>";
		for ( var x=0; x<this.width; x++ ) {
			var cell = this.data[x+"-"+y];
			html += "<span style=\"color:"+cell.draw[1]+"\">" + cell.draw[0] + "</span>";
		}
		html += "</p>";
	}
	html += "</div>";
	
	//
	return html;

}

/**
 * @constructor
 */
module.Cell = function( opts = {} ) {

	this.type = opts.type || "grass";
	this.draw = module.Cell.mapping[this.type];

}

// See https://www.martinstoeckli.ch/fontmap/fontmap.html reference
// Assume Courier New is used
module.Cell.mapping = {
	"grass": [ "&#8718;", "#00ff00" ]
}

// export
var __moduleName = "World";
( typeof exports === "undefined" )
	? window[__moduleName] = module
	: exports = module;