class Taquin {
	constructor( environment, previous = undefined, move = undefined ) {
		this.environment = environment;
		this.previous = previous;
		this.inv = undefined;
		this.dis = undefined;
		this.man = undefined;
		this.h = undefined;
		if ( previous == undefined ) {
			this.path = "";
			this.g = 0;
			this.sequence = this.magic( 1 );
		} else {
			this.path = previous.path + move;
			this.g = this.previous.g + 1;
			this.sequence = previous.sequence.slice();
			this.moveTile( move );
			[this.inv,this.dis,this.man,this.h] = this.details();
		}
		this.moves = this.findMoves();
		this.f = this.h + this.g;
	}
	coordinates( content = 0 ) {
		let width = this.environment.sizes[0];
		if ( content instanceof Object ) {
			return ( width * content[1] ) + content[0];
		} else {
			let index = this.sequence.indexOf( content );
			let y = Math.ceil( ( index + 1 ) / width ) - 1;
			let x = index - ( y * width );
			return [x, y];
		}
	}
	details() {
		let [width,length] = this.environment.sizes,
		weightings = this.environment.weightings,
		seq = this.sequence,
		inv = 0,
		dis = 0,
		man = 0,
		h = 0;
		for ( let weighting of weightings ) {
			let k = 0,
			stepH = 0;
			for ( let i = 0 ; i < length ; i++ ) {
				let stepMan = 0;
				if ( weighting == weightings[0] ) {
					for ( let j = i+1 ; j < length ; j++ ) {
						if ( seq[i] != 0 && seq[j] != 0 && seq[i] > seq[j] ) {
							inv++;
						}
					}
					if ( seq[i] != 0 && seq[i] != ( i + 1 ) ) {
						dis++;
					}
				}
				if ( i > 0 ) {
					let pos = this.coordinates( i ),
					x = i % width,
					coords = [( ( x == 0 ) ? ( width - 1 ) : ( x - 1 ) ), ( Math.ceil( i / width ) - 1 )];
					stepMan += ( Math.abs( pos[0] - coords[0] ) + Math.abs( pos[1] - coords[1] ) );
					if ( weighting == weightings[0] ) {
						man += stepMan;
					}
					stepH += weighting[0][k] * stepMan;
					k++;
				}
			}
			if ( weighting[2] == 7 ) {
				stepH += dis;
			}
			stepH = parseInt(stepH / weighting[1]);
			h += stepH;
		}
		h = parseInt( h / weightings.length );
		return [inv,dis,man,h];
	}
	findMoves( flex = false ) {
		let limit = this.environment.sizes[0] - 1;
		let coords = this.coordinates();
		let last = this.path[this.g];
		let moves = [];
		if ( coords[0] != 0 && ( last != 'L' || flex ) ) { moves.push( 'R' ); }
		if ( coords[0] != limit && ( last != 'R' || flex ) ) { moves.push( 'L' ); }
		if ( coords[1] != 0 && ( last != 'U' || flex ) ) { moves.push( 'D' ); }
		if ( coords[1] != limit && ( last != 'D' || flex ) ) { moves.push( 'U' ); }
		return moves;
	}
	moveTile( move ) {
		let seq = this.sequence,
		width = this.environment.sizes[0],
		x = this.coordinates( this.coordinates() ),
		y;
		if ( move == 'R' ) { y = x - 1; }
		if ( move == 'L' ) { y = x + 1; }
		if ( move == 'D' ) { y = x - width; }
		if ( move == 'U' ) { y = x + width; }
		seq[x] = seq[y];
		seq[y] = 0;
	}
	valid() {
		let width = this.environment.sizes[0];
		[this.inv,this.dis,this.man,this.h] = this.details();
		let row = Math.abs( this.coordinates()[1] - width );
		return ( ( width % 2 == 1 ) && ( this.inv % 2 == 0 ) ) || ( ( width % 2 == 0 ) && ( ( row % 2 == 1 ) == ( this.inv % 2 == 0 ) ) ) ? true : false;
	}
	children() {
		let childList = [];
		for ( let move of this.moves ) {
			let child = new Taquin( this.environment, this, move );
			if ( child.dis == 0 ) {
				return child;
			}
			let i = 0;
			for (i; i < childList.length; i++) {
				if (child.f < childList[i].f) {
					break;
				}
			}
			childList.splice(i,0,child);
		}
		return childList;
	}
	magic( rand = 0 ) {
		let length = this.environment.sizes[1],
		seq = new Array( length ).fill(0);
		for ( let i = 1 ; i < length ; i++ ) {
			seq[i-1] = i;
		}
		if ( rand == 1 ) {
			do {
				seq.shuffle();
				this.sequence = seq;
			} while ( !this.valid() );
		}
		return seq;
	}
	traceroute() {
		let path = [this];
		while ( path[0].previous instanceof Taquin ) {
			path.unshift( path[0].previous );
		}
		return path;
	}
}

