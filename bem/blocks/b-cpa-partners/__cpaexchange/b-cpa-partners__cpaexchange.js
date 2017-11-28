
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * @submodule Site.App.CpaPartners.CpaExchange
 */

Site.namespace('Site.App.CpaPartners.CpaExchange');

( function() {

    /**
     * Трекинг номер для advertise
     * @type {String}
     */
    var OFFER_ID = 295,
        _cpaexSingleton = null,
        cpaexInstance;



    /**
     * @class CpaExchange
     * @constructor
     * @extends Common
     * Класс для работы с сетью CpaExchange
     */
    function CpaExchange() {

        /**
         * url-параметр с данными которые будут сохранены в cookie
         * @type {String}
         */
        this.urlParameter = 'cpaex';

        /**
         * Наименование cookie-пареметра в котором хранится идентификатор пользователя
         * @type {String}
         */
        this.cookieName = 'cpaex';

        /**
         * Наименовние url-параметра utm_source при котором сохраняем данные о партнерской сети из url в cookie
         * @type {String}
         */
        this.utmSourceName = 'cpaexchange';
    }

    inherit( CpaExchange, Site.App.CpaPartners.Common );

    /**
     * Формируем пиксель и сохраняем для дальнейшего рендера
     * options.amount - Стоимость заказа
     * options.track_id - Номер счета
     */
    CpaExchange.prototype.prepareForRender = function( options ) {
        var cpaexUidCookie = this.getCookie( this.cookieName );

        if ( cpaexUidCookie ) {
            this.addForRender( '<iframe src="https://partners.cpaex.ru/track?offer_id=' + OFFER_ID + '&amount=' + options.payment + '&track_id=' + options.bill_id + '" height="1" width="1" frameborder="0" scrolling="no"></iframe>' );
        }
    };

    Site.App.CpaPartners.CpaExchange = {
        getInstance : function() {
            if ( !_cpaexSingleton ) {
                _cpaexSingleton = new CpaExchange();
            }

            return _cpaexSingleton;
        }, 
    };

    /**
     * Подписываем все необходимые методы в очереди на выполнение
     */
    cpaexInstance = Site.App.CpaPartners.CpaExchange.getInstance();

    // метод проверки url-параметров
    Site.App.CpaPartners.Main.urlCheckMethods.push( cpaexInstance.checkCookieAndSave.bind( cpaexInstance ) );

    // Метод для удаления собственных кук
    Site.App.CpaPartners.Main.removeCrossCookieMethods
        .push( cpaexInstance.removeCrossCookie.bind( cpaexInstance ) );

    // метод подготовки пикселя к рендеру на странице
    Site.App.CpaPartners.Main.preparePixelsMethods.push( function( options ) {
        if ( options.availability.cpaexchange ) {
            cpaexInstance.prepareForRender.call( cpaexInstance, options );
        }
    } );

} )();
