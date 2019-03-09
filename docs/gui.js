// push a new environment in games List
function createEnvironment()
{
    games.push( new Environment( getWidth(), getHeuristics() ) );
}


// Get Computed Style of an Element
Element.prototype.getStyle = function( ...properties )
{
	let styles = {};
	if ( properties.length )
	{
		for ( let property of properties )
		{
			styles[property] = window.getComputedStyle( this ).getPropertyValue( property );
		}
	} else {
		for ( let property in window.getComputedStyle( this ) )
		{
			const value = window.getComputedStyle( this ).getPropertyValue( property );
			if ( value )
			{
				styles[property] = value;
			}
		}
	}
	return styles;
};


// Dispatch Play Event to an Element
Element.prototype.play = function()
{
	this.dispatchEvent( played );
};


// Display Taquin in e parameter/Element
Taquin.prototype.displayIn = function( e )
{
	const width = this.environment.sizes[0],
	g = document.createElement( "div" );
	g.classList.add( "game", `w-${width}` );
	for ( let value of this.sequence )
	{
		let c = document.createElement( "div" );
		if ( value == 0 )
		{
			c.classList.add( "case", "vide" );
		}
		else
		{
			c.classList.add( "case" );
		}
		c.setAttribute( 'style',`font-size:${
			( e.offsetWidth - parseInt( e.getStyle( "padding-left" )['padding-left'] ) * 2 ) / ( width * 2 )
			}px;` );
		c.innerHTML = value != 0 ? value : "";
		g.appendChild( c );
	}
	e.innerHTML = "";
	e.appendChild( g );
};

// Display Taquin informations
Taquin.prototype.informations = function( g=undefined, i=undefined, d=undefined, m=undefined )
{
	if ( !g ) { g = display.coups; }
	if ( !i ) { i = display.inversions; }
	if ( !m ) { m = display.manhattan; }
	if ( !d ) { d = display.desordre; }
	g.innerHTML = this.g;
	i.innerHTML = parseInt( this.inv ).toString();
	m.innerHTML = parseInt( this.man ).toString();
	d.innerHTML = parseInt( this.dis ).toString();
};

// Display solutions moves
function expandIn( e ) {
	e.innerHTML = "";
	let solutions = games.last().end.last().traceroute();
	solutions = solutions.slice(games.last().moves.last().g);
	Array.from(solutions).forEach( (solution,index) => {
		let block = document.createElement("div"),
		idBlock = document.createElement("div"),
		nameBlock = document.createElement("div"),
		infoBlock = document.createElement("div"),
		taquinBlock = document.createElement("div");
		block.classList.add("moveBlock");
		idBlock.classList.add("idBlock");
		nameBlock.classList.add("nameBlock");
		infoBlock.classList.add("infoBlock");
		taquinBlock.classList.add("taquinBlock");
		let identifiant = index.toString(),
		moveName,
		manhattan = solution.man.toString(),
		desordre = solution.dis.toString(),
		inversions = solution.inv.toString();
		if (solution.g > 0) {
		switch (solution.path.slice(-1)) {
			case "L":
				moveName = "Gauche";
				break;
			case "R":
				moveName = "Droite";
				break;
			case "U":
				moveName = "Haut";
				break;
			case "D":
				moveName = "Bas";
				break;
			default:
				break;
		}
		} else {
			moveName = "Racine";
		}
		idBlock.innerHTML = identifiant;
		nameBlock.innerHTML = moveName;
		infoBlock.innerHTML += `<div class="dataBlock"><span class="datas">${manhattan}</span><span class="title">manhattan</span></div>`;
		infoBlock.innerHTML += `<div class="dataBlock"><span class="datas">${desordre}</span><span class="title">désordre</span></div>`;
		infoBlock.innerHTML += `<div class="dataBlock"><span class="datas">${inversions}</span><span class="title">inversions</span></div>`;
		solution.displayIn(taquinBlock);
		block.appendChild(idBlock);
		block.appendChild(nameBlock);
		block.appendChild(infoBlock);
		block.appendChild(taquinBlock);
		e.appendChild(block);
	} );
}


