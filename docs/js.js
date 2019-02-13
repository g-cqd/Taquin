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

class Taquin {
	constructor(cote) {
		this.cote = cote;
		this.taille = cote*cote;
		this.sequence = null;
		this.solution = this.generate();
	}
	generate() {
		var number_sequence = new Array(this.taille);
		for (var i = 0; i < number_sequence.length-1; i++) {
			number_sequence[i] = i+1;
		}
		number_sequence[-1] = null;
		this.sequence = number_sequence;
		this.sequence.__shuffle__();
		while (!this.solvable()) {
			this.sequence.__shuffle__();
		}
		return number_sequence;
	}
	translate(sequence=0) {
		var sizes = [div_taq.offsetWidth,div_taq.offsetHeight];
		var plateau = document.createElement("div");
		plateau.classList.add("plateau");
		for (var item of this.sequence) {
			var element = document.createElement("div");
			if (item == null) {
				element.classList.add("case","vide");
			} else {
				element.classList.add("case");
			}
			element.setAttribute("style",`height:${(sizes[1]-40)/this.cote}px;width:${(sizes[0]-40)/this.cote}px;font-size:${((sizes[1]-40)/this.cote)*0.5}px;`);
			element.innerHTML = item!=null?item:"";
			plateau.appendChild(element);
		}
		div_taq.innerHTML="";
		div_taq.appendChild(plateau);
	}

	__row__() {
		if ((this.taille % this.cote) == 0) {
			var index = 0;
			for (var i = 0; i < this.taille; i++) {
				if (this.sequence[i] == null) {
					index = i;
					break;
				}
			}
			var tr_index = this.taille - (index + 1);
			for (var j = 1; j <= this.cote; j++) {
				if (tr_index < (j * this.cote)) {
					return j;
				}
			}
		}
	}
	__inv__() {
		var inversions = 0;
		for (var i = 0; i < this.taille; i++) {
			if (this.sequence[i] != null) {
				for (var j = i + 1; j < this.taille; j++) {
					if (this.sequence[i] > this.sequence[j] && this.sequence[j] != null) {
						inversions++;
					}
				}
			}
		}
		return inversions;
	}

	solvable() {
		if ( ((this.cote%2==1) && (this.__inv__()%2==0)) || ( (this.cote%2==0) && ( (this.__row__()%2==1) == (this.__inv__()%2==0) ) ) ) {
			return true;
		} else {
			return false;
		}
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
	cote = parseInt(cot_el.value);
	taquin = new Taquin(cote);
	taquin.translate();
	__res__(__pr__(taquin));
	__log__((taquin.__inv__()));
	__log__(taquin.solvable() ? "solvable" : "non solvable");
}, false);
