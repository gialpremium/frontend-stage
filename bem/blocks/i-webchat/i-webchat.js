( function( $ ) {

    var wrap = window.Raven ? window.Raven.wrap : function( f ) {
        return f;
    };
    var url = window.REGRU.chat_url.replace( /\/$/, '' );

    if ( !url ) {
        return false;
    }

    /**
     *
     * Загрузка скрипта для полного разворачивания веб-чата
     *
     * @class deploy
     * @constructor
     * @static
     * @uses $.Deferred
     * @uses Site.App.Auth.Modules.Loader
     */
    function deploy() {

        var loader = wrap.call( ( window.Raven || window ), ( new window.Site.App.Auth.Modules.Loader ).load );
        var loaderUrl = url + '/srs/js/builder.js';
        var DEPLOYTIME_INTERVAL = 5000;

        $.ajax( {
            url      : url + '/client/?area=getPostfix',
            dataType : 'jsonp',
        } )
            .done( function( data ) {
                return loader( loaderUrl + data.postfix );
            } )
            .fail( function() {
                setTimeout( deploy, DEPLOYTIME_INTERVAL );
            } );
    }

    $( document ).ready( function() {

        /**
         * Бинд события открытия фрейма чата
         * Бросает ошибку для обработки в источнике и повторной отправки
         * до загрузки обработчика из webchat
         *
         * @event
         */
        window.pm.bind( 'open_iframe', function() {
            throw new Error('listeners not ready');
        } );

        /**
         * Событие открытия миничата, нужно чтобы срабатывало
         * только один первый раз при ините, открытие чата
         * при переходе по страницам не учитывать
         * @method start_minichat
         */
        window.pm.bind( 'start_minichat', function() {
            if ( window.Site.Analytics.IsEnabled.google ) {
                ga( 'send', 'event', 'webchat', 'open', 'chat', { 'nonInteraction': 1 } );
            }

        } );


        /**
         * Событие отправки сообщения в миничате
         * @method send_minichat
         */
        window.pm.bind( 'send_minichat', function() {
            if ( window.Site.Analytics.IsEnabled.google ) {
                ga( 'send', 'event', 'webchat', 'send' );
            }
        } );

        deploy();
    } );

} )( jQuery );
