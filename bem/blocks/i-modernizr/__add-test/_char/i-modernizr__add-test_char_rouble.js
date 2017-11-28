document.addEventListener( 'DOMContentLoaded', function() {

    Modernizr.addTest( 'charRouble', function() {

        var bool,
            missingGlyphWrapper = document.createElement('div'),

            charRoubleWrapper   = document.createElement('div'),
            missingGlyph        = document.createElement('span'),
            charRouble          = document.createElement('span');

        missingGlyphWrapper.className = 'b-text';
        charRoubleWrapper.className   = 'b-text';

        document.body.appendChild( missingGlyphWrapper );
        document.body.appendChild( charRoubleWrapper );

        missingGlyph.innerHTML = '&#5987;';
        charRouble.innerHTML   = '&#8381;';

        missingGlyphWrapper.appendChild( missingGlyph );
        charRoubleWrapper.appendChild( charRouble );

        bool = 'offsetWidth' in missingGlyph && missingGlyph.offsetWidth !== charRouble.offsetWidth;

        missingGlyphWrapper.parentNode.removeChild( missingGlyphWrapper );
        charRoubleWrapper.parentNode.removeChild( charRoubleWrapper );

        return bool;

    } );

}, false );
