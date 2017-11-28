
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * @submodule Site.App.CpaPartners.GdeslonThanks
 */

Site.namespace('Site.App.CpaPartners.GdeslonThanks');

( function() {

    /* global inherit */

    var _gdeslonThanksSingleton = null,
        gdeslonThanksInstance;


    /**
     * @class GdeslonThanks
     * @constructor
     * @extends Common
     * Класс для работы с сетью GdeslonThanks
     */
    function GdeslonThanks() {

        /**
         * url-параметр с id пользователя, который будет сохранен в cookie
         * @type {String}
         */
        this.urlParameter = 'gsaid';

        /**
         * Имя url-параметра из которого берем время жизни куки
         * @type {String}
         */
        this.expirationParamName = '_gs_cttl';

        /**
         * Наименование cookie-пареметра в котором хранится идентификатор пользователя
         * @type {String}
         */
        this.cookieName = 'gsaid';

        /**
         * Наименовние url-параметра utm_source при котором сохраняем данные о партнерской сети из url в cookie
         * @type {String}
         */
        this.utmSourceName = 'Gdeslon';
    }

    inherit( GdeslonThanks, Site.App.CpaPartners.Common );

    /**
     * Сгенерирует набор кодов и цен для параметра codes
     * @param  {Array} orders Массив заказов
     * @return {String} Строка вида CODE:PRICE,CODE:PRICE,CODE:PRICE
     */
    GdeslonThanks.prototype.generateCodes = function( orders ) {
        var toCodePairMapper = toCodePair.bind( Site.App.CpaPartners.GdeslonThanks.types );

        return orders.reduce( function( prev, item ) {
            if ( !( prev.filter( hasItType( item.id ) ) ).length ) {
                prev.push( item );
            }

            return prev;
        }, [] ).map( toCodePairMapper ).join(',');
    };

    /**
     * Переопределяем метод из Common для создания специфических проверок.
     * Проверка наличия cpa-параметров в url и их сохранение в cookie
     * @method checkCookieAndSave
     * @for GdeslonThanks
     */
    GdeslonThanks.prototype.checkCookieAndSave = function() {
        var urlParam = this.getUrlParamByName( this.urlParameter ),
            expirationValue = this.getUrlParamByName( this.expirationParamName ),
            gdeslonThanksRegexp = /^[a-z0-9]+$/;

        if ( urlParam && gdeslonThanksRegexp.test( urlParam ) ) {
            this.setCookie( this.cookieName, urlParam, expirationValue );
            Site.App.CpaPartners.lastUpdatedCookie = this.cookieName;
        }
    };

    /**
     * Формируем пиксель и сохраняем для дальнейшего рендера
     */
    GdeslonThanks.prototype.prepareForRender = function() {
        var cookieValue = this.getCookie( this.cookieName ),
            billId = Site.App.CpaPartners.GdeslonThanks.billId,
            codes = this.generateCodes( Site.App.CpaPartners.GdeslonThanks.pixels || [] );

        if ( cookieValue && codes ) {
            this.addForRender(
                '<script async="true" src="https://www.gdeslon.ru/thanks.js?'
                + 'codes=' + codes
                + '&order_id=' + billId
                + '&merchant_id=' + Site.App.CpaPartners.GdeslonThanks.merchantId
                + '"></script>' );
        }
    };


    /**
     * Если в заказе есть позиции одного типа - фильтруем их, чтобы получить массив услуг с уникальными типами
     * @param  {String}  id Идентификатор - это харакретистика типа услуги. Фильтрация происходит по нему
     * @return {Boolean}
     */
    function hasItType( id ) {
        return function( item ) {
            return id == item.id;
        };
    }

    /**
     * Маппер объекта с информацией о заказе в строку CODE:PRICE
     * В this биндится набор типов с кодами и ценами для gdeslon.
     * @param  {Object} item Объект с данными о заказе
     * @return {String} Строка строку CODE:PRICE для текущего заказа
     */
    function toCodePair( item ) {
        return this[item.id].code + ':' + this[item.id].price;
    }


    Site.App.CpaPartners.GdeslonThanks = {
        getInstance : function() {
            if ( !_gdeslonThanksSingleton ) {
                _gdeslonThanksSingleton = new GdeslonThanks();
            }

            return _gdeslonThanksSingleton;
        },
        pixels : [],
        billId : '',
    };

    /**
     * Подписываем все необходимые методы в очереди на выполнение
     */

    gdeslonThanksInstance = Site.App.CpaPartners.GdeslonThanks.getInstance();

    // метод проверки url-параметров
    Site.App.CpaPartners.Main.urlCheckMethods.push(
        gdeslonThanksInstance.checkCookieAndSave.bind( gdeslonThanksInstance ) );

    // Метод для удаления собственных кук
    Site.App.CpaPartners.Main.removeCrossCookieMethods
        .push( gdeslonThanksInstance.removeCrossCookie.bind( gdeslonThanksInstance ) );

    // метод подготовки пикселя к рендеру на странице
    Site.App.CpaPartners.Main.preparePixelsMethods.push( function( options ) {
        if ( options.availability.gdeslonThanks ) {
            gdeslonThanksInstance.prepareForRender.call( gdeslonThanksInstance, options );
        }
    } );

} )();

