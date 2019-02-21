// var myNotification = new Notification('Hello!');

var t = "\t";
var div_taq	= document.getElementById("div-taq");
var art_con	= document.getElementById("art-con");
var cot_el	= document.getElementById("inp-cod");
var gen_el	= document.getElementById("but-gen");
var clr_con_el	= document.getElementById("but-clr-con");

clr_con_el.addEventListener("click", function () {
	art_con.innerHTML = "";
}, false);


function __rand__(max,min=0) { return Math.floor( min + (max+1-min) * Math.random() ); }
Array.prototype.__shuffle__ = function (length) {
	if (!length) { length = this.length; }
	if (length > 1) {
		var i = __rand__(length-1);
		var tmp = this[i];
		this[i] = this[length-1];
		this[length-1] = tmp;
		this.__shuffle__(length-1);
	}
};

class Environment {
	constructor(width) {
		this._size = 0;
		this._sizes = [width, width * width];
		this.start = new Taquin(this);
	}
	get sizes() {
		return this._sizes;
	}
	get size() {
		return this._size;
	}
	set size(value) {
		this._size += value;
	}
}

class Taquin {
	constructor(environment, previous = undefined, move = undefined) {
		this.environment = environment;
		this.id = this.environment.size;
		this.environment.size = this.id + 1;
		this.sequence = undefined;
		this.previous = previous;
		if (previous == undefined) {
			this.sequence = this.magic(1);
			this.path = "";
			this.distance = 0;
		}
		else {
			if ((previous instanceof Taquin) && (move instanceof String)) {
				this.sequence = this.move(move);
				this.path = this.previous.path + move;
				this.distance = this.previous.distance + 1;
			}
		}
	}
	__invr__() {
		if (this.sequence.length) {
			var x = this.sequence;
			var y = 0;
			var z = this.environment.sizes[1];
			for (var i = 0; i < z; i++) {
				for (var j = i + 1; j < z; j++) {
					y += (Number.isInteger(x[i]) && Number.isInteger(x[j]) && x[i] > x[j]) ? 1 : 0;
				}
			}
			return y;
		} else {
			return false;
		}
	}
	__rowc__(content = undefined) {
		var sequence = this.sequence;
		var sizes = this.environment.sizes;
		for (var i = 0; i < sizes[1]; i++) {
			if (sequence[i] == content) {
				return (Math.ceil((i + 1) / sizes[0]));
			}
		}
	}
	__moves__() {
		var width = this.environment.sizes[0];
		var x = this.__rowc__() - 1;
		var y = this.sequence.indexOf(undefined) - (x * width);
		var bound = width - 1;
		var moves = [];
		if (y != bound) { moves.push('right'); }
		if (y != 0) { moves.push('left'); }
		if (x != bound) { moves.push('up'); }
		if (x != 0) { moves.push('down'); }
		return moves;
	}
	__move__(move) {
		var sequence = this.sequence;
		var width = this.environment.sizes[0];
		var x = sequence.indexOf(undefined);
		var y;
		if (move == 'right') { y = x - 1; }
		if (move == 'left') { y = x + 1; }
		if (move == 'up') { y = x - width; }
		if (move == 'down') { y = x + width; }
		sequence[x] = sequence[y];
		sequence[y] = undefined;
		this.sequence = sequence;
		return sequence;
	}
	__test__() {
		var sizes = this.environment.sizes;
		var x = this.__invr__();
		var y = (this.__rowc__()) - 1;
		return ((((sizes[0] % 2 == 1) && (x % 2 == 0)) || ((sizes[0] % 2 == 0) && ((y[0] % 2 == 1) == (x % 2 == 0))))) ? true : false;
	}
	manhattan(index = undefined) {
		var sequence = this.sequence;
		var width = this.environment.sizes[0];
		var length = this.environment.sizes[1];
		var distance = 0;
		if (index == undefined) {
			for (var i = 0; i < length; i++) {
				var e = sequence[i];
				if (e != index) {
					var x = this.__rowc__(e) - 1;
					var y = i - (x * width);
					var pos = [x, y];
					var v = Math.ceil(e / width) - 1;
					var w = (e - 1) - (v * width);
					var inipos = [v, w];
					distance += Math.abs(pos[0] - inipos[0]) + Math.abs(pos[1] - inipos[1]);
				}
			}
		} else {
			for (var i = 0; i < length; i++) {
				var e = sequence[i];
				if (e == index) {
					var x = this.__rowc__(e) - 1;
					var y = i - (x * width);
					var pos = [x, y];
					var v = Math.ceil(e / width) - 1;
					var w = (e - 1) - (v * width);
					var inipos = [v, w];
					distance = Math.abs(pos[0] - inipos[0]) + Math.abs(pos[1] - inipos[1]);
				}
			}
		}
		return distance;
	}
	magic(rand = 0) {
		var length = this.environment.sizes[1];
		var sequence = new Array(length);
		for (var i = 1; i < length; i++) {
			sequence[i - 1] = i;
		}
		if (rand == 1) {
			do {
				sequence.__shuffle__();
				this.sequence = sequence;
			} while (!this.__test__());
		}
		return sequence;
	}
	translate() {
		var sizes = [div_taq.offsetWidth,div_taq.offsetHeight];
		var plateau = document.createElement("div");
		plateau.classList.add("plateau");
		for (var item of this.sequence) {
			var element = document.createElement("div");
			if (item == undefined) {
				element.classList.add("case","vide");
			} else {
				element.classList.add("case");
			}
			element.setAttribute("style", `height:${(sizes[1] - 40) / this.environment.sizes[0]}px;width:${(sizes[0] - 40) / this.environment.sizes[0]}px;font-size:${((sizes[1]-40)/this.environment.sizes[0])*0.5}px;`);
			element.innerHTML = item!=null?item:"";
			plateau.appendChild(element);
		}
		div_taq.innerHTML="";
		div_taq.appendChild(plateau);
	}
}


function __log__(element="") {
	el = document.createElement("pre");
	el.append(element+'\n');
	art_con.appendChild(el);
}
function newLine(str,element,end=0) {
	str += element + (end==0?'\n':'');
	return str;
}
cust_click = new Event("click");
gen_el.addEventListener("click", function () {
	clr_con_el.dispatchEvent(cust_click);
	var a = new Environment(cot_el.value);
	a.start.translate();
	var affichage = "";
	affichage = newLine(affichage,`Environment:`,0);
	affichage = newLine(affichage,`- Sizes:${t}${a.sizes[0]} / ${a.sizes[1]}`,0);
	affichage = newLine(affichage,"",0);
	affichage = newLine(affichage,`Start Taquin:`,0);
	affichage = newLine(affichage,`- Sequence:${t}${a.start.sequence}`,0);
	affichage = newLine(affichage,`- Validity: ${t}${a.start.__test__()}`,0);
	affichage = newLine(affichage,`- Inversions:${t}${a.start.__invr__()}`,0);
	affichage = newLine(affichage,`- Moves: ${t}${a.start.__moves__()}`,0);
	affichage = newLine(affichage,`- Distance:${t}${a.start.manhattan()}`,1);
	__log__(affichage);
}, false);
