function UFDS(size) {
	this.size = size;
	this.totalSets = size;
	this.parent = [];
	this.rank = [];
	for (var i=0; i<size; i++) {
		this.parent.push(i);
		this.rank.push(0);
	}
}

UFDS.prototype.findSet = function(node) {
	return (this.parent[node] == node) ? node : this.parent[node] = this.findSet(this.parent[node]);
}

UFDS.prototype.isSameSet = function(x, y) {
	return this.findSet(x) == this.findSet(y);
}

UFDS.prototype.unionSet = function(x, y) {
	x = this.findSet(x);
	y = this.findSet(y);
	if (x != y) {
		if (this.rank[x] < this.rank[y])
			[x, y] = [y, x];
		this.parent[y] = x;
		if (this.rank[x] == this.rank[y])
			this.rank[x]++;
		this.totalSets--;
	}
}