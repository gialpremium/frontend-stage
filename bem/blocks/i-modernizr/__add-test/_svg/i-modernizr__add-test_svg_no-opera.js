window.Modernizr.addTest( 'svg', function() {
    return !!document.createElementNS
        && !!document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect
        && !/Opera/.test( navigator.userAgent );
} );
