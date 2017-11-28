

/**
 * Функциональность APRT является частью партнерской системы actionpay (b-cpa-partners__actionpay), но
 * работает как самостоятельный модуль - независимо от партнерского функционала actionpay.
 * Предназначена для сбора данных о пользователях.
 */
Site.namespace('Site.App.CpaPartners.APRT');

( function() {

    var PARTNER_ID = 'reg',
        _aprtSingleton = null;

    function APRT() {
        window.APRT_DATA = { pageType: 0 };
    }

    /**
     * Метод запускает aprt код. Должен вызываться на всех страницах сайта,
     * не зависимо от источника из которого пришел пользователь.
     */
    APRT.prototype.exec = function() {

        ( function( w, d ) {
            var el,
                rs,
                c,
                s,
                p;

            try {
                el = 'getElementsByTagName';
                rs = 'readyState';
                if ( d[rs] !== 'interactive' && d[rs] !== 'complete' ) {
                    c = arguments.callee;

                    return setTimeout( function() {
                        c( w, d );
                    }, 100 );
                }

                s = d.createElement('script');
                s.type = 'text/javascript';
                s.async = s.defer = true;
                s.src = '//aprtx.com/code/' + PARTNER_ID + '/';

                p = d[el]('body')[0] || d[el]('head')[0];

                if ( p ) {
                    p.appendChild( s );
                }
            }
            catch ( x ) {
                if ( w.console ) {
                    w.console.log( x );
                }
            }
        } )( window, document );
    };

    /**
     * Метод для отправки aprt-событий
     * @param  {Object} data aprt-объект
     */
    APRT.prototype.sendAprt = function( data ) {
        window.APRT_SEND = window.APRT_SEND || function() {};
        window.APRT_SEND( data );
    };

    /**
     * Метод мержит новые данные в aprt-объект
     * @param {Object} data Данные для добавления в aprt
     */
    APRT.prototype.setData = function( data ) {
        window.APRT_DATA = window.APRT_DATA || {};
        Object.assign( window.APRT_DATA, data );
    };

    /**
     * Метод вернет данные aprt
     * @return {Object} aprt-объект
     */
    APRT.prototype.getData = function() {
        return window.APRT_DATA;
    };

    Site.App.CpaPartners.APRT = {
        getInstance : function() {
            if ( !_aprtSingleton ) {
                _aprtSingleton = new APRT();
            }

            return _aprtSingleton;
        }, 
    };

} )();
