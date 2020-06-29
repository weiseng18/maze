// ------
// Maze
// ------
function Maze(height, width) {
	// dimensions
	this.height = height;
	this.width = width;

	// visited array
	this.grid = init2D(height, width, false);

	// goal
	this.goal = {x:height-1, y:width-1};

	// 1 to indicate that a wall exists
	// verticalWall[x][y] is the state of the vertical wall between grid[x][y] and grid[x][y+1]
	this.verticalWalls = init2D(height, width-1, true); 
	// horizontalWall[x][y] is the state of the horizontal wall between grid[x][y] and grid[x+1][y]
	this.horizontalWalls = init2D(height-1, width, true); 

	// can be initialized as random start cell, but choosing (0, 0) for now
	this.start = {x:0, y:0};
	var wallList = [{x:0, y:0, dir:"v"}, {x:0, y:0, dir:"h"}];
	this.grid[0][0] = true;
	var ufds = new UFDS(height*width);

	while (wallList.length) {

		var index = randomIndex(wallList.length);
		var wall = {x:wallList[index].x, y:wallList[index].y, dir:wallList[index].dir};
		var cell1 = {x:wall.x, y:wall.y};
		var cell2 = wall.dir=="h" ? {x:wall.x+1, y:wall.y} : {x:wall.x, y:wall.y+1};

		// generate ufds ID x*width + y
		cell1.ID = cell1.x * width + cell1.y;
		cell2.ID = cell2.x * width + cell2.y;

		// remove current wall and add new visited cell's walls
		// only if they are not same set (i.e. not connected by any path)
		if (!ufds.isSameSet(cell1.ID, cell2.ID)) {

			if (wall.dir == "h") this.horizontalWalls[wall.x][wall.y] = false;
			else this.verticalWalls[wall.x][wall.y] = false;
			ufds.unionSet(cell1.ID, cell2.ID);

			// find newly visited cell and add those walls to wallList[]
			var walls;
			if (this.grid[cell1.x][cell1.y] == false) {
				this.grid[cell1.x][cell1.y] = true;
				walls = this.getAdjacentWalls(cell1.x, cell1.y);
			}
			else {
				this.grid[cell2.x][cell2.y] = true;
				walls = this.getAdjacentWalls(cell2.x, cell2.y);
			}
			wallList = wallList.concat(walls);
		}

		// remove wall from array
		wallList.splice(index, 1);
	}
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
	return !(x >= 0 && x < this.height && y >= 0 && y < this.width);
}

// ------
// Display
// ------
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

		table.style.marginLeft = "auto";
		table.style.marginRight = "auto";

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
				var cell = getCell("display", (i<<1)+1, (j<<1)+1);
				cell.style.backgroundColor = "black";
			}
		// build vertical walls
		for (var i=0; i<maze.height; i++)
			for (var j=0; j<maze.width-1; j++)
				if (maze.verticalWalls[i][j]) {
					var cell = getCell("display", (i<<1), (j<<1)+1);
					cell.style.backgroundColor = "black";
				}
		// build horizontal walls
		for (var i=0; i<maze.height-1; i++)
			for (var j=0; j<maze.width; j++) 
				if (maze.horizontalWalls[i][j]) {
					var cell = getCell("display", (i<<1)+1, (j<<1));
					cell.style.backgroundColor = "black";
				}
	}

	this.loadEndImage = function() {
		var goal = maze.goal;
		console.log(goal);
		
		var cell = getCell("display", (goal.x<<1), (goal.y<<1));

		var img = new Image();
		img.src = "img/endflag.png";
		img.style.display = "block";
		img.style.marginLeft = "auto";
		img.style.marginRight = "auto";

		cell.appendChild(img);
	}
}

// ------
// Player
// ------
function Player(x, y) {
	this.x = x;
	this.y = y;

	this.HTMLsprite = new Image();
	this.HTMLsprite.id = "player";
	this.HTMLsprite.src = "img/player.png";
	this.HTMLsprite.style.display = "block";
	this.HTMLsprite.style.marginLeft = "auto";
	this.HTMLsprite.style.marginRight = "auto";
}

Player.prototype.move = function(which) {
	// up, left, down, right
	deltas = [{x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:0, y:1}];
	wallDeltas = [{x:-1, y:0}, {x:0, y:-1}, {x:0, y:0}, {x:0, y:0}];
	
	var prev = {x:this.x, y:this.y}, next;
	var moved = false;

	switch (which) {
		case 'w':
			if (!maze.outOfBounds(this.x + deltas[0].x, this.y + deltas[0].y) && 
				!maze.horizontalWalls[this.x + wallDeltas[0].x][this.y + wallDeltas[0].y]) {
				this.x += deltas[0].x;
				this.y += deltas[0].y;
				console.log("moved up");
				moved = true;
			}
			break;
		case 'a':
			if (!maze.outOfBounds(this.x + deltas[1].x, this.y + deltas[1].y) && 
				!maze.verticalWalls[this.x + wallDeltas[1].x][this.y + wallDeltas[1].y]) {
				this.x += deltas[1].x;
				this.y += deltas[1].y;
				console.log("moved left");
				moved = true;
			}
			break;
		case 's':
			if (!maze.outOfBounds(this.x + deltas[2].x, this.y + deltas[2].y) && 
				!maze.horizontalWalls[this.x + wallDeltas[2].x][this.y + wallDeltas[2].y]) {
				this.x += deltas[2].x;
				this.y += deltas[2].y;
				console.log("moved down");
				moved = true;
			}
			break;
		case 'd':
			if (!maze.outOfBounds(this.x + deltas[3].x, this.y + deltas[3].y) && 
				!maze.verticalWalls[this.x + wallDeltas[3].x][this.y + wallDeltas[3].y]) {
				this.x += deltas[3].x;
				this.y += deltas[3].y;
				console.log("moved right");
				moved = true;
			}
			break;
	}

	// if a successful move was made, update player sprite location
	if (moved) {
		next = {x:this.x, y:this.y};
		console.log(next, maze.goal);
		
		// reach goal
		var end = false;
		if (next.x == maze.goal.x && next.y == maze.goal.y) {
			end = true;

			// remove check keypress so that player cannot move
			window.removeEventListener("keypress", checkKeypress);

			// remove end flag
			// tentative method is just to clear the innerHTML
			getCell("display", 2*maze.goal.x, 2*maze.goal.y).innerHTML = "";

		}
		this.draw(prev, next);

		// this has to be after drawing the player sprite so that the player sprite updates first
		// the other half has to be before drawing the player sprite, 
		// because the method of removing the end flag is to wipe the innerHTML
		if (end) {
			// tentative congratulatory message
			alert("Complete!");
		}
	}
}

Player.prototype.draw = function(prev, next) {
	// step 1: delete existing player sprite (if it exists)
	if (prev != next) {
		var element = get("player");
		element.parentNode.removeChild(element);
	}
	// step 2: re-insert the player
	var cell = getCell("display", 2*next.x, 2*next.y);
	cell.appendChild(this.HTMLsprite);
}

// ------
// Keypress check
// ------

function checkKeypress(e) {
	if (e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd')
		player.move(e.key);
}

// global variables
var player, maze, display;

window.onload = function() {

	maze = new Maze(20, 40);

	// starting coords defined in maze
	player = new Player(maze.start.x, maze.start.y);

	display = new Display(maze);
	display.generateHTML();
	display.buildWalls();
	display.loadEndImage();

	var start = {x:0, y:0};
	player.draw(start, start);

	window.addEventListener("keypress", checkKeypress);

};