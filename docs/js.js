// var myNotification = new Notification('Hello!');

div_res	=	document.getElementById("div-res");
div_taq	=	document.getElementById("div-taq");
art_con	=	document.getElementById("art-con");
cot_el	=	document.getElementById("inp-cod");
gen_el	=	document.getElementById("but-gen");
clr_res_el	=	document.getElementById("but-clr-res");
clr_con_el	=	document.getElementById("but-clr-con");

clr_res_el.addEventListener("click", function () {
	div_res.innerHTML = "";
}, false);
clr_con_el.addEventListener("click", function () {
	art_con.innerHTML = "";
}, false);


function __rand__(max,min=0) {
	return Math.floor( min + (max+1-min) * Math.random() );
}
Array.prototype.__shuffle__ = function (firsts)
{
	if (!firsts) {
		firsts = this.length;
	}
	if(firsts > 1) {
		var i = __rand__(firsts-1);
		var tmp = this[i];
		this[i] = this[firsts-1];
		this[firsts-1] = tmp;
		this.__shuffle__(firsts-1);
	}
};

class Environment {
	constructor(width) {
		this._number = 0;
		this.sizes = [width, width * width];
		this.start = new Taquin(this);
	}
	get getSizes() {
		return this.sizes;
	}

	get number() {
		return this.getNumber();
	}

	getNumber() {
		return this._number;
	}

}

class Taquin {
	constructor(environment, previous = undefined, move = undefined) {
		this.environment = environment;
		this.identity = this.environment.number();
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
			var z = (this.environment.getSizes())[1];
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
		var sizes = (this.environment.getSizes());
		for (var i = 0; i < sizes[1]; i++) {
			if (sequence[i] == content) {
				return (Math.ceil((i + 1) / sizes[0]));
			}
		}
	}
	__moves__() {
		var width = (this.environment.getSizes())[0];
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
		var width = (this.environment.getSizes())[0];
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
		var sizes = (this.environment.getSizes());
		var x = this.__invr__();
		var y = (this.__rowc__()) - 1;
		return ((((sizes[0] % 2 == 1) && (x % 2 == 0)) || ((sizes[0] % 2 == 0) && ((y[0] % 2 == 1) == (x % 2 == 0))))) ? true : false;
	}
	manhattan(index = undefined) {
		var sequence = this.sequence;
		var width = (this.environment.getSizes())[0];
		var length = (this.environment.getSizes())[1];
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
		var length = (this.environment.getSizes())[1];
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
	translate(sequence = 0) {
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


function __log__(element) {
	el = document.createElement("div");
	el.append(element);
	art_con.appendChild(el);
}
function __res__(element) {
	a = document.createElement("div");
	b = document.createElement("p");
	b.append(element);
	a.appendChild(b);
	div_res.appendChild(a);
}
function __add__(a,b) {
	c = [];
	if (a.length == b.length) {
		for (let i = 0; i < a.length ; i++) {
			c[i] = a[i]+b[i];
		}
	}
	return c;
}
function __sub__(a,b) {
	c = [];
	if (a.length == b.length) {
		for (let i = 0; i < a.length ; i++) {
			c[i] = a[i]-b[i];
		}
	}
	return c;
}
function __eq__(a,b) {
	if (a.length == b.length) {
		for (let i = 0; i < a.length ; i++) {
			if (a[i] != b[i]) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}
function __pr__(a) {
	return a instanceof Taquin ? a.sequence : false;
}

gen_el.addEventListener("click", function () {
	var a = new Environment(3);
}, false);
