const createEnvironment = (width,heuristics) => {
	if ( heuristics == undefined ) { heuristics = [5]; }
    listEnvironment.push(new Environment(width,heuristics));
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
Element.prototype.play = function () {
	this.dispatchEvent(played);
};
Taquin.prototype.displayIn = function (e) {
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
		fontSize = Math.max(Math.ceil((height / (environmentSizes.width/factor))),12);
		c.setAttribute('style',`height:${height}px;width:${width}px;font-size:${fontSize}px;`);
		c.innerHTML = value != 0 ? value : "";
		g.appendChild(c);
	}
	e.innerHTML = "";
	e.appendChild(g);
};
Taquin.prototype.informations = function( g=undefined, i=undefined, d=undefined, m=undefined ) {
	if ( !g ) { g = settings.coups; }
	if ( !i ) { i = settings.inversions; }
	if ( !m ) { m = settings.manhattan; }
	if ( !d ) { d = settings.desordre; }
	g.innerHTML = this.g;
	i.innerHTML = parseInt( this.inv ).toString();
	m.innerHTML = parseInt( this.man ).toString();
	d.innerHTML = parseInt( this.dis ).toString();
};


Array.from( document.getElementsByClassName("toggler") ).forEach( ( el ) => {
	el.addEventListener( "click", () => {
		el.classList.toggle( "active" );
	}, false );
});


const getWidth = () => {
	let width = parseInt(settings.width.value);
	width = (width < 3) ? 3 : ( (width > 10) ? 10 : width );
	settings.width.value = width;
	return width;
},
getHeuristics = () => {
	let heuristics = [];
	for (let element of settings.heuristics) {
		if (element.checked) {
			heuristics.push(parseInt(element.value));
		}
	}
	return heuristics;
},
getSearch = () => {
	for (let element of settings.searches) {
		if (element.checked) {
			return element.value;
		}
	}
};


createButton.addEventListener("click", function () {
	createEnvironment( getWidth(), getHeuristics() );
	taquinElement.play();
	document.body.classList.remove("win");
}, false);
settings.increment.addEventListener("click", function () {
	if (settings.width.value < 10) { settings.width.value++; }
	createButton.click();
	taquinElement.play();
}, false);
settings.decrement.addEventListener("click", function () {
	if (settings.width.value > 3) { settings.width.value--; }
	createButton.click();
	taquinElement.play();
}, false);
expandButton.addEventListener("click", function() {
	if (listEnvironment.last().sizes[0] <= 4) {
		listEnvironment.last().weightings = getHeuristics();
		listEnvironment.last().expand(getSearch());
		console.log(listEnvironment.last().end);
	}
});
taquinElement.addEventListener("moved", function() {
	listEnvironment.last().current.displayIn(taquinElement);
	listEnvironment.last().current.informations();
},false);

swipedetect(taquinElement, function(direction) {
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
				createButton.click();
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
	createButton.click();
};
