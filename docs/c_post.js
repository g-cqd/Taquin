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
	button_clear_console.dispatchEvent(cust_click);

	let currentEnv = listEnvironment.last();
	let currentTaquin = currentEnv.current;

	var affichage = "";
	affichage = newLine(affichage,`Taquin ${currentTaquin.identitiy}:`,0);
	affichage = newLine(affichage,`${t}- Path:${t}${currentTaquin.path}`,0);
	affichage = newLine(affichage,`${t}- g:${t}${currentTaquin.g}`,0);
	affichage = newLine(affichage,`${t}- Inversions:${t}${currentTaquin.inv}`,0);
	affichage = newLine(affichage,`${t}- Man:${t}${currentTaquin.man}`,0);
	affichage = newLine(affichage,`${t}- Disord.:${t}${currentTaquin.disorder}`,0);
	affichage = newLine(affichage,`${t}- h:${t}${currentTaquin.h}`,0);
	affichage = newLine(affichage,`${t}- f:${t}${currentTaquin.f}`,1);
	__log__(affichage);
};

function __log__(element = "") {
	el = document.createElement("pre");
	el.append(element + '\n');
	display_console.appendChild(el);
}
function newLine(str, element, end = 0) {
	str += element + (end == 0 ? '\n' : '');
	return str;
}
cust_click = new Event("click");
button_generate.addEventListener("click", function () {
	button_clear_console.dispatchEvent(cust_click);
	listEnvironment.push(new Environment(parseInt(input_width.value)));
	display_taquin.dispatchEvent(played);
	if (document.body.classList.contains("win")) {
		document.body.classList.toggle("win");
	}
}, false);

display_taquin.addEventListener("moved", function() {
	let currentEnv = listEnvironment.last();
	currentEnv.current.translate();
},false);

swipedetect(display_taquin, function(swipedir){
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


document.onkeydown = function handlekeydown(e)
{
	let currentEnv = listEnvironment.last();
	if (currentEnv.current.disorderRate() != 0) {
		let key = e.keyCode;
		let move;
		switch (key)
		{
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
