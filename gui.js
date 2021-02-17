import { DOM, MultiThread } from './aemijs/aemi.module.js';

const { addClass, ecs, hasClass, removeClass, toggleClass } = DOM;
const { ExtendedWorker } = MultiThread;


if ( !( 'TaquinEnvironment' in globalThis ) ) {
    globalThis.TaquinEnvironment = {
        init: false,
        /** @type {EnvironmentInterface} */
        vars: null,
        /** @type {ExtendedWorker} */
        worker: null,
        get blocked() {
            return this.vars && this.vars.promise;
        }
    };
}

/**
 * @returns {{
 *   init:Boolean,
 *   vars:EnvironmentInterface,
 *   worker:ExtendedWorker
 * }}
 */
function $() {
    return globalThis.TaquinEnvironment;
}

/**
 * @param {Element} element 
 * @returns {Boolean}
 */
function clearContent( element ) {
    return ( element.innerHTML = '', element.innerHTML === '' );
}

/**
 * @param {TaquinInterface|{
 *   g:Number,
 *   path:String,
 *   inv:Number,
 *   man:Number,
 *   dis:Number,
 *   sequence:Number[]
 * }} game
 * @returns {Promise<{
 *   g:Number,
 *   path:String,
 *   inv:Number,
 *   man:Number,
 *   dis:Number,
 *   sequence:Number[]
 * }>}
 */
async function getGameSpec( game ) {
    let g;
    let path;
    let inv;
    let man;
    let dis;
    let sequence;
    if ( game instanceof TaquinInterface ) {
        ( [g, path, inv, man, dis, sequence] = await Promise.all( [game.g, game.path, game.inv, game.man, game.dis, game.sequence] ) );
    }
    else {
        ( { g, path, inv, man, dis, sequence } = game );
    }

    return { g, path, inv, man, dis, sequence };
}

class TaquinInterface {
    /**
     * @param {EnvironmentInterface} env 
     */
    constructor ( env ) {
        this.__opt__ = {
            __env__: env
        };
    }
    /**
     * @returns {ExtendedWorker}
     */
    get worker() {
        if ( this.__opt__.__env__ instanceof EnvironmentInterface ) {
            if ( this.__opt__.__env__.worker instanceof ExtendedWorker ) {
                return this.__opt__.__env__.worker;
            }
            else {
                throw new TypeError( `No worker has been assigned to this environment. Please set up one before trying to get it.` );
            }
        }
        else {
            throw new TypeError( `No environment has been assigned to this environment. Please set up one before trying to get it.` );
        }
    }
    /**
     * 
     * @param {String} key 
     * @returns {Promise}
     */
    get( key ) {
        return this.worker.postMessage( {
            type: 'get',
            query: {
                object: 'taquin',
                property: key
            }
        } );
    }
    /**
     * @param {String} method
     * @param {...any} args
     * @returns {Promise}
     */
    call( method, ...args ) {
        return this.worker.postMessage( {
            type: 'get',
            query: {
                object: 'taquin',
                method,
                args
            }
        } );
    }
    /**
     * @returns {Promise<Number>}
     */
    get g() {
        return this.get( 'g' );
    }
    /**
     * @returns {Promise<Number>}
     */
    get inv() {
        return this.get( 'inv' );
    }
    /**
     * @returns {Promise<Number>}
     */
    get dis() {
        return this.get( 'dis' );
    }
    /**
     * @returns {Promise<Number>}
     */
    get man() {
        return this.get( 'man' );
    }
    /**
     * @returns {Promise<Number[]>}
     */
    get sequence() {
        return this.get( 'sequence' );
    }
    /**
     * @returns {Promise<String>}
     */
    get path() {
        return this.get( 'path' );
    }
    /**
     * @param {Boolean} flex 
     * @returns {Promise<Array<'L'|'D'|'U'|'R'>>}
     */
    findMoves( flex = false ) {
        return this.call( 'findMoves', flex );
    }
}

