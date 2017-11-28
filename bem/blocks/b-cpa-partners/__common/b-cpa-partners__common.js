
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Объект. Содержит классы для работы с различными партнерскими сервисами
 * @submodule Site.App.CpaPartners.Common
 */

Site.namespace('Site.App.CpaPartners.Common');

( function() {

    var DEFAULT_EXPIRATION_PERIOD = 30;

    function Common() {

        /**
         * url-параметр с id пользователя, который будет сохранен в cookie
         * @type {String}
         */
        this.urlParameter = '';

        /**
         * Наименование cookie-пареметра в котором хранится идентификатор пользователя
         * @type {String}
         */
        this.cookieName = '';

        /**
         * Наименовние url-параметра utm_source при котором сохраняем данные о партнерской сети из url в cookie
         * @type {String}
         */
        this.utmSourceName = '';
    }


    /**
     * Установить cookie
     * @method setCookie
     * @for Common
     * @param {String} name Название сохраняемого cookie
     * @param {String} value Значение cookie
     */
    Common.prototype.setCookie = function( name, value, expiration ) {
        var cookieExpiration = parseInt( expiration ) || DEFAULT_EXPIRATION_PERIOD;

        $.cookie( name, value, {
            expires : cookieExpiration,
            domain  : Site.Config.cookieDomain,
            path    : '/',
        } );
    };

    /**
     * Вернет значение cookie
     * @method getCookie
     * @for Common
     * @param  {String} name Имя куки, значение которой нужно вернуть
     * @return {String} Возвращаемое значение куки
     */
    Common.prototype.getCookie = function( name ) {
        return $.cookie( name );
    };

    /**
     * Удалит cookie
     * @param  {String} name Наименование куки
     * @return {Boolean}     Вернет true, если куки не существует
     */
    Common.prototype.removeCookie = function( name ) {
        return $.removeCookie( name, {
            domain : Site.Config.cookieDomain,
            path   : '/',
        } );
    };

    /**
     * Вернет get-параметр текущей страницы, либо null
     * @method getUrlParamByName
     * @for Common
     * @param  {String} name Имя параметра, значение которого нужно вернуть
     * @return {String} Значение заданного параметра, либо null
     */
    Common.prototype.getUrlParamByName = function( name ) {
        var params = getUrlParams();

        return params[name] || null;
    };

    /**
     * Удалит свою куку, если она не является последней установленной.
     * Если в текущем запросе была установлена хотя бы одна кука cpa - остальные
     * удаляются. Если в текущем запросе кука cpa не ставилась - остальные остаются.
     * Необходимо для того, чтобы небыло одновременной генерации пикселей
     * для нескольких cpa
     */
    Common.prototype.removeCrossCookie = function() {
        var lastUpdatedCookie = Site.App.CpaPartners.lastUpdatedCookie;

        if ( lastUpdatedCookie != null && this.cookieName != lastUpdatedCookie ) {
            this.removeCookie( this.cookieName );
        }
    };

    /**
     * Проверка наличия cpa-параметров в url и их сохранение в cookie
     * @method checkCookieAndSave
     * @for Common
     */
    Common.prototype.checkCookieAndSave = function() {
        var urlParam = this.getUrlParamByName( this.urlParameter ),
            utm_source = this.getUrlParamByName('utm_source');

        if ( urlParam && utm_source == this.utmSourceName ) {
            this.setCookie( this.cookieName, urlParam );

            Site.App.CpaPartners.lastUpdatedCookie = this.cookieName;
        }
    };

    Common.prototype.addForRender = function( str ) {
        Site.App.CpaPartners.Main.pixelString += str;
    };

    /**
     * Вернет get-параметры страницы в виде объекта
     * @static
     * @method getUrlParams
     * @for Common
     * @return {Object} get-параметры текущей страницы
     */
    function getUrlParams() {
        return _.chain( location.search.slice( 1 ).split('&') )
            .map( function( item ) {
                if ( item ) {
                    return item.split('=');
                }
            } )
            .compact()
            .object()
            .value();
    }

    Site.App.CpaPartners.Common = Common;

} )();

