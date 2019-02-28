class Taquin {
    constructor(environment, previous=undefined, move=undefined) {
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
    inversions() {
        let sequence = this.sequence;
        let inv = 0;
        let length = this.environment.sizes[1];
        for (let i of range(length)) {
            for (let j of range(i + 1, length)) {
                inv += (sequence[i] != 0 && sequence[j] != 0 && sequence[i] > sequence[j]) ? 1 : 0;
            }
        }
        return inv;
    }
    coordinates(content=0) {
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
    findMoves(flex=false) {
        let limit = this.environment.sizes[0] - 1;
        let coords = this.coordinates();
        let last = this.path[this.path.length - 1];
        let moves = [];
        if (coords[0] != 0 && (last != 'l' || flex)) {
            moves.push('r');
        }
        if (coords[0] != limit && (last != 'r' || flex)) {
            moves.push('l');
        }
        if (coords[1] != 0 && (last != 'u' || flex)) {
            moves.push('d');
        }
        if (coords[1] != limit && (last != 'd' || flex)) {
            moves.push('u');
        }
        return moves;
    }
    moveTile(move) {
        let sequence = this.sequence.slice();
        let width = this.environment.sizes[0];
        let x = this.coordinates(this.coordinates());
        let y;
        if (move == 'r') {
            y = x - 1;
        }
        if (move == 'l') {
            y = x + 1;
        }
        if (move == 'd') {
            y = x - width;
        }
        if (move == 'u') {
            y = x + width;
        }
        sequence[x] = sequence[y];
        sequence[y] = 0;
        this.sequence = sequence;
    }
    valid() {
        let width = this.environment.sizes[0];
        let inv = this.inversions();
        let row = (this.coordinates())[1] + 1;
        return (((width % 2 == 1) && (inv % 2 == 0)) || ((width % 2 == 0) && ((row % 2 == 1) == (inv % 2 == 0)))) ? true : false;
    }
    disorderRate() {
        let sequence = this.sequence;
        let rate = 0;
        let length = this.environment.sizes[1];
        for (let i of range(length)) {
            if (sequence[i] != 0 && sequence[i] != i+1) {
                rate += 1;   
            }
        }
        return rate;
    }
    manhattan() {
        let total = 0;
        let[width,length] = this.environment.sizes;
        let weightings = this.environment.weightings;

        for (let weighting of weightings) {
            let distance = 0;
            let j = 0;
            for (let i of range(1, length)) {
                let pos = this.coordinates(i);
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
    childs() {
        let childList = [];
        for (let move of this.moves) {
            let child = new Taquin(this.environment,this,move);
            if (child.disorder == 0) { return child; }
            childList.push(child);
        }
        return childList;
    }
    magic(rand=0) {
        let length = this.environment.sizes[1];
        let sequence = new Array(length).fill(0);
        for (let i of range(1, length)) {
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
        this._weightings = this.getWeightings();
		this.start = new Taquin(this);
		this.moves = [];
		this.current = this.start;
        this.end = undefined;
    }
    get sizes() {
        return this._sizes;
    }
    get number() {
        return this._number;
    }
    set number(value) {
        this._number += value;
	}
	getWeightings() {
        let weightings = [];
        let width = this.sizes[0];
        let length = this.sizes[1] - 1;
        for (let index of range(1, 7)) {
            let pi = [];
            let rho = (index % 2 != 0) ? 4 : 1;
            switch (index) {
            case 1:
                if (width == 3) {
                    pi = [36, 12, 12, 4, 1, 1, 4, 1];
                } else {
                    pi = [undefined];
                }
                break;
            case 2:
            case 3:
                for (let i of range(length)) {
                    pi.push(length - i);
                }
                break;
            case 4:
			case 5:
				if (width == 3) {
                pi = new Array(length).fill(0);
                let weight = length;
                for (let i of range(width - 1)) {
                    let j = 0;
                    while (pi[j] != 0) {
                        j++;
                    }
                    for (let k of range(width - i)) {
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
                }} else { pi = [undefined]; }
                break;
            case 6:
                pi = new Array(length).fill(1);
                break;
            default:
                break;
            }
            if (pi != [undefined]) {
                weightings.push([pi, rho]);
            }
        }
        return weightings;
	}
	get weightings() {
		return this._weightings;
	}
    expand() {
        let root = this.start;
        let explored = [root];
        let final = false;
        while (!final) {
            let shouldBeExpanded = explored[0];
            for (let taquin of explored) {
                if (shouldBeExpanded.f > taquin.f) {
                    shouldBeExpanded = taquin;
                }
            }
			let newChilds = shouldBeExpanded.childs();
			if (newChilds instanceof Taquin) {
			    this.end = newChilds;
			    return newChilds;
			}
            explored.push(...newChilds);
            explored.splice(explored.indexOf(shouldBeExpanded),1);
        }
	}
	play(move) {
		let previous = this.moves.length < 1 ? this.start : this.current;
		this.current = new Taquin(this,previous,move);
		this.moves.push([move,this.current]);
        display_taquin.dispatchEvent(played);
        if (this.current.disorderRate()==0) {
            document.body.classList.toggle("win");
        }
	}
}