class EnvironmentInterface {
    /**
     * @param {ExtendedWorker} worker
     */
    constructor ( worker ) {
        this.__opt__ = {
            __game__: new TaquinInterface( this ),
            __worker__: worker
        };
        this.promise = undefined;
    }

    /**
     * @param {String} key 
     * @returns {Promise}
     */
    get( key ) {
        return this.worker.postMessage( {
            type: 'get',
            query: {
                object: 'environment',
                property: key
            }
        } );
    }
    /**
     * @param {String} property 
     * @param {any} value 
     * @returns {Promise}
     */
    set( property, value ) {
        return this.worker.postMessage( {
            type: 'set',
            query: {
                object: 'environment',
                property,
                value
            }
        } );
    }
    /**
     * @param {{width:Number,heuristics:Number[]}} options 
     * @returns {Promise}
     */
    new( options = {} ) {
        const { width, heuristics } = options;
        return this.worker.postMessage( {
            type: 'new',
            options: {
                width,
                heuristics
            }
        } );
    }
    /**
     * @param {String} method
     * @param {...any} args
     * @returns {Promise}
     */
    call( method, ...args ) {
        return this.worker.postMessage( {
            type: 'get',
            query: {
                object: 'environment',
                method,
                args
            }
        } );
    }

    get worker() {
        if ( this.__opt__.__worker__ instanceof ExtendedWorker ) {
            return this.__opt__.__worker__;
        }
        else {
            throw new TypeError( `No worker has been assigned to this environment. Please set up one before trying to get it.` );
        }
    }

    get game() {
        if ( this.__opt__.__game__ instanceof TaquinInterface ) {
            return this.__opt__.__game__;
        }
        else {
            throw new TypeError( `No TaquinInterface has been assigned to this environment. Please set up one before trying to get it.` );
        }
    }

    get sizes() {
        return this.get( 'sizes' );
    }

    get moves() {
        return this.get( 'moves' );
    }

    get heuristics() {
        return this.get( 'heuristics' );
    }

    get end() {
        return this.get( 'end' );
    }

    play( move ) {
        return this.call( 'play', move );
    }

    expand( algorithm, type = 'object' ) {
        return this.call( 'expand', algorithm, type );
    }
    /**
     * @param {Promise} promise 
     */
    save( promise ) {
        this.promise = promise;
    }
}

function createEnvironment() {
    const env = $();
    env.vars = new EnvironmentInterface( env.worker );
    env.init = true;
    globalThis.dispatchEvent( new Event( 'initialized' ) );
}

let controls;
let display;


/**
 * @callback callback
 * @param {'left'|'right'|'up'|'down'|'none'} direction
 */

/**
 * @param {Element} touchSurface 
 * @param {callback} handler 
 */
function swipedetect( touchSurface, handler = ( function () { } ) ) {
    const threshold = 30;     // default : 150 => minimum distance
    const restraint = 70;     // default : 100 => error distance
    const allowedTime = 300;  // default : 300 => maximum time to move
    let swipedir;
    let startX;
    let startY;
    let distX;
    let distY;
    let startTime;
    touchSurface.addEventListener( 'touchstart', event => {
        const touchobj = event.changedTouches[0];
        swipedir = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
        event.preventDefault();
    }, { passive: true } );
    touchSurface.addEventListener( 'touchmove', event => event.preventDefault(), { passive: true } );
    touchSurface.addEventListener( 'touchend', event => {
        const touchobj = event.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if ( elapsedTime <= allowedTime ) {
            if ( Math.abs( distX ) >= threshold && Math.abs( distY ) <= restraint ) {
                swipedir = ( distX < 0 ) ? 'left' : 'right';
            }
            else if ( Math.abs( distY ) >= threshold && Math.abs( distX ) <= restraint ) {
                swipedir = ( distY < 0 ) ? 'up' : 'down';
            }
        }
        handler( swipedir );
        event.preventDefault();
    }, { passive: true } );
}

/**
 * Get Computed Style of an Element
 * 
 * @param {Element} thisArg 
 * @param  {...any} properties 
 * @returns {{[String]:String}}
 */
