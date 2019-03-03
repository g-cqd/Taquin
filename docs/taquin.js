function extend(l,cs) {
	while(cs[0]) {
		var c = cs.shift(),
		i = 0,
		j = 0;
		if (l[0]) {
			while (j < l.length) {
				if (c.f > l[i].f) { i++; }
				if (l[i] != undefined && c.f == l[i].f) {
					if (c.inv > l[i].inv) { i++; }
				}
				j++;
			}
		}
		l.splice(i,0,c);
	}
}

class Taquin {
	constructor(environment, previous=undefined, move=undefined) {
		this.environment = environment;
		this.previous = previous;
		if (previous == undefined) {
			this.sequence = this.magic(1);
			this.move = "_";
			this.g = 0;
		} else {
			this.sequence = previous.sequence.slice();
			this.moveTile(move);
			this.move = move;
			this.g = this.previous.g + 1;
		}
		this.inv = this.inversions();
		this.moves = this.findMoves();
		this.man = this.manhattan();
		this.h = this.man;
		this.f = this.h + this.g;
	}
	inversions() {
		let sequence = this.sequence;
		let inv = 0;
		let length = this.environment.sizes[1];
		for (let i = 0; i < length ; i++ ) {
			for (let j = i+1 ; j < length ; j++ ) {
				if (sequence[i] != 0 && sequence[j] != 0 && sequence[i] > sequence[j]) { inv++; }
			}
		}
		return inv;
	}
	coordinates(content=0) {
		let width = this.environment.sizes[0];
		if (content instanceof Object) {
			return width * content[1] + content[0];
		} else {
			let index = this.sequence.indexOf(content);
			let y = Math.ceil((index + 1) / width) - 1;
			let x = index - (y * width);
			return [x, y];
		}
	}
	findMoves(flex=false) {
		let limit = this.environment.sizes[0] - 1;
		let coords = this.coordinates();
		let last = this.move;
		let moves = [];
		if (coords[0] != 0 && (last != 'l' || flex)) { moves.push('r'); }
		if (coords[0] != limit && (last != 'r' || flex)) { moves.push('l'); }
		if (coords[1] != 0 && (last != 'u' || flex)) { moves.push('d'); }
		if (coords[1] != limit && (last != 'd' || flex)) { moves.push('u'); }
		return moves;
	}
	moveTile(move) {
		let sequence = this.sequence;
		let width = this.environment.sizes[0];
		let x = this.coordinates(this.coordinates());
		let y;
		if (move == 'r') { y = x - 1; }
		if (move == 'l') { y = x + 1; }
		if (move == 'd') { y = x - width; }
		if (move == 'u') { y = x + width; }
		sequence[x] = sequence[y];
		sequence[y] = 0;
	}
	valid() {
		let width = this.environment.sizes[0];
		let inv = this.inversions();
		let row = Math.abs((this.coordinates())[1] - width);
		return ((width % 2 == 1) && (inv % 2 == 0)) || ((width % 2 == 0) && ((row % 2 == 1) == (inv % 2 == 0))) ? true : false;
	}
	manhattan() {
		let total = 0;
		let [width,length] = this.environment.sizes;
		let weightings = this.environment.weightings;
		for (let weighting of weightings) {
			let distance = 0;
			let j = 0;
			for (let i = 1; i < length ; i++ ) {
				let pos = this.coordinates(i);
				let x = i % width;
				let coords = [((x == 0) ? (width - 1) : (x - 1)), (Math.ceil(i / width) - 1)];
				distance += weighting[0][j] * (Math.abs(pos[0] - coords[0]) + Math.abs(pos[1] - coords[1]));
				j++;
			}
			total += distance;
		}
		return total;
	}
	childs() {
		let childList = [];
		for (let move of this.moves) {
			let childArray = [new Taquin(this.environment,this,move)];
			if (childArray[0].h == 0) { return childArray[0]; }
			extend(childList,childArray);
		}
		return childList;
	}
	magic(rand=0) {
		let length = this.environment.sizes[1];
		let sequence = new Array(length).fill(0);
		for (let i = 1; i < length; i++ ) { sequence[i - 1] = i; }
		if (rand == 1) {
			do {
				sequence.shuffle();
				this.sequence = sequence;
			} while (!this.valid());
		}
		return sequence;
	}
}

class Environment {
	constructor(width) {
		this._sizes = [width, width * width];
		this._weightings = this.getWeightings();
		this.start = new Taquin(this);
		this.moves = [];
		this.current = this.start;
		this.end = undefined;
	}
	get sizes() {
		return this._sizes;
	}
	getWeightings() {
		let weightings = [];
		let width = this.sizes[0];
		let length = this.sizes[1] - 1;
		let pi = new Array(length).fill(0);
		let weight = length;
		for (let i = 0; i < (width - 1) ; i++ ) {
			let j = 0;
			while (pi[j] != 0) { j++; }
			for (let k = 0; k < (width - i); k++ ) {
				pi[j] = weight--;
				j++;
			}
			j += i;
			pi[j] = weight--;
			j += width;
			while (j < length - 1) {
				pi[j] = weight--;
				j += width;
			}
		}
		weightings.push([pi, 1]);
		return weightings;
	}
	get weightings() {
		return this._weightings;
	}
	expand() {
		let pipe = [this.current];
		while (!this.end) {
			let shouldBeExpanded = pipe.shift();
			let children = shouldBeExpanded.childs();
			if (children instanceof Taquin) {
				this.end = children;
				return children;
			} else {
				extend(pipe,children);
			}
		}
	}
	play(move) {
		let previous = this.moves.length < 1 ? this.start : this.current;
		this.current = new Taquin(this,previous,move);
		this.moves.push([move,this.current]);
		display_taquin.dispatchEvent(played);
		if (this.current.h==0) {
			document.body.classList.toggle("win");
		}
	}
}
