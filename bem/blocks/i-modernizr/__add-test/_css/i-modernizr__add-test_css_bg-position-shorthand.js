window.Modernizr.addTest( 'bgpositionshorthand', function() {

    var elem = document.createElement('a'),
        eStyle = elem.style,
        val = 'right 10px bottom 10px';

    eStyle.cssText = 'background-position: ' + val + ';';

    return ( eStyle.backgroundPosition === val );
} );