class Environment {
	constructor( width, choices = undefined ) {
		this.createdTaquins = 0;
		this._sizes = [width, width * width];
		this.choices = choices;
		this._weightings = this.getWeightings( choices );
		this.moves = [new Taquin( this )];
		this.end = [];
	}
	get sizes() { return this._sizes; }
	getWeightings( choices ) {
		let width = this.sizes[0],
		length = this.sizes[1] - 1;
		if ( choices == undefined ) {
			choices = [5];
		}
		let weightings = [],
		weight = length;
		for ( let index of choices ) {
			let rho = index % 2 != 0 ? 4 : 1;
			let pi = new Array(length).fill(0);
			switch (index) {
				case 1:
					if ( width == 3 ) {
						pi = [36, 12, 12, 4, 1, 1, 4, 1];
					} else {
						for ( let y = 0 ; y < width ; y++ ) {
							for ( let x = 0 ; x < width ; x++ ) {
								if ( x == y == width-1 ) {
									continue;
								} else {
									if ( x == y == 0 ) {
										pi[0] = width * ( width * 3 );
										x++;
									}
									if ( y == 0 ) {
										while ( x < width ) {
											pi[x++] = width * 3;
										}
									} else {
										if ( x == 0 ) {
											pi[y*width] = width * 2;
										} else {
											pi[y*width+x] = width - y;
										}
									}
								}
							}
						}
					}
					break;
				case 2:
				case 3:
					pi = Array.from( Array( length ), (_e,i) => ( length+1 ) - ( i+1 ) );
					break;
				case 4:
				case 5:
					for (let i = 0; i < ( width - 1 ) ; i++ ) {
						let j = 0;
						while ( pi[j] != 0 ) {
							j++;
						}
						for ( let k = 0 ; k < ( width - i ) ; k++ ) {
							pi[j++] = weight--;
						}
						j += i;
						pi[j] = weight--;
						j += width;
						while ( j < length - 1 ) {
							pi[j] = weight--;
							j += width;
						}
					}
					break;
				case 6:
					pi = Array( length ).fill( 1 );
					rho = 1 / ((width - 3) + 1);
					break;
				case 7:
					break;
				case 8:
					let mid = Math.floor(length/2);
					for (let i = 0; i < mid ; i++) {
						pi[i] = mid - i;
					}
					if (length % 2 == 1) {
						pi[mid] = length;
						mid++;
					}
					for (let i = mid; i < length; i++) {
						pi[i] = i+1;
					}
					rho = 2.5;
					break;
				case 9:
					rho = 2;
					let j = 1;
					for (let i = 0; i < length; i++) {
						pi[i] = Math.abs(Math.floor(length/2) - (Math.floor((j-1)/2)));
						if (i < length-1) {
							i++;
							pi[i] = Math.abs(Math.floor(length/2) - (Math.floor((j-1)/2)));
						}
						j++;
					}
					if (length % 2 == 1) {
						pi[length-1] = 1;
					}
					pi.shuffle();
					break;
				default:
					break;
			}
			weightings.push( [pi,rho,index] );
		}
		return weightings;
	}
	get weightings() { return this._weightings; }
	set weightings( choices ) { this._weightings = this.getWeightings( choices ); }
	correct() {
		for ( let move of this.moves ) {
			[move.inv,move.dis,move.man,move.h] = move.details();
			move.f = move.g + move.h;
			move.moves = move.findMoves( true );
		}
	}
	inArray(taquin,array) {
		for (let element of array) {
			if (element.sequence == taquin.sequence) {
				return true;
			}
		}
		return false;
	}
	aStar() {

		let explored = new Map();
		let queue = new Map();
		queue.set(this.moves.last().f,[this.moves.last()]);

		while (true) {
			let k = Array.from( queue.keys() )[0];
			let kArray = queue.get( k );
			let shouldBeExpanded = kArray.shift();

			explored.set(shouldBeExpanded.sequence.toString(),shouldBeExpanded);

			if ( kArray.length == 0 ) {
				queue.delete(k);
			} else {
				queue.set( k, kArray );
			}

			let children = shouldBeExpanded.children();
			if (children instanceof Taquin) {
				this.end.push(children);
				return this.end.last();
			} else {
				for (let child of children) {
					let sequenceString = child.sequence.toString();
					if (explored.has(sequenceString)) {
						if (explored.get(sequenceString).f < child.f) {
							children.splice(children.indexOf(child),1);
						} else {
							explored.delete(sequenceString);
						}
					} else if (queue.has(child.f)) {
						let cArray = queue.get(child.f);
						cArray.push(child);
						queue.set(child.f,cArray);
					} else {
						queue.set(child.f,[child]);
					}
				}
			}
			let sortedArray = Array.from(queue.keys());
			sortedArray.sort((a,b)=>a-b);
			let secondaryQueue = new Map();
			for (let key of sortedArray) {
				secondaryQueue.set(key,queue.get(key));
				queue.delete(key);
			}
			queue = secondaryQueue;
		}
	}

