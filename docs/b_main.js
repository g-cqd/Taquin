class Taquin {
	constructor(environment, previous = undefined, move = undefined) {
		this.environment = environment;
		this.previous = previous;
		if (previous == undefined) {
			this.sequence = this.magic(1);
			this.path = "_";
			this.g = 1;
		} else {
			this.sequence = previous.sequence.slice();
			this.moveTile(move);
			this.path = this.previous.path + move;
			this.g = this.previous.g + 1;
		}
		this.identity = this.environment.number;
		this.environment.number = this.identity + 1;
		this.inv = this.inversions();
		this.moves = this.findMoves();
		this.man = this.manhattan();
		this.disorder = this.disorderRate();
		this.h = this.man + this.disorder;
		this.f = this.h + this.g;
	}
	inversions()
	{
		let seq = this.sequence;
		let inv = 0;
		let length = this.environment.sizes[1];
		for (let i of range(length)) {
			for (let j of range(i+1,length)) {
				inv += (Number.isInteger(seq[i]) && Number.isInteger(seq[j]) && seq[i] > seq[j]) ? 1 : 0;
			}
		}
		return inv;
	}
	coordinates(content = 0) {
		let width = this.environment.sizes[0];
		if (content instanceof Object) {
			return (width * content[1]) + content[0];
		} else {
			let index = this.sequence.indexOf(content);
			let y = Math.ceil((index + 1) / width) - 1;
			let x = index - (y * width);
			return [x, y];
		}
	}
	findMoves() {
		let width = this.environment.sizes[0];
		let bound = width - 1;
		let coords = this.coordinates();
		let lastMove = this.path[this.path.length - 1];
		let moves = [];
		if (coords[0] != 0 && lastMove != 'l') { moves.push('r'); }
		if (coords[0] != bound && lastMove != 'r') { moves.push('l'); }
		if (coords[1] != 0 && lastMove != 'u') { moves.push('d'); }
		if (coords[1] != bound && lastMove != 'd') { moves.push('u'); }
		return moves;
	}
	moveTile(previous,move) {
		let sequence = this.sequence.slice();
		let width = this.environment.sizes[0];
		let x = this.coordinates(this.coordinates());
		let y;
		if (move == 'r') { y = x - 1; }
		if (move == 'l') { y = x + 1; }
		if (move == 'd') { y = x - width; }
		if (move == 'u') { y = x + width; }
		sequence[x] = sequence[y];
		sequence[y] = 0;
		this.sequence = sequence;
	}
	valid() {
		let width = this.environment.sizes[0];
		let inv = this.inversions();
		let row = (this.coordinates())[1] +1;
		return (((width % 2 == 1) && (inv % 2 == 0)) || ((width % 2 == 0) && ((row % 2 == 1) == (inv % 2 == 0)))) ? true : false;
	}
	weightings() {
		let weightings = [];
		let width = this.environment.sizes[0];
		let length = this.environment.sizes[1] - 1;
		for (let index of range(1,7)) {
			let pi = [];
			let rho = (index % 2 != 0) ? 4 : 1;
			switch (index) {
				case 1:
					pi = [36, 12, 12, 4, 1, 1, 4, 1];
					break;
				case 2:
				case 3:
					for (let i of range(length)) {
						pi.push(length - i);
					}
					break;
				case 4:
				case 5:
					pi = new Array(length).fill(0);
					let weight = length;
					for (let i of range(width-1)) {
						let j = 0;
						while (pi[j] != 0) { j++; }
						for (let k of range(width - i)) {
							pi[j] = weight--;
							j++;
						}
						pi[j] = weight--;
						j += width;
						while (j < length - 1) {
							pi[j] = weight--;
							j += width;
						}
					}
					break;
				case 6:
					pi = new Array(length).fill(1);
					break;
				default:
					break;
			}
			weightings.push([pi, rho]);
		}
		return weightings;
	}
	disorderRate() {
		let rate = 0;
		Array(this.sequence).forEach((e, i) => {
			rate += (e != 0 && e != (i + 1)) ? 1 : 0;
		});
		return rate;
	}
	manhattan() {
		let total = 0;
		let pos;
		let [width,length] = this.environment.sizes;
		let weightings = this.weightings();
		for (let weighting of weightings) {
			let distance = 0;
			for (let i of range(1,length)) {
				let j = 0;
				pos = this.coordinates(i);
				let x = i % width;
				let coords = [((x == 0) ? (width - 1) : (x - 1)), (Math.ceil(i / width) - 1)];
				distance += weighting[0][j] * (Math.abs(pos[0] - coords[0]) + Math.abs(pos[1] - coords[1]));
				j++;
			}
			distance /= weighting[1];
			total += distance;
		}
		return total;
	}
	magic(rand = 0) {
		let length = this.environment.sizes[1];
		let sequence = new Array(length).fill(0);
		for (let i of range(1,length)) {
			sequence[i - 1] = i;
		}
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
		this._number = 0;
		this._sizes = [width, width * width];
		this.start = new Taquin(this);
		this.explored = new Object();
	}
	get sizes() { return this._sizes; }
	get number() { return this._number; }
	set number(value) { this._number += value; }
	sortChildMoves(moves) {
		let length = moves.length;
		let result = [];
		while (result.length != length) {
			let minimum = moves[0];
			for (let move of moves) {
				if (move.f < minimum.f) {
					minimum = move;
				}
			}
			result.push(minimum);
			moves.splice(moves.indexOf(minimum),1);
		}
		return result;
	}
	expand() {
		let frontiere = [this.start];
		for (let i of range(frontiere.length)) {
			if (frontiere[i].disorder == 0) { return frontiere[i]; }
			else {
				let found = false;
				for (let j in this.explored) {
					if (this.explored[j] == frontiere[i].sequence) {
						found = true;
						break;
					}
				}
				if (!found) {
					let moves = frontiere[i].findMoves();
					let taquins = [];
					for (let move of moves) {
						let temp = new Taquin(this, frontiere[i], move);
						taquins.push(temp);
					}
					taquins = this.sortChildMoves(taquins);
					frontiere.join(taquins);
					this.explored[frontiere[i].path] = frontiere[i].sequence;
				}
			}
		}
	}
}
