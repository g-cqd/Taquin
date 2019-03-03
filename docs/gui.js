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

	let currentEnv = listEnvironment.last();
	let currentTaquin = currentEnv.current;

	val_coups.innerHTML = currentTaquin.g;
	val_manha.innerHTML = parseInt(currentTaquin.man).toString();
	val_inver.innerHTML = parseInt(currentTaquin.inv).toString();
};


var togglers = document.getElementsByClassName("toggler");
for (var toggler of togglers) {
	toggler.addEventListener("click", () => {
		toggler.classList.toggle("active");
	}, false);
}




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
	listEnvironment.last().expand();
	console.log(listEnvironment.last().end);
});
display_taquin.addEventListener("moved", function() {
	let currentEnv = listEnvironment.last();
	currentEnv.current.translate();
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
