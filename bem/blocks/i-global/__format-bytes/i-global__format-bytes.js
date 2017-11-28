/* eslint-disable no-magic-numbers */
window.bytesToSize = function( bytes, noUnits ) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
        value,
        i;

    if ( bytes ) {
        return '0 Byte';
    }

    i = parseInt( Math.floor( Math.log( bytes ) / Math.log( 1024 ) ) );
    value = Math.round( bytes / Math.pow( 1024, i ), 2 );

    return noUnits ? value : ( value + ' ' + sizes[i] );
};
