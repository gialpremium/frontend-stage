/* eslint-disable no-magic-numbers */
( function() {
    var checkArray = function() {
        return [1,2].splice( 0 ).length !== 2
            || [].unshift( 0 ) !== 1
            || !Array.isArray
            || !Array.prototype.forEach
            || !Array.prototype.map
            || !Array.prototype.filter
            || !Array.prototype.every
            || !Array.prototype.some
            || !Array.prototype.reduce
            || !Array.prototype.reduceRight
            || ( !Array.prototype.indexOf || ( [0, 1].indexOf( 1, 2 ) !== -1 ) )
            || ( !Array.prototype.lastIndexOf || ( [0, 1].lastIndexOf( 0, -3 ) !== -1 ) );
    };

    var checkNumber = function() {
        return !Number.prototype.toFixed
            || ( 0.00008 ).toFixed( 3 ) !== '0.000'
            || ( 0.9 ).toFixed( 0 ) === '0'
            || ( 1.255 ).toFixed( 2 ) !== '1.25'
            || ( 1000000000000000128 ).toFixed( 0 ) !== '1000000000000000128';
    };

    // some tests are positive in Chrome 31
    if (
        !Function.prototype.bind
        || checkArray()
        || !Object.keys
        || !Date.parse
        || !Date.now
        || checkNumber()
    ) {
        import('i-shims/__es5-shim/i-shims__es5-shim.js');
    }
} )();