function getElementStyle( thisArg, ...properties ) {
    const styles = {};
    if ( properties.length ) {
        for ( const property of properties ) {
            styles[property] = window.getComputedStyle( thisArg ).getPropertyValue( property );
        }
    } else {
        for ( const property in window.getComputedStyle( thisArg ) ) {
            const value = window.getComputedStyle( thisArg ).getPropertyValue( property );
            if ( value ) {
                styles[property] = value;
            }
        }
    }
    return styles;
}


// Dispatch Update Event to an Element
function requestUpdate() {
    globalThis.dispatchEvent( new Event( 'update' ) );
}

/**
 * Display Taquin in e parameter/Element
 * 
 * @param {Number[]} sequence
 * @param {Element} container
 * @returns {Promise<Element>}
 */
async function displaySequence( sequence, container ) {
    const { vars } = $();
    const [width] = await vars.sizes;
    return ecs( {
        class: ['game', `w-${width}`],
        _: sequence.map( value => ( {
            class: ['case', ...( value === 0 ? ['vide'] : [] )],
            style: {
                'fontSize': `${( container.offsetWidth - parseInt( getElementStyle( container, "padding-left" )['padding-left'] ) * 2 ) / ( width * 2 )}px`,
            },
            _: value !== 0 ? value : ''
        } ) )
    } );
}

/**
 * Display Taquin informations
 * 
 * @param {{g:Number,inv:Number,man:Number,dis:Number}} spec
 * @returns {Promise<void>}
 */
function displayInformations( spec ) {
    const { g, inv, man, dis } = spec;
    display.coups.innerHTML = g.toString();
    display.inversions.innerHTML = inv.toString();
    display.manhattan.innerHTML = man.toString();
    display.desordre.innerHTML = dis.toString();
}

/**
 * @param {{g:Number,path:String,inv:Number,man:Number,dis:Number,sequence:Number[]}} spec 
 * @param {Number} index 
 * @returns {Promise<Element>}
 */
async function moveBlock( spec ) {
    let moveName;
    let waySymbol;
    const {g, path, inv, man, dis, sequence} = spec;
    if ( g > 0 ) {
        switch ( path.slice( -1 ) ) {
            case "L":
                moveName = "Gauche";
                waySymbol = "&larr;";
                break;
            case "R":
                moveName = "Droite";
                waySymbol = "&rarr;";
                break;
            case "U":
                moveName = "Haut";
                waySymbol = "&uarr;";
                break;
            case "D":
                moveName = "Bas";
                waySymbol = "&darr;";
                break;
            default:
                break;
        }
    } else {
        moveName = "Racine";
        waySymbol = "";
    }

    const taquinBlock = ecs( { class: 'taquinBlock' } );
    taquinBlock.appendChild( await displaySequence( sequence, taquinBlock ) );

    return ecs( {
        class: 'moveBlock', _: [
            { class: 'idBlock', _: g.toString() },
            { class: 'nameBlock', _: moveName },
            { class: 'wayBlock', _: waySymbol },
            {
                class: 'infoBlock', _: [
                    {
                        class: 'dataBlock', _: [
                            { t: 'span', class: 'datas', _: man.toString() },
                            { t: 'span', class: 'title', _: 'manhattan' }
                        ]
                    },
                    {
                        class: 'dataBlock', _: [
                            { t: 'span', class: 'datas', _: dis.toString() },
                            { t: 'span', class: 'title', _: 'désordre' }
                        ]
                    },
                    {
                        class: 'dataBlock', _: [
                            { t: 'span', class: 'datas', _: inv.toString() },
                            { t: 'span', class: 'title', _: 'inversions' }
                        ]
                    }
                ]
            },
            taquinBlock
        ],
        events: [["click", e => toggleClass( e.target, 'active', true ), true]]
    } );
}

/**
 * @param {Element} element 
 * @param {{g:Number,path:String,inv:Number,man:Number,dis:Number,sequence:Number[]}} game 
 */
async function saveIn( element, game ) {
    element.appendChild( await moveBlock( game ) );
}

/**
 * Display solutions moves
 * @param {Element} taquinList 
 */
