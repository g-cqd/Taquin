import { MultiThread } from './aemijs/aemi.module.js';

const { ExtendedWorker } = MultiThread;

if ( !( 'TaquinEnvironment' in globalThis ) ) {
    globalThis.TaquinEnvironment = ( {
        init: false,
        vars: null,
        game: null,
        worker: null,
    } );
}

/**
 * @param {Boolean} object 
 * @returns {'Yes'|'No'}
 */
function understand( object ) {
    return object ? 'Yes' : 'No';
}

const workerOptions = {
    promise: true,
    name: 'Taquin Worker',
    localImports: [
        `${window.href}aemijs/module/multithread-worker.js`
    ]
};


const TaquinWorker = new ExtendedWorker( function () {

    console.log( 'Is Taquin Worker accessible?', 'Yes' );

    if ( 'listeners' in self ) {
        self.listeners.addTypeListener( 'eval', string => {
            const func = eval( string );
            if ( typeof func !== 'function' ) {
                throw new TypeError( `This is not a function: ${string}` );
            }
            return func( globalThis );
        }, { propertyAccessor: 'data' } );

        self.listeners.addTypeListener( 'new', ( options = {} ) => {
            const { width, heuristics } = options;
            const env = new (self.Environment)( width, heuristics );
            self.Games.push( env );
            return env;
        }, { propertyAccessor: 'options' } );

        self.listeners.addTypeListener( 'get', ( query = {} ) => {
            const { object, property, method, args } = query;
            switch ( object ) {
                case 'taquin': {
                    const lastGameIndex = self.Games.length - 1;
                    const moves = self.Games[lastGameIndex].moves;
                    const lastMove = moves[moves.length - 1];
                    if ( property ) {
                        return lastMove[property];
                    }
                    else if ( method ) {
                        if ( Array.isArray( args ) ) {
                            return lastMove[method]( ...args );
                        }
                        else {
                            return lastMove[method]( args );
                        }
                    }
                    throw new SyntaxError( 'No property or method accessor has been passed.' );
                }
                case 'environment': {
                    const lastGameIndex = self.Games.length - 1;
                    const lastEnvironment = self.Games[lastGameIndex];
                    if ( property ) {
                        return lastEnvironment[property];
                    }
                    else if ( method ) {
                        if ( Array.isArray( args ) ) {
                            return lastEnvironment[method]( ...args );
                        }
                        else {
                            return lastEnvironment[method]( args );
                        }
                    }
                    throw new SyntaxError( 'No property or method accessor has been passed.' );
                }
                default: {
                    throw new SyntaxError( 'No object accessor has been passed.' );
                }
            }
        }, { propertyAccessor: 'query' } );

        self.listeners.addTypeListener( 'set', ( query = {} ) => {
            const { object, property, value } = query;
            switch ( object ) {
                case 'taquin': {
                    const lastGameIndex = self.Games.length - 1;
                    const moves = self.Games[lastGameIndex].moves;
                    const lastMove = moves[moves.length - 1];
                    if ( property ) {
                        return ( lastMove[property] = value );
                    }
                    throw new SyntaxError( 'No property accessor has been passed.' );
                }
                case 'environment': {
                    const lastGameIndex = self.Games.length - 1;
                    const lastEnvironment = self.Games[lastGameIndex];
                    if ( property ) {
                        return ( lastEnvironment[property] = value );
                    }
                    throw new SyntaxError( 'No property accessor has been passed.' );
                }
                default: {
                    throw new SyntaxError( 'No object accessor has been passed.' );
                }
            }
        }, { propertyAccessor: 'query' } );
    }

}, workerOptions );

globalThis.TaquinEnvironment.worker = TaquinWorker;

