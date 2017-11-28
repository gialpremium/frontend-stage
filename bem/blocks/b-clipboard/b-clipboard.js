/* global Clipboard */

/* Инициализация clipboard.js для блока b-clipboard. */
document.addEventListener( 'DOMContentLoaded', function() {
    var clipboards = Array.prototype.slice.call( document.querySelectorAll('.b-clipboard') );

    clipboards.forEach( function( wrapper ) {
        var copyButton = wrapper.querySelector('.b-clipboard__copy'),
            target     = wrapper.querySelector('.b-clipboard__target'),
            clipboard  = new Clipboard( copyButton, {
                target : function() {
                    return target;
                },
            } );

        // Из-за того, что мы переопределяем alert - приходится эскейпить
        clipboard.on( 'success', function( e ) {
            alert( t('dict.Copied') + _.escape( e.text ) );
        } );
    } );
} );
