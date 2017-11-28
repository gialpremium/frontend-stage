( function() {
    'use strict';

    var i,
        methods = [
            'log',
            'debug',
            'info',
            'warn',
            'error',
            'assert',
            'clear',
            'dir',
            'dirxml',
            'trace',
            'group',
            'groupCollapsed',
            'groupEnd',
            'time',
            'timeEnd',
            'timeStamp',
            'profile',
            'profileEnd',
            'count',
            'exception',
            'table',
        ];

    if ( typeof window.console === 'undefined' ) {
        window.console = {};
    }

    for ( i = 0; i < methods.length; i++ ) {
        if ( typeof window.console[ methods[i] ] === 'undefined' ) {
            window.console[ methods[i] ] = function() {};
        }
    }
} )();