( async () => {

    const isSetUp = await TaquinWorker.postMessage( {
        type: 'eval', data: ( self => {

            Array.prototype.last = function ( thisArg = this ) {
                const { length } = thisArg;
                return length > 0 ? thisArg[length - 1] : undefined;
            };

            function random( min, max = undefined ) {
                return Math.floor( Math.random() * ( ( max == undefined ? min : max ) - ( max == undefined ? 0 : min ) ) + ( max == undefined ? 0 : min ) );
            }
            
            function shuffleArray( thisArg ) {
                return thisArg.forEach( ( e, i ) => {
                    const r = random( thisArg.length );
                    thisArg[i] = thisArg[r];
                    thisArg[r] = e;
                } );
            }

            class Taquin {
                /**
                 * @param {Environment} environment 
                 * @param {Taquin} previous 
                 * @param {"R"|"L"|"D"|"U"} move 
                 */
                constructor ( environment, previous = undefined, move = undefined ) {
                    this.environment = environment;
                    this.previous = previous;
                    this.inv = undefined;
                    this.dis = undefined;
                    this.man = undefined;
                    this.h = undefined;
                    if ( previous == undefined ) {
                        this.path = "";
                        this.g = 0;
                        this.sequence = this.magic( 1 );
                    } else {
                        this.path = previous.path + move;
                        this.g = this.previous.g + 1;
                        this.sequence = [...previous.sequence];
                        this.moveTile( move );
                        [this.inv, this.dis, this.man, this.h] = this.details();
                    }
                    this.moves = this.findMoves();
                    this.f = this.h + this.g;
                }
                coordinates( content = 0 ) {
                    const width = this.environment.sizes[0];
                    if ( content instanceof Object ) {
                        return ( width * content[1] ) + content[0];
                    } else {
                        const index = this.sequence.indexOf( content );
                        const y = Math.ceil( ( index + 1 ) / width ) - 1;
                        const x = index - ( y * width );
                        return [x, y];
                    }
                }
                details() {
                    const [width, length] = this.environment.sizes;
                    const weightings = this.environment.weightings;
                    const seq = this.sequence;
                    let inv = 0;
                    let dis = 0;
                    let man = 0;
                    let h = 0;
                    for ( const weighting of weightings ) {
                        let k = 0;
                        let stepH = 0;
                        for ( let i = 0; i < length; i++ ) {
                            let stepMan = 0;
                            if ( weighting === weightings[0] ) {
                                for ( let j = i + 1; j < length; j++ ) {
                                    if ( seq[i] !== 0 && seq[j] !== 0 && seq[i] > seq[j] ) {
                                        inv++;
                                    }
                                }
                                if ( seq[i] !== 0 && seq[i] !== ( i + 1 ) ) {
                                    dis++;
                                }
                            }
                            if ( i > 0 ) {
                                let pos = this.coordinates( i );
                                let x = i % width;
                                let coords = [x === 0 ? width - 1 : x - 1, Math.ceil( i / width ) - 1];
                                stepMan += Math.abs( pos[0] - coords[0] ) + Math.abs( pos[1] - coords[1] );
                                if ( weighting === weightings[0] ) {
                                    man += stepMan;
                                }
                                stepH += weighting[0][k] * stepMan;
                                k++;
                            }
                        }
                        if ( weighting[2] === 7 ) {
                            stepH += dis;
                        }
                        stepH = Math.floor( stepH / weighting[1] );
                        h += stepH;
                    }
                    h = Math.floor( h / weightings.length );
                    return [inv, dis, man, h];
                }
                /**
                 * @param {Boolean} flex 
                 * @returns {Array<"R"|"L"|"D"|"U">}
                 */
                findMoves( flex = false ) {
                    const limit = this.environment.sizes[0] - 1;
                    const coords = this.coordinates();
                    const last = this.path[this.g];
                    const moves = [];
                    if ( coords[0] != 0 && ( last != 'L' || flex ) ) {
                        moves.push( 'R' );
                    }
                    if ( coords[0] != limit && ( last != 'R' || flex ) ) {
                        moves.push( 'L' );
                    }
                    if ( coords[1] != 0 && ( last != 'U' || flex ) ) {
                        moves.push( 'D' );
                    }
                    if ( coords[1] != limit && ( last != 'D' || flex ) ) {
                        moves.push( 'U' );
                    }
                    return moves;
                }
                /**
                 * @param {"R"|"L"|"D"|"U"} move 
                 */
                moveTile( move ) {
                    const seq = this.sequence;
                    const width = this.environment.sizes[0];
                    const x = this.coordinates( this.coordinates() );
                    let y;
                    switch ( move ) {
                        case 'R': {
                            y = x - 1;
                            break;
                        }
                        case 'L': {
                            y = x + 1;
                            break;
                        }
                        case 'D': {
                            y = x - width;
                            break;
                        }
                        case 'U': {
                            y = x + width;
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    seq[x] = seq[y];
                    seq[y] = 0;
                }
                valid() {
                    const width = this.environment.sizes[0];
                    [this.inv, this.dis, this.man, this.h] = this.details();
                    const row = Math.abs( this.coordinates()[1] - width );
                    return ( ( width % 2 === 1 ) && ( this.inv % 2 === 0 ) ) || ( ( width % 2 === 0 ) && ( ( row % 2 === 1 ) === ( this.inv % 2 === 0 ) ) );
                }
                children() {
                    const childList = [];
                    for ( const move of this.moves ) {
                        const child = new Taquin( this.environment, this, move );
                        if ( child.dis === 0 ) {
                            return child;
                        }
                        let i = 0;
                        for ( const { length } = childList; i < length; i++ ) {
                            if ( child.f < childList[i].f ) {
                                break;
                            }
                        }
                        childList.splice( i, 0, child );
                    }
                    return childList;
                }
                /**
                 * @param {Number} rand 
                 * @returns {Number[]}
                 */
                magic( rand = 0 ) {
                    const length = this.environment.sizes[1];
                    const seq = new Array( length ).fill( 0 );
                    for ( let i = 1; i < length; i++ ) {
                        seq[i - 1] = i;
                    }
                    if ( rand === 1 ) {
                        do {
                            shuffleArray( seq );
                            this.sequence = seq;
                        } while ( !this.valid() );
                    }
                    return this.sequence;
                }
                toObject() {
                    const { inv, dis, man, g, path, sequence, previous } = this;
                    return { inv, dis, man, g, path, sequence, previous: previous instanceof Taquin ? previous.toObject() : previous };
                }
                /**
                 * @param {'taquin'|'string'|'array'|'object'} type 
                 */
                traceroute( type ) {
                    const path = [this];
                    while ( path[0].previous instanceof Taquin ) {
                        path.unshift( path[0].previous );
                    }
                    switch ( type ) {
                        case 'taquin': {
                            return path;
                        }
                        case 'string': {
                            return path.map( ( { path } ) => path[path.length - 1] );
                        }
                        case 'array': {
                            return path.map( ( { sequence } ) => sequence );
                        }
                        case 'object': {
                            return path[path.length -1].toObject();
                        }
                        default: {
                            throw new Error();
                        }
                    }
                }
            }
            class Environment {
                /**
                 * @param {Number} width
                 * @param {Number[]} choices
                 */
                constructor ( width, choices = undefined ) {
                    this.createdTaquins = 0;
                    this._sizes = [width, width * width];
                    this.choices = choices;
                    this._weightings = this.getWeightings( choices );
                    this.moves = [new (self.Taquin)( this )];
                    this.end = [];
                }
                get sizes() {
                    return this._sizes;
                }
                /**
                 * 
                 * @param {Number[]} choices 
                 * @returns {Array<Array<Number[],Number,Number>>}
                 */
                getWeightings( choices = [5] ) {
                    const width = this.sizes[0];
                    const length = this.sizes[1] - 1;
                    const weightings = [];
                    let weight = length;
                    for ( const index of choices ) {
                        let rho = index % 2 !== 0 ? 4 : 1;
                        let pi = new Array( length ).fill( 0 );
                        switch ( index ) {
                            case 1:
                                if ( width === 3 ) {
                                    pi = [36, 12, 12, 4, 1, 1, 4, 1];
                                } else {
                                    for ( let y = 0; y < width; y++ ) {
                                        for ( let x = 0; x < width; x++ ) {
                                            if ( x === y === width - 1 ) {
                                                continue;
                                            } else {
                                                if ( x === y === 0 ) {
                                                    pi[0] = width * ( width * 3 );
                                                    x++;
                                                }
                                                if ( y === 0 ) {
                                                    while ( x < width ) {
                                                        pi[x++] = width * 3;
                                                    }
                                                } else {
                                                    if ( x === 0 ) {
                                                        pi[y * width] = width * 2;
                                                    } else {
                                                        pi[y * width + x] = width - y;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                            case 2:
                            case 3:
                                pi = [...Array( length ), ( _e, i ) => ( length + 1 ) - ( i + 1 )];
                                break;
                            case 4:
                            case 5:
                                for ( let i = 0; i < ( width - 1 ); i++ ) {
                                    let j = 0;
                                    while ( pi[j] !== 0 ) {
                                        j++;
                                    }
                                    for ( let k = 0; k < ( width - i ); k++ ) {
                                        pi[j++] = weight--;
                                    }
                                    j += i;
                                    pi[j] = weight--;
                                    j += width;
                                    while ( j < length - 1 ) {
                                        pi[j] = weight--;
                                        j += width;
                                    }
                                }
                                break;
                            case 6:
                                pi = Array( length ).fill( 1 );
                                rho = 1 / ( ( width - 3 ) + 1 );
                                break;
                            case 7:
                                break;
                            case 8:
                                let mid = Math.floor( length / 2 );
                                for ( let i = 0; i < mid; i++ ) {
                                    pi[i] = mid - i;
                                }
                                if ( length % 2 === 1 ) {
                                    pi[mid] = length;
                                    mid++;
                                }
                                for ( let i = mid; i < length; i++ ) {
                                    pi[i] = i + 1;
                                }
                                rho = 2.5;
                                break;
                            case 9:
                                rho = 2;
                                let j = 1;
                                for ( let i = 0; i < length; i++ ) {
                                    pi[i] = Math.abs( Math.floor( length / 2 ) - ( Math.floor( ( j - 1 ) / 2 ) ) );
                                    if ( i < length - 1 ) {
                                        i++;
                                        pi[i] = Math.abs( Math.floor( length / 2 ) - ( Math.floor( ( j - 1 ) / 2 ) ) );
                                    }
                                    j++;
                                }
                                if ( length % 2 === 1 ) {
                                    pi[length - 1] = 1;
                                }
                                shuffleArray( pi );
                                break;
                            default:
                                break;
                        }
                        weightings.push( [pi, rho, index] );
                    }
                    return weightings;
                }
                get weightings() {
                    return this._weightings;
                }
                set weightings( choices ) {
                    this._weightings = this.getWeightings( choices );
                }
                /**
                 * @returns {void}
                 */
                correct() {
                    for ( const move of this.moves ) {
                        [move.inv, move.dis, move.man, move.h] = move.details();
                        move.f = move.g + move.h;
                        move.moves = move.findMoves( true );
                    }
                }
                /**
                 * @param {Taquin} taquin 
                 * @param {Array} array 
                 * @returns {Boolean}
                 */
                inArray( taquin, array ) {
                    for ( const element of array ) {
                        if ( element.sequence === taquin.sequence ) {
                            return true;
                        }
                    }
                    return false;
                }
                /**
                 * @returns {Taquin}
                 */
                aStar() {
                    let queue = new Map();
                    queue.set( this.moves.last().f, [this.moves.last()] );
                    while ( true ) {
                        const k = [...queue.keys()][0];
                        const kArray = queue.get( k );
                        const shouldBeExpanded = kArray.shift();
                        if ( kArray.length === 0 ) {
                            queue.delete( k );
                        } else {
                            queue.set( k, kArray );
                        }
                        const children = shouldBeExpanded.children();
                        if ( children instanceof Taquin ) {
                            return this.end[this.end.push( children ) - 1];
                        } else {
                            for ( const child of children ) {
                                const cArray = queue.get( child.f );
                                if ( cArray ) {
                                    cArray.push( child );
                                    queue.set( child.f, cArray );
                                } else {
                                    queue.set( child.f, [child] );
                                }
                            }
                        }
                        const sortedArray = [...queue.keys()].sort( ( a, b ) => a - b );
                        const secondaryQueue = new Map();
                        for ( const key of sortedArray ) {
                            secondaryQueue.set( key, queue.get( key ) );
                            queue.delete( key );
                        }
                        queue = secondaryQueue;
                    }
                }
                /**
                 * @returns {Taquin}
                 */
                idaStar() {
                    const root = this.moves.last();
                    const bound = root.h;
                    const path = [root];
                    function search( path, g, bound ) {
                        const node = path.last();
                        const f = g + node.h;
                        if ( f > bound ) { return f; }
                        const children = node.children();
                        let minimum = Infinity;
                        if ( children instanceof Taquin ) {
                            path.push( children );
                            return children;
                        } else {
                            for ( const child of node.children() ) {
                                if ( !child.environment.inArray( child, path ) ) {
                                    path.push( child );
                                    const t = search( path, g + 1, bound );
                                    if ( t instanceof Taquin ) { return t; }
                                    if ( t < minimum ) { minimum = t; }
                                    path.pop();
                                }
                            }
                        }
                        return minimum;
                    }
                    while ( true ) {
                        const t = search( path, 0, bound );
                        if ( t instanceof Taquin ) {
                            this.end.push( t );
                            return t;
                        }
                        if ( t === Infinity ) { return false; }
                        bound = t;
                    }
                }
                /**
                 * @returns {Taquin}
                 */
                hal() {
                    const root = this.moves.last();
                    const list = [root];
                    const explored = [];
                    for ( const n of list ) {
                        const children = n.children();
                        if ( children instanceof Taquin ) {
                            this.end.push( children );
                            return children;
                        }
                        else {
                            for ( let i = children.length - 1; i >= 0; i-- ) {
                                if ( !this.inArray( children[i], explored ) ) {
                                    list.unshift( children.pop() );
                                } else {
                                    children.pop();
                                }
                            }
                        }
                        let i = 0;
                        for ( const { length } = explored; i < explored; i++ ) {
                            if ( n.f < explored[i].f ) {
                                break;
                            }
                        }
                        explored.splice( i, 0, n );
                        list.splice( list.indexOf( n ), 1 );
                    }
                    return false;
                }
                /**
                 * @param {'aStar'|'idaStar'|'hal'} algorithm
                 * @param {'taquin'|'string'|'array'} type
                 */
                async expand( algorithm, type ) {
                    this.correct();
                    const taquin = this[algorithm]();
                    return taquin.traceroute( type );
                }
                /**
                 * @param {"R"|"L"|"D"|"U"} move 
                 * @returns {Taquin}
                 */
                play( move ) {
                    console.log( 'in worker::move', move );
                    const lastTaquin = this.moves.last();
                    const newTaquin = new Taquin( this, lastTaquin, move );
                    newTaquin.moves = newTaquin.findMoves( true );
                    return this.moves[this.moves.push( newTaquin ) - 1];
                }
            }
            self.Taquin = Taquin;
            self.Environment = Environment;
            self.Games = [];
            return 'Taquin' in self && 'Environment' in self && 'Games' in self;
        } ).toString()
    } );

    console.log( 'Is worker set up?', understand( isSetUp ) );

    if ( isSetUp ) {
        globalThis.dispatchEvent( new Event( 'worker-set' ) );
    }

} )();
