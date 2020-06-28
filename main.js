function Maze(height, width) {
	// dimensions
	this.height = height;
	this.width = width;

	// visited array
	this.grid = init2D(height, width, 0);

	// 1 to indicate that a wall exists
	// verticalWall[x][y] is the state of the vertical wall between grid[x][y] and grid[x][y+1]
	this.verticalWalls = init2D(height-1, width, true); 
	// horizontalWall[x][y] is the state of the horizontal wall between grid[x][y] and grid[x+1][y]
	this.horizontalWalls = init2D(height, width-1, true); 

	/*
	placeholder for removing walls as it Maze() essentially returns a grid now
	var startCell = {x:0, y:0};
	var wallList = [{x:0, y:0, dir:"v"}, {x:0, y:0, dir:"h"}];
	*/
}

// returns a list of adjacent walls
Maze.prototype.getAdjacentWalls = function(x, y) {
	var walls = [];
	if (!this.outOfBounds(x-1, y)) //if cell above exists, can add horizontal wall above
		walls.push({x:x-1, y:y, dir:"h"});
	if (!this.outOfBounds(x+1, y)) //if cell below exists, can add horizontal wall below
		walls.push({x:x, y:y, dir:"h"});
	if (!this.outOfBounds(x, y-1)) //if cell to the left exists, can add vertical wall to the left
		walls.push({x:x, y:y-1, dir:"v"});
	if (!this.outOfBounds(x, y+1)) //if cell to the right exists, can add vertical wall to the right
		walls.push({x:x, y:y, dir:"v"});
	return walls;
}

// check if a cell is out of bounds
Maze.prototype.outOfBounds = function(x, y) {
	return (x >= 0 && x < height && y >= 0 && y < height);
}

function Display(maze) {
	// generates HTML table for displaying the grid
	// tentative method chosen to display is having a <td> for each space on the grid, and a <td> for each wall
	// this means that not all <td> will be of same size
	// this also means that there could be compatability issues with other screen sizes
	this.generateHTML = function() {
		// table
		var table = document.createElement("table");
		table.id = "display";
		table.style.borderSpacing = 0;
		table.style.border = "solid black 2px";

		for (var i=0; i<2*maze.height-1; i++) {
			var row = table.insertRow();
			row.style.height = (i%2==0 ? "20px" : "2px");

			for (var j=0; j<2*maze.width-1; j++) {
				var cell = row.insertCell();				
				cell.style.width = (j%2==0 ? "20px" : "1px");
			}
		}
		get("mazeArea").appendChild(table);
	}

	this.buildWalls = function() {
		// connecting the walls at corners
		for (var i=0; i<maze.height-1; i++)
			for (var j=0; j<maze.width-1; j++) {
				var cell = get("display").children[0].children[(i<<1) + 1].children[(j<<1) + 1];
				cell.style.backgroundColor = "black";
			}
		// build vertical walls
		for (var i=0; i<maze.height-1; i++)
			for (var j=0; j<maze.width; j++)
				if (maze.verticalWalls[i][j]) {
					var cell = get("display").children[0].children[(i<<1) + 1].children[(j<<1)];
					cell.style.backgroundColor = "black";
				}
		// build horizontal walls
		for (var i=0; i<maze.height; i++)
			for (var j=0; j<maze.width-1; j++) 
				if (maze.horizontalWalls[i][j]) {
					var cell = get("display").children[0].children[(i<<1)].children[(j<<1)+1];
					cell.style.backgroundColor = "black";
				}
	}
}

window.onload = function() {

	var maze = new Maze(10, 20);

	var display = new Display(maze);
	display.generateHTML();
	display.buildWalls();

}