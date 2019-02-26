// var myNotification = new Notification('Hello!');

var t = "\t";
var div_taq = document.getElementById("div-taq");
var art_con = document.getElementById("art-con");
var cot_el = document.getElementById("inp-cod");
var gen_el = document.getElementById("but-gen");
var clr_con_el = document.getElementById("but-clr-con");

clr_con_el.addEventListener("click", function () {
	art_con.innerHTML = "";
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
Array.prototype.shuffle = function () {
	return this.map((e, i) => {
		let r = random(this.length);
		this[i] = this[r];
		this[r] = e;
	});
};