async function expandIn( tail, taquinList ) {
    clearContent( taquinList );
    const traceroute = [tail];
    while ( traceroute[0].previous !== undefined ) {
        traceroute.unshift( traceroute[0].previous );
    }
    return taquinList.append( ...( await Promise.all( [...traceroute].map( async step => await moveBlock( await getGameSpec( step ) ) ) ) ) );
}


[...document.getElementsByClassName( "toggler" )].forEach( e => {
    e.addEventListener( "click", () => {
        if ( $().blocked ) {
            return;
        }
        toggleClass( e, "active" );
    } );
} );


function getWidth() {
    let width = +controls.width.value;
    if ( width < 3 ) {
        width = 3;
    }
    if ( width > 4 ) {
        if ( getSearch() !== "idaStar" ) {
            controls.expand.disabled = true;
        }
        else if ( width > 5 ) {
            controls.expand.disabled = true;
        }
    } else {
        controls.expand.disabled = false;
    }
    if ( width > 10 ) {
        width = 10;
    }
    controls.width.value = width;
    return width;
}

function getHeuristics() {
    const heuristics = [];
    for ( const { checked, value } of controls.heuristics ) {
        if ( checked ) {
            heuristics.push( +value );
        }
    }
    return heuristics;
}
/**
 * @returns {'aStar'|'idaStar'|'hal'}
 */
function getSearch() {
    for ( const { checked, value } of controls.searches ) {
        if ( checked ) {
            return value;
        }
    }
}

function init() {
    function setUp() {
        controls = {
            get width() { return document.getElementById( "input-width" ); },
            get create() { return document.getElementById( "button-new" ); },
            get expand() { return document.getElementById( "ex-pand" ); },
            get increment() { return document.getElementById( "button-width-pp" ); },
            get decrement() { return document.getElementById( "button-width-mm" ); },
            get heuristics() { return [...document.querySelectorAll( "[data-domain=heuristic]" )]; },
            get searches() { return [...document.querySelectorAll( "[data-domain=search]" )]; }
        };
        display = {
            get taquin() { return document.getElementById( "taquin" ); },
            get coups() { return document.getElementById( "coups" ); },
            get manhattan() { return document.getElementById( "manhattan" ); },
            get desordre() { return document.getElementById( "desordre" ); },
            get inversions() { return document.getElementById( "inversions" ); },
            get personals() { return document.getElementById( "self-moves" ); },
            get solutions() { return document.getElementById( "opti-moves" ); },
        };
        createEnvironment();
    }
    if ( $().init === false ) {
        if ( document.readyState === 'complete' ) {
            setUp();
        }
        else {
            globalThis.addEventListener( 'load', setUp );
        }
    }
}


globalThis.addEventListener( 'worker-set', init );


