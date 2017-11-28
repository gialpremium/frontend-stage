window.JST = window.JST || {};
window.JST['b-message'] = require('./b-message.jade');


/**
 * Блок сообшений.
 * всем ссылкам внутри задается таргет _blank
 *
 * @param {string} title - тайтл блока.
 * @param {string} type - стиль блока(по умолчанию в JST['b-message'] выставляет 'error' ).
 * @param {string} content - контент блока
 * @param {Object} options - настройки для JST шаблона
 */

( function( $ ) {
    $.fn.bMessage = function( title, type, content, options ) {
        var params,
            $newMessage;

        return this.each( function() {
            var $messageWrapper = $( this );

            // если есть параметры то это добавление нового сообщения
            if ( content || title ) {
                params = {
                    title   : title,
                    type    : type,
                    content : content,
                };
                if ( options ) {
                    params = $.extend( params, options );
                }
                $newMessage = JST['b-message']( params );
                $messageWrapper.html( $newMessage );

            }

        } );

    };

    /**
     * Рендерит сообщения b-message прямо в DOM
     * @param  {messages} массив сообщений message{} для рендера
     * @param  {message.type} тип сообщения
     * @param  {message.title} заголовок сообщения
     * @param  {message.text} текст сообщения
     */
    $.fn.bMessageRender = function( messages ) {
        var bMessages = messages.map( function( message ) {
            return JST['b-message']( {
                type    : message.type,
                title   : message.title,
                content : message.text,
            } );
        } );

        this.prepend( bMessages.join('') );
    };

    // init
    $( function() {
        var storage = new window.Storage( {
            storageType : 'session',
            prefix      : 'regru_',
        } );

        $('.b-message')
            .bMessage()
            .each( function() {
                var storageKey = $( this ).data('storage-key'),
                    sessionData;

                if ( storageKey ) {
                    sessionData = storage.get( storageKey ) || {};

                    if ( sessionData.closed ) {
                        $( this ).remove();
                    }
                    else {
                        $( this ).show();
                    }
                }
            } )
            .find('a').each( function() {
                var hasUrl     = this.getAttribute('href') && this.getAttribute('href').slice( 0,1 ) !== '#',
                    targetSelf = this.classList.contains('b-message_target_self');

                if ( hasUrl && !targetSelf ) {
                    this.setAttribute( 'target', '_blank' );
                }
            } );

        $( document ).on( 'click', '.b-message__close', function() {
            var $messageWrapper = $( this ).closest('.b-message'),
                reloadUrl       = $messageWrapper.data('reload'),
                storageKey,
                sessionData;

            $messageWrapper.hide();

            if ( $messageWrapper.data('storage-key') ) {
                storageKey  = $messageWrapper.data('storage-key'),
                sessionData = storage.get( storageKey ) || {};

                sessionData.closed = 1;
                storage.set( storageKey, sessionData );
            }

            if ( reloadUrl ) {
                window.location.href = reloadUrl;
            }

            return false;
        } );
    } );

} )( jQuery );
