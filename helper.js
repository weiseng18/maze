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

function get(id) {
	return document.getElementById(id);
}