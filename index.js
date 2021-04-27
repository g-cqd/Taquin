import { MultiThread } from './aemijs/aemi.module.js';

const { ExtendedWorker } = MultiThread;

if ( !( 'TaquinEnvironment' in globalThis ) ) {
    globalThis.TaquinEnvironment = {
        init: false,
        vars: null,
        game: null,
        worker: null
    };
}

/**
 * @param {Boolean} object
 * @returns {'Yes'|'No'}
 */
const understand = function understand( object ) {
    return object ? 'Yes' : 'No';
};

const TaquinWorker = new ExtendedWorker( 'worker.js', { promise: true, name: 'Taquin Worker' } );

globalThis.TaquinEnvironment.worker = TaquinWorker;

( async () => {

    const isSetUp = await TaquinWorker.postMessage( {
        type: 'eval',
        data: ( self => 'Taquin' in self && 'Environment' in self && 'Games' in self ).toString()
    } );

    console.log( 'Is worker set up?', understand( isSetUp ) );

    if ( isSetUp ) {
        globalThis.dispatchEvent( new Event( 'worker-set' ) );
    }

} )();
