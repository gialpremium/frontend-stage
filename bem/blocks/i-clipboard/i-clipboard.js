/* global Clipboard */
window.Clipboard = require('clipboard/dist/clipboard.js');

/**
 * Инициализация clipboard.js в декларативном стиле. Для инициализации необходимо:
 * 1) Добавить элементу класс 'i-clipboard'
 * 2) Через data-clipboard-target указать селектор элемнта, текст/значение которого нужно скопировать
 */
document.addEventListener( 'DOMContentLoaded', function() {
    var clipboard = new Clipboard('.i-clipboard');

    clipboard.on( 'success', function( e ) {

        // Из-за того, что мы переопределяем alert - приходится эскейпить
        alert( t('dict.Copied') + _.escape( e.text ) );
    } );
} );
