function newEnvironment(value) {
    listEnvironment.push(new Environment(value));
}

Taquin.prototype.translate = function () {
	var sizes = [display_taquin.offsetWidth, display_taquin.offsetHeight];
	var display_game = document.createElement("div");
	display_game.classList.add("plateau");
	for (var item of this.sequence) {
		var element = document.createElement("div");
		if (item == 0) {
			element.classList.add("case", "vide");
		} else {
			element.classList.add("case");
		}
		element.setAttribute("style", `height:${(sizes[1] - 40) / this.environment.sizes[0]}px;width:${(sizes[0] - 40) / this.environment.sizes[0]}px;font-size:${((sizes[1] - 40) / this.environment.sizes[0]) * 0.5}px;`);
		element.innerHTML = item != 0 ? item : "";
		display_game.appendChild(element);
	}
	display_taquin.innerHTML = "";
	display_taquin.appendChild(display_game);
	button_clear.click();

	let currentEnv = listEnvironment.last();
	let currentTaquin = currentEnv.current;

	val_coups.innerHTML = currentTaquin.g;
	val_manha.innerHTML = parseInt(currentTaquin.man).toString();
	val_disor.innerHTML = parseInt(currentTaquin.disorder).toString();
	val_inver.innerHTML = parseInt(currentTaquin.inv).toString();
};


var togglers = document.getElementsByClassName("toggler");
for (var toggler of togglers) {
	toggler.addEventListener("click", () => {
		toggler.classList.toggle("active");
	}, false);
}




button_generate.addEventListener("click", function () {
	button_clear.click();
	newEnvironment(parseInt(input_width.value));
	display_taquin.dispatchEvent(played);
	if (document.body.classList.contains("win")) {
		document.body.classList.toggle("win");
	}
}, false);


width_pp.addEventListener("click", function () {
	input_width.value++;
	newEnvironment(parseInt(input_width.value));
	display_taquin.dispatchEvent(played);
}, false);
width_mm.addEventListener("click", function () {
	input_width.value--;
	newEnvironment(parseInt(input_width.value));
	display_taquin.dispatchEvent(played);
}, false);
/*
button_expand.addEventListener("click", function() {
	listEnvironment.last().expand();
});*/
display_taquin.addEventListener("moved", function() {
	let currentEnv = listEnvironment.last();
	currentEnv.current.translate();
},false);



swipedetect(display_taquin, function(swipedir) {
    let currentEnv = listEnvironment.last();
	if (currentEnv.current.disorderRate() != 0) {
		let move;
		switch (swipedir)
		{
			case "left": // left
				if (currentEnv.current.findMoves(true).includes("l")) {
					move = "l";
				}
				break;
			case "up": // up
				if (currentEnv.current.findMoves(true).includes("u")) {
					move = "u";
				}
				break;
			case "right": // right
				if (currentEnv.current.findMoves(true).includes("r")) {
					move = "r";
				}
				break;
			case "down": // down
				if (currentEnv.current.findMoves(true).includes("d")) {
					move = "d";
				}
				break;
			default:
				return;
		}
		if (move) { currentEnv.play(move); }
	}
});


document.onkeydown = function handlekeydown(e) {
	let currentEnv = listEnvironment.last();
	if (currentEnv.current.disorderRate() != 0) {
		let key = e.keyCode;
		let move;
		switch (key) {
			case 37: // left
				if (currentEnv.current.findMoves(true).includes("l")) {
					move = "l";
				}
				break;
			case 38: // up
				if (currentEnv.current.findMoves(true).includes("u")) {
					move = "u";
				}
				break;
			case 39: // right
				if (currentEnv.current.findMoves(true).includes("r")) {
					move = "r";
				}
				break;
			case 40: // down
				if (currentEnv.current.findMoves(true).includes("d")) {
					move = "d";
				}
				break;
			default:
				return;
		}
		if (move) { currentEnv.play(move); }
	}
};

window.onload = function () {
	button_generate.click();
};