function init2D(height, width, val) {
	var arr = [];
	for (var i=0; i<height; i++) {
		var row = [];
		for (var j=0; j<width; j++)
			row.push(val);
		arr.push(row);
	}
	return arr;
}

function randomIndex(length) {
	// Math.random() range is [0,1)s
	return Math.floor(Math.random()*length);
}

// compares two points a and b
// there can be other attributes in the objects a and b and it does not matter
// this is to compare coordinates
function comparePoints(a, b) {
	return (a.x == b.x) && (a.y == b.y);
}

// returns the HTML element of the xth tr of the yth td of a table.
// expects id to be the id of a table.
function getCell(id, x, y) {
	return document.getElementById(id).children[0].children[x].children[y];
}

function get(id) {
	return document.getElementById(id);
}