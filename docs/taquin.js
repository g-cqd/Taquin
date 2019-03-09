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
		if ( content instanceof Object ) { return ( width * content[1] ) + content[0]; }
		else {
			let index = this.sequence.indexOf( content );
			let y = Math.ceil( ( index + 1 ) / width ) - 1;
			let x = index - ( y * width );
			return [x, y];
		}
	}
	details() {
		let [width,length] = this.environment.sizes,
		weightings = this.environment.weightings,
		sequence = this.sequence,
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
						if ( sequence[i] != 0 && sequence[j] != 0 && sequence[i] > sequence[j] ) { inv++; }
					}
					if ( sequence[i] != 0 && sequence[i] != ( i + 1 ) ) { dis++; }
				}
				if ( i > 0 ) {
					let pos = this.coordinates( i ),
					x = i % width,
					coords = [( ( x == 0 ) ? ( width - 1 ) : ( x - 1 ) ), ( Math.ceil( i / width ) - 1 )];
					stepMan += ( Math.abs( pos[0] - coords[0] ) + Math.abs( pos[1] - coords[1] ) );
					if ( weighting == weightings[0] ) { man += stepMan; }
					stepH += weighting[0][k] * stepMan;
					k++;
				}
			}
			stepH /= weighting[1];
			if ( weighting[2] == 7 ) { h += dis; }
			else { h += stepH; }
		}
		return [inv,dis,man,h];
	}
	findMoves( flex = false ) {
		let limit = this.environment.sizes[0] - 1;
		let coords = this.coordinates();
		let last = this.path[this.path.length - 1];
		let moves = [];
		if ( coords[0] != 0 && ( last != 'L' || flex ) ) { moves.push( 'R' ); }
		if ( coords[0] != limit && ( last != 'R' || flex ) ) { moves.push( 'L' ); }
		if ( coords[1] != 0 && ( last != 'U' || flex ) ) { moves.push( 'D' ); }
		if ( coords[1] != limit && ( last != 'D' || flex ) ) { moves.push( 'U' ); }
		return moves;
	}
	moveTile( move ) {
		let sequence = this.sequence;
		let width = this.environment.sizes[0];
		let x = this.coordinates( this.coordinates() );
		let y;
		if ( move == 'R' ) { y = x - 1; }
		if ( move == 'L' ) { y = x + 1; }
		if ( move == 'D' ) { y = x - width; }
		if ( move == 'U' ) { y = x + width; }
		sequence[x] = sequence[y];
		sequence[y] = 0;
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
			if ( child.h == 0 ) { return child; }
			childList.push( child );
		}
		return childList;
	}
	magic( rand = 0 ) {
		let length = this.environment.sizes[1],
		sequence = new Array( length ).fill(0);
		for ( let i = 1 ; i < length ; i++ ) { sequence[i-1] = i; }
		if ( rand == 1 ) {
			do {
				sequence.shuffle();
				this.sequence = sequence;
			} while ( !this.valid() );
		}
		return sequence;
	}
	traceroute() {
		let path = [this];
		while ( path[0].previous instanceof Taquin ) { path.unshift( path[0].previous ); }
		return path;
	}
}

class Environment {
	constructor( width, choices = undefined ) {
		this._sizes = [width, width * width];
		this._weightings = this.getWeightings( choices );
		this.moves = [new Taquin( this )];
		this.end = [];
	}
	get sizes() { return this._sizes; }
	getWeightings( choices ) {
		const width = this.sizes[0],
		length = this.sizes[1] - 1;
		if ( !choices ) { choices = [5]; }
		let weightings = [],
		weight = length;
		for ( let index of choices ) {
			const rho = index % 2 != 0 ? 4 : 1;
			let pi = new Array(length).fill(0);
			switch (index) {
				case 1:
					if ( width == 3 ) { pi = [36, 12, 12, 4, 1, 1, 4, 1]; }
					break;
				case 2:
				case 3:
					pi = Array.from( Array( length ), (_e,i) => ( length+1 ) - ( i+1 ) );
					break;
				case 4:
				case 5:
					for (let i = 0; i < ( width - 1 ) ; i++ ) {
						let j = 0;
						while ( pi[j] != 0 ) { j++; }
						for ( let k = 0; k < ( width - i ); k++ ) { pi[j++] = weight--; }
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
	rocky() {
		const startTime = Date.now();
		let queue = new Map();
		queue.set(this.moves.last().f,[this.moves.last()]);
		while (true) {
			let k = Array.from( queue.keys() )[0];
			let kArray = queue.get( k );
			let shouldBeExpanded = kArray.shift();
			if ( kArray.length == 0 ) { queue.delete(k); }
			else { queue.set( k, kArray ); }
			const children = shouldBeExpanded.children();
			if (children instanceof Taquin) {
				const end = Date.now() - startTime;
				this.end.push(children);
				return children;
			}
			else {
				for (let child of children) {
					if (queue.has(child.f)) {
						let cArray = queue.get(child.f);
						cArray.push(child);
						queue.set(child.f,cArray);
					}
					else {
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
	charlotte() {
		const startTime = Date.now();
		let queue = new Map();
		queue.set(this.moves.last().f,[this.moves.last()]);
		while (true) {
			let k = Array.from(queue.keys())[0];
			let kArray = queue.get(k);
			let shouldBeExpanded = kArray.shift();
			if (kArray.length == 0) { queue.delete(k); }
			else { queue.set(k,kArray); }
			const children = shouldBeExpanded.children();
			if (children instanceof Taquin) {
				const end = Date.now() - startTime;
				this.end.push(children);
				return children;
			}
			else {
				for (let child of children) {
					if (queue.has(child.f)) {
						let cArray = queue.get(child.f);
						cArray.push(child);
						queue.set(child.f,cArray);
					}
					else { queue.set(child.f,[child]); }
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
	expand( func ) {
		this.correct();
		return this[func]();
	}
	play(move) {
		let lastTaquin = this.moves.last();
		this.moves.push(new Taquin(this,lastTaquin,move));
		display.taquin.play();
		if (this.moves.last().h==0) {
			document.body.classList.toggle("win");
		}
	}
}
