window.Modernizr = require('modernizr');

// developer.mozilla.org/en/CSS/box-sizing
// github.com/Modernizr/Modernizr/issues/248
window.Modernizr.addTest( 'boxsizing', function() {

    var IEMode = 7;

    return window.Modernizr.testAllProps('boxSizing')
        && ( document.documentMode === undefined || document.documentMode > IEMode );
} );

// display: table and table-cell test. (both are tested under one name "table-cell" )
// By @scottjehl
// all additional table display values are here: http://pastebin.com/Gk9PeVaQ though Scott has seen some IE false positives with that sort of weak detection.
// more testing neccessary perhaps.
window.Modernizr.addTest( 'display-table', function() {

    var doc   = window.document,
        docElem = doc.documentElement,
        parent  = doc.createElement('div'),
        child = doc.createElement('div'),
        childb  = doc.createElement('div'),
        ret;

    parent.style.cssText = 'display: table';
    child.style.cssText = childb.style.cssText = 'display: table-cell; padding: 10px';

    parent.appendChild( child );
    parent.appendChild( childb );
    docElem.insertBefore( parent, docElem.firstChild );

    ret = child.offsetLeft < childb.offsetLeft;
    docElem.removeChild( parent );

    return ret;
} );
