let games = [];

const played = document.createEvent("Event");
played.initEvent("moved",true,true);

const controls = {
	width		: document.getElementById("input-width"),
	create		: document.getElementById("button-new"),
	expand		: document.getElementById("ex-pand"),
	increment	: document.getElementById("button-width-pp"),
	decrement	: document.getElementById("button-width-mm"),
	heuristics	: Array.from(document.querySelectorAll("[data-domain=heuristic]")),
	searches	: Array.from(document.querySelectorAll("[data-domain=search]"))
},
display = {
	taquin		: document.getElementById("taquin"),
	coups		: document.getElementById("coups"),
	manhattan	: document.getElementById("manhattan"),
	desordre	: document.getElementById("desordre"),
	inversions	: document.getElementById("inversions"),
	personals	: document.getElementById("self-moves"),
	solutions	: document.getElementById("opti-moves"),
	moves		: undefined
};



function random( min, max = undefined ) {
	return Math.floor(Math.random() * ((max == undefined ? min : max) - (max == undefined ? 0 : min)) + (max == undefined ? 0 : min));
}
Array.prototype.shuffle = function () {
	return this.map((e, i) => {
		let r = random(this.length);
		this[i] = this[r];
		this[r] = e;
	});
};
Array.prototype.last = function () {
	return this[this.length - 1];
};


function swipedetect(el, callback){
	var touchsurface = el,
	swipedir,
	startX,
	startY,
	distX,
	distY,
	threshold = 30,     // default : 150 => minimum distance
	restraint = 70,     // default : 100 => error distance
	allowedTime = 300,  // default : 300 => maximum time to move
	startTime,
	handleswipe = callback || function(swipedir){};
	touchsurface.addEventListener('touchstart', function(e) {
		var touchobj = e.changedTouches[0];
		swipedir = 'none';
		dist = 0;
		startX = touchobj.pageX;
		startY = touchobj.pageY;
		startTime = new Date().getTime();
		e.preventDefault();
	}, false);
	touchsurface.addEventListener('touchmove', function(e){
		e.preventDefault();
	}, false);
	touchsurface.addEventListener('touchend', function(e){
		var touchobj = e.changedTouches[0];
		distX = touchobj.pageX - startX ;
		distY = touchobj.pageY - startY ;
		elapsedTime = new Date().getTime() - startTime ;
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				swipedir = (distX < 0)? 'left' : 'right';
			}
			else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
				swipedir = (distY < 0)? 'up' : 'down';
			}
		}
		handleswipe(swipedir);
		e.preventDefault();
	}, false);
}
