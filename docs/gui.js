const newEnvironment = (value) => {
    listEnvironment.push(new Environment(value));
};
const max = (...elements) => {
	let max = elements[0];
	for (const element of elements) { if (element >= max) {max = element;} }
	return max;
};
Element.prototype.getStyle = function (...properties) {
	let styles = {};
	if (properties.length) {
		for (let property of properties) {
			styles[property] = window.getComputedStyle(this).getPropertyValue(property);
		}
	} else {
		for (let property in window.getComputedStyle(this)) {
			const value = window.getComputedStyle(this).getPropertyValue(property);
			if (value) { styles[property] = value; }
		}
	}
	return styles;
};

Taquin.prototype.translate = function (e) {
	const environmentSizes = {
		width:this.environment.sizes[0],
		length:this.environment.sizes[1]
	},
	computedSizes = {
		width:e.offsetWidth,
		height:e.offsetHeight
	},
	g = document.createElement("div"),
	gap = 10,
	rawPadding = e.getStyle("padding-top","padding-right","padding-bottom","padding-left"),
	paddings = [];
	for (let property in rawPadding) { paddings.push(rawPadding[property]); }
	paddings.map( (element,index) => { paddings[index] = parseInt(element.replace(/px/g,'')); });
	const padding = {
		height:(paddings[0]+paddings[2]),
		width:(paddings[1]+paddings[3])
	};

	g.classList.add("game");
	for (let value of this.sequence) {
		let c = document.createElement("div");
		if (value==0) { c.classList.add("case","vide"); }
		else { c.classList.add("case"); }
		const factor = 1.6,
		height = Math.floor((computedSizes.height - (padding.height + gap)) / environmentSizes.width),
		width = Math.floor((computedSizes.width - (padding.width + gap)) / environmentSizes.width),
		fontSize = max(Math.ceil((height / (environmentSizes.width/factor))),12);
		c.setAttribute('style',`height:${height}px;width:${width}px;font-size:${fontSize}px;`);
		c.innerHTML = value != 0 ? value : "";
		g.appendChild(c);
	}
	e.innerHTML = "";
	e.appendChild(g);
};
Taquin.prototype.infos = function(g=val_coups,inv=val_inver,man=val_manha,dis=val_desor) {
	g.innerHTML = this.g;
	man.innerHTML = parseInt(this.man).toString();
	inv.innerHTML = parseInt(this.inv).toString();
	dis.innerHTML = parseInt(this.dis).toString();
};


let togglers = Array.from(document.getElementsByClassName("toggler"));
togglers.forEach( (toggler) => {
	toggler.addEventListener("click", () => {
		toggler.classList.toggle("active");
	}, false);
});




button_generate.addEventListener("click", function () {
	if (input_width.value < 3) { input_width.value = 3; }
	else if (input_width.value > 10) { input_width.value = 10; }
	newEnvironment(parseInt(input_width.value));
	display_taquin.dispatchEvent(played);
	document.body.classList.remove("win");
}, false);

width_pp.addEventListener("click", function () {
	if (input_width.value < 10) { input_width.value++; }
	button_generate.click();
	display_taquin.dispatchEvent(played);
}, false);
width_mm.addEventListener("click", function () {
	if (input_width.value > 3) { input_width.value--; }
	button_generate.click();
	display_taquin.dispatchEvent(played);
}, false);

button_expand.addEventListener("click", function() {
	if (listEnvironment.last().sizes[0] == 3) {
		listEnvironment.last().expand();
		console.log(listEnvironment.last().end);	
	}
});
display_taquin.addEventListener("moved", function() {
	let currentTaquin = listEnvironment.last().current;
	currentTaquin.translate(display_taquin);
	currentTaquin.infos();
},false);



swipedetect(display_taquin, function(direction) {
	if (!(document.body.classList.contains("win"))) {
		let move;
		switch (direction)
		{
			case "left":
				move = listEnvironment.last().current.findMoves(true).includes("l") ? "l" : undefined;
				break;
			case "up":
				move = listEnvironment.last().current.findMoves(true).includes("u") ? "u" : undefined;
				break;
			case "right":
				move = listEnvironment.last().current.findMoves(true).includes("r") ? "r" : undefined;
				break;
			case "down":
				move = listEnvironment.last().current.findMoves(true).includes("d") ? "d" : undefined;
				break;
			default:
				return;
		}
		if (move) { listEnvironment.last().play(move); }
	}
});
document.onkeydown = function handlekeydown(e) {
	if (!(document.body.classList.contains("win"))) {
		let move;
		switch (e.keyCode) {
			case 13:
				e.preventDefault();
				button_generate.click();
				break;
			case 37: // left
				e.preventDefault();
				move = listEnvironment.last().current.findMoves(true).includes("l") ? "l" : undefined;
				break;
			case 38: // up
				e.preventDefault();
				move = listEnvironment.last().current.findMoves(true).includes("u") ? "u" : undefined;
				break;
			case 39: // right
				e.preventDefault();
				move = listEnvironment.last().current.findMoves(true).includes("r") ? "r" : undefined;
				break;
			case 40: // down
				e.preventDefault();
				move = listEnvironment.last().current.findMoves(true).includes("d") ? "d" : undefined;
				break;
			default:
				return;
		}
		if (move) { listEnvironment.last().play(move); }
	}
};

window.onload = function () {
	button_generate.click();
};
