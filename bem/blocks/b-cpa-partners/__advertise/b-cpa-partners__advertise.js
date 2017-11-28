
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * @submodule Site.App.CpaPartners.Advertise
 */

Site.namespace('Site.App.CpaPartners.Advertise');

( function() {

    /* global inherit */

    /**
     * Трекинг номер для advertise
     * @type {String}
     */
    var ADVERTISE_TRACKING = '8e2313f72a0e426b',
        _advertiseSingleton = null,
        advertiseInstance;

    /**
     * @class Advertise
     * @constructor
     * @extends Common
     * Класс для работы с сетью Advertise
     */
    function Advertise() {

        /**
         * url-параметр с id пользователя, который будет сохранен в cookie
         * @type {String}
         */
        this.urlParameter = 'uid';

        /**
         * Наименование cookie-пареметра в котором хранится идентификатор пользователя
         * @type {String}
         */
        this.cookieName = 'cpa_uid';

        /**
         * Наименовние url-параметра utm_source при котором сохраняем данные о партнерской сети из url в cookie
         * @type {String}
         */
        this.utmSourceName = 'advertise';
    }

    inherit( Advertise, Site.App.CpaPartners.Common );

    /**
     * Формируем пиксель и сохраняем для дальнейшего рендера
     */
    Advertise.prototype.prepareForRender = function( options ) {
        var advertiseUidCookie = this.getCookie( this.cookieName );

        if ( advertiseUidCookie ) {
            this.addForRender( '<img src="https://datatracking.ru/tracking/' + ADVERTISE_TRACKING + '/img/?uid=' + advertiseUidCookie + '&order_id=' + options.bill_id + '&client_id=' + options.user_id + '&amount=' + options.payment + '" width="1" height="1" alt="" />' );
        }
    };

    Site.App.CpaPartners.Advertise = {
        getInstance : function() {
            if ( !_advertiseSingleton ) {
                _advertiseSingleton = new Advertise();
            }

            return _advertiseSingleton;
        }, 
    };

    /**
     * Подписываем все необходимые методы в очереди на выполнение
     */

    advertiseInstance = Site.App.CpaPartners.Advertise.getInstance();

    // метод проверки url-параметров
    Site.App.CpaPartners.Main.urlCheckMethods.push( advertiseInstance.checkCookieAndSave.bind( advertiseInstance ) );

    // Метод для удаления собственных кук
    Site.App.CpaPartners.Main.removeCrossCookieMethods
        .push( advertiseInstance.removeCrossCookie.bind( advertiseInstance ) );

    // метод подготовки пикселя к рендеру на странице
    Site.App.CpaPartners.Main.preparePixelsMethods.push( function( options ) {
        if ( options.availability.advertise ) {
            advertiseInstance.prepareForRender.call( advertiseInstance, options );
        }
    } );

} )();
