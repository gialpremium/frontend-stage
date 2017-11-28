/* eslint-disable */
window.Modernizr.addTest( 'tablerelative', function() {

    var testTableHtml = '',
        supported,
        fake = false,
        root = document.body || ( function() {
            fake = true;

            return document.documentElement.appendChild( document.createElement('body') );
        }() );

    testTableHtml += '<table id="td-rel-test" style="position: absolute; top: 0px; left: 0px; border: 0px none; margin: 0px; background: red;" cellspacing="0" cellpadding="0">';
    testTableHtml += '<tr><td style="position: relative; height: 40px; width: 20px; border: 0px none; margin: 0px; padding: 0px">';
    testTableHtml += '<div style="height: 0px; width: 20px; position: absolute; left: 0px; bottom: 0px; border: 0px none; margin: 0px; padding: 0px;"></div></td></tr>';
    testTableHtml += '<tr><td><br /></td></tr></table>';


    root.innerHTML += testTableHtml;
    var testTable = document.getElementById('td-rel-test');
    supported = ( testTable.getElementsByTagName('div')[0].offsetTop === 40 );

    if ( fake ) {
        document.documentElement.removeChild( root );
    }

    return supported;
} );