Array.from( document.getElementsByClassName("toggler") ).forEach( ( e ) => {
	e.addEventListener( "click", () => {
		e.classList.toggle( "active" );
	}, false );
} );


const getWidth = () => {
	let width = parseInt( controls.width.value );
	width = ( width < 3 ) ? 3 : ( ( width > 10 ) ? 10 : width );
	controls.width.value = width;
	return width;
},
getHeuristics = () => {
	let heuristics = [];
	for ( let element of controls.heuristics )
	{
		if ( element.checked )
		{
			heuristics.push( parseInt( element.value ) );
		}
	}
	return heuristics;
},
getSearch = () => {
	for ( let element of controls.searches )
	{
		if ( element.checked )
		{
			return element.value;
		}
	}
};


// Create Width Button EventListener
controls.create.addEventListener( "click", function ()
{
	document.body.classList.remove( "win" );
	createEnvironment( getWidth(), getHeuristics() );
	display.taquin.play();
}, false );


// Increment Width Button EventListener
controls.increment.addEventListener("click", function ()
{
	if ( controls.width.value < 10 )
	{
		controls.width.value++;
	}
	controls.create.click();
	display.taquin.play();
}, false );


// Decrement Width Button EventListener
controls.decrement.addEventListener("click", function ()
{
	if ( controls.width.value > 3 )
	{
		controls.width.value--;
	}
	controls.create.click();
	display.taquin.play();
}, false );


// Expand Button EventListener
controls.expand.addEventListener("click", function()
{
	if ( games.last().sizes[0] <= 6 )
	{
		let env = games.last();
		env.weightings = getHeuristics();
		env.expand( getSearch() );
		expandIn( display.solutions );
	}
}, false );


// Update Taquin EventListener
display.taquin.addEventListener( "moved", function()
{
	let taquin = games.last().moves.last()
	taquin.displayIn( display.taquin );
	taquin.informations();
}, false );


// Swipe Listening Function
swipedetect( display.taquin, function( direction )
{
	if ( !( document.body.classList.contains( "win" ) ) )
	{
		let move;
		switch ( direction )
		{
			case "left":
				move = games.last().moves.last().findMoves( true ).includes( "L" ) ? "L" : undefined;
				break;
			case "up":
				move = games.last().moves.last().findMoves( true ).includes( "U" ) ? "U" : undefined;
				break;
			case "right":
				move = games.last().moves.last().findMoves( true ).includes( "R" ) ? "R" : undefined;
				break;
			case "down":
				move = games.last().moves.last().findMoves( true ).includes( "D" ) ? "D" : undefined;
				break;
			default:
				return;
		}
		if ( move )
		{
			games.last().play( move );
		}
	}
} );


// Keydown EventListener
document.onkeydown = function handlekeydown( e )
{
	if ( !( document.body.classList.contains( "win" ) ) )
	{
		let move;
		switch ( e.keyCode )
		{
			case 13: // Enter
				e.preventDefault();
				controls.create.click();
				break;
			case 37: // Left
				e.preventDefault();
				move = games.last().moves.last().findMoves( true ).includes( "L" ) ? "L" : undefined;
				break;
			case 38: // Up
				e.preventDefault();
				move = games.last().moves.last().findMoves( true ).includes( "U" ) ? "U" : undefined;
				break;
			case 39: // Right
				e.preventDefault();
				move = games.last().moves.last().findMoves( true ).includes( "R" ) ? "R" : undefined;
				break;
			case 40: // Down
				e.preventDefault();
				move = games.last().moves.last().findMoves( true ).includes( "D" ) ? "D" : undefined;
				break;
			default:
				return;
		}
		if ( move )
		{
			games.last().play( move );
		}
	}
};


// Window Onload Taquin Generation
window.onload = function ()
{
	controls.create.click();
};
