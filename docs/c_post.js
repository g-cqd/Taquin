Taquin.prototype.translate = function () {
	var sizes = [div_taq.offsetWidth, div_taq.offsetHeight];
	var plateau = document.createElement("div");
	plateau.classList.add("plateau");
	for (var item of this.sequence) {
		var element = document.createElement("div");
		if (item == 0) {
			element.classList.add("case", "vide");
		} else {
			element.classList.add("case");
		}
		element.setAttribute("style", `height:${(sizes[1] - 40) / this.environment.sizes[0]}px;width:${(sizes[0] - 40) / this.environment.sizes[0]}px;font-size:${((sizes[1] - 40) / this.environment.sizes[0]) * 0.5}px;`);
		element.innerHTML = item != 0 ? item : "";
		plateau.appendChild(element);
	}
	div_taq.innerHTML = "";
	div_taq.appendChild(plateau);
}

function __log__(element = "") {
	el = document.createElement("pre");
	el.append(element + '\n');
	art_con.appendChild(el);
}
function newLine(str, element, end = 0) {
	str += element + (end == 0 ? '\n' : '');
	return str;
}
cust_click = new Event("click");
gen_el.addEventListener("click", function () {
	clr_con_el.dispatchEvent(cust_click);
	var a = new Environment(parseInt(cot_el.value));
	a.start.translate();
	a.expand();
	var affichage = "";
	affichage = newLine(affichage, `Environment:`, 0);
	affichage = newLine(affichage, `- Sizes:${t}${a.sizes[0]} / ${a.sizes[1]}`, 0);
	affichage = newLine(affichage, "", 0);
	affichage = newLine(affichage, `Start Taquin:`, 0);
	affichage = newLine(affichage, `- Sequence:${t}${a.start.sequence}`,0);
	affichage = newLine(affichage, `- Validity: ${t}${a.start.valid()}`,0);
	affichage = newLine(affichage, `- Inversions:${t}${a.start.inversions()}`,0);
	affichage = newLine(affichage, `- Moves: ${t}${a.start.findMoves()}`,0);
	affichage = newLine(affichage, `- Distance:${t}${a.start.manhattan()}`, 1);
	console.log(a.end);
//	affichage = newLine(affichage, `- Resultat:${t}${b}`, 1);
	__log__(affichage);
}, false);
