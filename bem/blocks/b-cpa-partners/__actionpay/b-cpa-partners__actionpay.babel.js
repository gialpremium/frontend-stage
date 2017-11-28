
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * @submodule Site.App.CpaPartners.Actionpay
 */

Site.namespace('Site.App.CpaPartners.Actionpay');

( function() {

    /**
     * ID цели в системе actionpay
     */
    const ACTIONPAY_TARGET = 10942,
        ACTIONPAY_STORAGE_KEY = 'actionpay_last_bill',
        OMITTED_USERS = [
            '_ANON_PROLONG_',
        ],
        CpaPartners = Site.App.CpaPartners;

    let _actionpaySingleton = null,
        actionpayInstance;

    /**
     * @class Actionpay
     * @constructor
     * @extends Common
     * Класс для работы с сетью Actionpay
     */
    class Actionpay extends CpaPartners.Common {
        constructor() {
            super();

            /**
             * url-параметр с id пользователя, который будет сохранен в cookie
             * @type {String}
             */
            this.urlParameter = 'actionpay';

            /**
             * Наименование cookie-пареметра в котором хранится идентификатор пользователя
             * @type {String}
             */
            this.cookieName = 'actionpay';

            /**
             * Наименовние url-параметра utm_source при котором сохраняем данные о партнерской сети из url в cookie
             * @type {String}
             */
            this.utmSourceName = 'actionpay';
        }

        /**
         * Формируем пиксель и сохраняем для дальнейшего рендера
         */
        prepareForRender( options ) {
            let cookieValue,
                billId = options.bill_id,
                lastNotifiedBill = window.localStorage.getItem( ACTIONPAY_STORAGE_KEY );

            if ( ~OMITTED_USERS.indexOf( options.login ) ) {
                return '';
            }

            if ( lastNotifiedBill === billId ) {
                return '';
            }

            cookieValue = this.getCookie( this.cookieName );

            if ( !cookieValue ) {
                return '';
            }

            this.addForRender( `<img src="https://apypx.com/ok/${ACTIONPAY_TARGET}.png?actionpay=${cookieValue}&apid=${billId}&price=${options.payment}" height="1" width="1" />` );
        }

        afterRender( options ) {
            window.localStorage.setItem( ACTIONPAY_STORAGE_KEY, options.bill_id );
        }
    }

    CpaPartners.Actionpay = {
        getInstance() {
            if ( !_actionpaySingleton ) {
                _actionpaySingleton = new Actionpay();
            }

            return _actionpaySingleton;
        },
    };

    /**
     * Подписываем все необходимые методы в очереди на выполнение
     */

    actionpayInstance = Site.App.CpaPartners.Actionpay.getInstance();

    // метод проверки url-параметров
    Site.App.CpaPartners.Main.urlCheckMethods.push( actionpayInstance.checkCookieAndSave.bind( actionpayInstance ) );

    // Метод для удаления собственных кук
    CpaPartners.Main.removeCrossCookieMethods
        .push( actionpayInstance.removeCrossCookie.bind( actionpayInstance ) );

    // метод подготовки пикселя к рендеру на странице
    CpaPartners.Main.preparePixelsMethods.push( function( options ) {
        if ( options.availability.actionpay ) {
            actionpayInstance.prepareForRender.call( actionpayInstance, options );
        }
    } );

    CpaPartners.Main.afterRenderFunctions.push( actionpayInstance.afterRender );

} )();

