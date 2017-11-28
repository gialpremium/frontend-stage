
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * @submodule Site.App.CpaPartners.Admitad
 */

/**
 * TODO: В данный момент вся работа с admitad происходит в перле
 * Здесь только установка/удаление кук, которые не позволяют пикселю admitad
 * пересекаться с пикселями других партнерок
 * **
 * Рендер пикселей admitad происходит в ТТ, а обработка различных
 * условий в perl: lib/FrontOffice/Model/Bill.pm::_process_admitad_pixel
 */
Site.namespace('Site.App.CpaPartners.Admitad');

( function() {

    /* global inherit */

    /**
     * Трекинг номер для advertise
     * @type {String}
     */
    var _admitadSingleton = null,
        admitadInstance;

    /**
     * @class Admitad
     * @constructor
     * @extends Common
     * Класс для работы с сетью Admitad
     */
    function Admitad() {

        /**
         * url-параметр с id пользователя, который будет сохранен в cookie
         * @type {String}
         */
        this.urlParameter = 'admitad_uid';

        /**
         * Наименование cookie-пареметра в котором хранится идентификатор пользователя
         * @type {String}
         */
        this.cookieName = 'admitad_uid';

        /**
         * Наименовние url-параметра utm_source при котором сохраняем данные о партнерской сети из url в cookie
         * @type {String}
         */
        this.utmSourceName = null;
    }

    inherit( Admitad, Site.App.CpaPartners.Common );

    /**
     * Переопределяем метод из Common для создания специфических проверок.
     * Проверка наличия cpa-параметров в url и их сохранение в cookie
     * @method checkCookieAndSave
     * @for Admitad
     */
    Admitad.prototype.checkCookieAndSave = function() {
        var urlParam = this.getUrlParamByName( this.urlParameter ),
            admitadRegexp = /^[a-f0-9]+$/;

        if ( urlParam && admitadRegexp.test( urlParam ) ) {
            this.setCookie( this.cookieName, urlParam );
            Site.App.CpaPartners.lastUpdatedCookie = this.cookieName;
        }
    };

    Site.App.CpaPartners.Admitad = {
        getInstance : function() {
            if ( !_admitadSingleton ) {
                _admitadSingleton = new Admitad();
            }

            return _admitadSingleton;
        }, 
    };

    /**
     * Подписываем все необходимые методы в очереди на выполнение
     */

    admitadInstance = Site.App.CpaPartners.Admitad.getInstance();

    // Метод для удаления собственных кук
    Site.App.CpaPartners.Main.removeCrossCookieMethods
        .push( admitadInstance.removeCrossCookie.bind( admitadInstance ) );

    // метод проверки url-параметров
    Site.App.CpaPartners.Main.urlCheckMethods
        .push( admitadInstance.checkCookieAndSave.bind( admitadInstance ) );

} )();
