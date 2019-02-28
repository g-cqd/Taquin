// var myNotification = new Notification('Hello!');


var listEnvironment = [];

var played = document.createEvent("Event");
played.initEvent("moved",true,true);

t = "\t";

var display_taquin = document.getElementById("div-taq");
var display_console = document.getElementById("art-con");
var input_width = document.getElementById("inp-cod");
var button_generate = document.getElementById("but-gen");
var button_clear_console = document.getElementById("but-clr-con");
var banner_winner = document.getElementById("banner-winner");

button_clear_console.addEventListener("click", function () {
	display_console.innerHTML = "";
}, false);


function random(min, max = undefined) {
	return Math.floor(Math.random() * ((max == undefined ? min : max) - (max == undefined ? 0 : min)) + (max == undefined ? 0 : min));
}
function range(start, stop = undefined, step = undefined) {
	let a = [];
	let b;
	for (
		b = (stop == undefined ? 0 : start);
		b < (stop == undefined ? start : stop);
		b += (step == undefined ? 1 : step)
		) {
			a.push(b);
		}
		return a;
}


if (!Array.prototype.shuffle) {
	Array.prototype.shuffle = function () {
		return this.map((e, i) => {
			let r = random(this.length);
			this[i] = this[r];
			this[r] = e;
		});
	};
}

if (!Array.prototype.last) {
	Array.prototype.last = function () {
		return this[this.length - 1];
	};
}