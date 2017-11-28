var promise = require('es6-promise');

if ( !( 'Promise' in window ) ) {
    promise.polyfill();
}