	idaStar() {
		let root = this.moves.last();
		let bound = root.h;
		let path = [root];
		function search(path,g,bound) {
			let node = path.last();
			let f = g + node.h;
			if (f > bound) { return f; }
			let minimum = Infinity;
			let children = node.children();
			if (children instanceof Taquin) {
				path.push(children);
				return children;
			} else {
				for (let child of node.children()) {
					if (!child.environment.inArray(child,path)) {
						path.push(child);
						let t = search(path,g+1,bound);
						if (t instanceof Taquin) {return t;}
						if (t < minimum) { minimum = t;}
						path.pop();
					}
				}
			}
			return minimum;
		}
		while (true) {
			let t = search(path,0,bound);
			if (t instanceof Taquin) {
				this.end.push(t);
				return t;
			}
			if (t == Infinity) {return false;}
			bound = t;
		}
	}

	hal() {
		let root = this.moves.last(),
		list = [root],
		explored = [];
		for (let n of list) {
			let children = n.children();
			if (children instanceof Taquin) {
				this.end.push(children);
				return children;
			}
			else {
				for (let i = children.length-1; i >= 0; i--) {
					if (!this.inArray(children[i],explored)) {
						list.unshift(children.pop());
					} else {
						children.pop();
					}
				}
			}
			let i = 0;
			for (i; i < explored.length; i++) {
				if (n.f < explored[i].f) {
					break;
				}
			}
			explored.splice(i,0,n);
			list.splice(list.indexOf(n),1);
		}
		return false;
	}

	expand( func ) {
		this.correct();
		return this[func]();
	}
	play(move) {
		lastTaquin = this.moves.last(),
		newTaquin = new Taquin(this,lastTaquin,move);
		newTaquin.moves = newTaquin.findMoves(true);
		this.moves.push(newTaquin);
		display.taquin.play();
		if (this.moves.last().dis == 0) {
			document.body.classList.toggle("win");
		}
	}
}
