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
  
    touchsurface.addEventListener('touchstart', function(e){
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