globalThis.addEventListener( 'initialized', function () {

    // Update Taquin EventListener
    globalThis.addEventListener( 'update', async function () {
        const { vars } = $();
        const { game } = vars;
        const moves = await vars.moves;
        if ( moves.length === 1 ) {
            if ( !( clearContent( display.personals ) && clearContent( display.solutions ) ) ) {
                throw new Error();
            }
        }
        clearContent( display.taquin );
        const spec = await getGameSpec( game );
        display.taquin.appendChild( await displaySequence( spec.sequence, display.taquin ) );
        displayInformations( spec );
        await saveIn( display.personals, spec );

    } );

    // Create Width Button EventListener
    controls.create.addEventListener( 'click', async function () {
        if ( $().blocked ) {
            return;
        }
        removeClass( document.body, "win" );
        const { vars } = $();
        const new_env = await vars.new( { width: getWidth(), heuristics: getHeuristics() } );
        console.log( new_env );
        requestUpdate();
    } );


    // Increment Width Button EventListener
    controls.increment.addEventListener( 'click', function () {
        if ( $().blocked ) {
            return;
        }
        if ( controls.width.value < 10 ) {
            if ( controls.width.value > 3 ) {
                controls.searches[0].disabled = true; controls.searches[0].checled = false;
                controls.searches[1].checked = true;
            }
            controls.width.value++;
        }
        controls.create.click();
    } );


    // Decrement Width Button EventListener
    controls.decrement.addEventListener( 'click', function () {
        if ( $().blocked ) {
            return;
        }
        if ( controls.width.value > 3 ) {
            if ( controls.width.value < 7 ) {
                controls.expand.disabled = false;
                if ( controls.width.value < 6 ) {
                    controls.searches[0].disabled = false;
                }
            }
            controls.width.value--;
        }
        controls.create.click();
    } );


    // Expand Button EventListener
    controls.expand.addEventListener( 'click', async function () {
        const { vars, blocked } = $();
        if ( blocked ) {
            return;
        }
        if ( ( await vars.sizes )[0] <= 5 ) {
            await vars.set( 'weightings', getHeuristics() );
            globalThis.dispatchEvent( new Event( 'looking-for-soluce' ) );
            const promise = vars.expand( getSearch() );
            vars.save( promise );
            const result = await promise;
            if ( result ) {
                expandIn( result, display.solutions);
            }
            globalThis.dispatchEvent( new Event( 'soluce-found' ) );
        }
    } );

    globalThis.addEventListener( 'looking-for-soluce', () => {
        addClass( document.body, 'waiting' );
    } );

    globalThis.addEventListener( 'soluce-found', () => {
        removeClass( document.body, 'waiting' );
        $().vars.promise = undefined;
    } );

    function eventBlocker( event ) {
        if ( $().blocked ) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.returnValue = false;
            return false;
        }
    }

    document.body.addEventListener( 'click', eventBlocker, { passive: false } );
    document.body.addEventListener( 'scroll', eventBlocker, { passive: false } );


    // Swipe Listening Function
    swipedetect( display.taquin, async function handleSwipe( direction ) {
        const { vars, blocked } = $();
        if ( blocked ) {
            return;
        }
        const { game } = vars;
        if ( !( hasClass( document.body, "win" ) ) ) {
            let move;
            switch ( direction ) {
                case "left":
                    move = ( await game.findMoves( true ) ).includes( "L" ) ? "L" : undefined;
                    break;
                case "up":
                    move = ( await game.findMoves( true ) ).includes( "U" ) ? "U" : undefined;
                    break;
                case "right":
                    move = ( await game.findMoves( true ) ).includes( "R" ) ? "R" : undefined;
                    break;
                case "down":
                    move = ( await game.findMoves( true ) ).includes( "D" ) ? "D" : undefined;
                    break;
                default:
                    return;
            }
            if ( move ) {
                const last = await vars.play( move );
                requestUpdate();
                if ( last.dis === 0 ) {
                    addClass( document.body, "win" );
                }
            }
        }
    } );


    // Keydown EventListener
    document.onkeydown = async function handleKeyDown( event ) {
        const { vars, blocked } = $();
        if ( blocked ) {
            return;
        }
        const { game } = vars;
        console.log( 'available moves', ( await game.findMoves( true ) ) );
        if ( !( hasClass( document.body, "win" ) ) ) {
            let move;
            switch ( event.keyCode ) {
                case 13: // Enter
                    event.preventDefault();
                    controls.create.click();
                    break;
                case 37: // Left
                    event.preventDefault();
                    move = ( await game.findMoves( true ) ).includes( "L" ) ? "L" : undefined;
                    break;
                case 38: // Up
                    event.preventDefault();
                    move = ( await game.findMoves( true ) ).includes( "U" ) ? "U" : undefined;
                    break;
                case 39: // Right
                    event.preventDefault();
                    move = ( await game.findMoves( true ) ).includes( "R" ) ? "R" : undefined;
                    break;
                case 40: // Down
                    event.preventDefault();
                    move = ( await game.findMoves( true ) ).includes( "D" ) ? "D" : undefined;
                    break;
                default:
                    return;
            }
            if ( move ) {
                const last = await vars.play( move );
                requestUpdate();
                if ( last.dis === 0 ) {
                    addClass( document.body, "win" );
                }
            }
        }
    };

    controls.create.click();
} );
