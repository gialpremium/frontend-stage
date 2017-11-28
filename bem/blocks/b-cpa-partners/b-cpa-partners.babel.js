
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Объект. Содержит классы для работы с различными партнерскими сервисами
 * @submodule Site.App.CpaPartners
 */
Site.namespace('Site.App.CpaPartners.Main');
Site.namespace('Site.App.CpaPartners.lastUpdatedCookie');

Site.App.CpaPartners.lastUpdatedCookie = null;

( function() {

    Site.App.CpaPartners.Main = {

        /**
         * В эту строку конкатенируются все пиксели, которые нужно отрендерить.
         * Когда все пиксели будут готовы - строка рендерится в DOM
         * @type {String}
         */
        pixelString : '',

        /**
         * Массив методов от класса каждой партнерской сети.
         * Методы проверяют наличие url-параметров своей партнерской сети.
         * @type {Array}
         */
        urlCheckMethods : [],

        /**
         * Массив методов от класса каждой партнерской сети.
         * Каждый метод готовит код своего пиксела к добавлению на страницу.
         * @type {Array}
         */
        preparePixelsMethods : [],

        /**
         * Массив методов от класса каждой партнерской сети.
         * Каждый метод удалит куки своей cpa, если эта кука была создана не в последнюю очередь
         * @type {Array}
         */
        removeCrossCookieMethods : [],

        /**
         * Массив функций, выполняющихся после рендера пикселей
         *
         * @type {Array.<Function>}
         */
        afterRenderFunctions : [],

        /**
         * Рендер пикселей на странице
         */
        renderAllPixels( options ) {
            let prefix = '<div class="b-cpa-partners">',
                postfix = '</div>',
                renderString = this.preparePixelsForRender( options );

            if ( !renderString ) {
                return;
            }

            $('body').prepend( prefix + renderString + postfix );
            this.afterRender( options );
        },

        /**
         * Проверка url-параметров и сохранение их в куки для всех подписанных на это действие cpa
         */
        checkAllCpaCookieAndSave() {
            Site.App.CpaPartners.Main.urlCheckMethods.forEach( function( run ) {
                run();
            } );
        },

        /**
         * Если были установлены куки для нескольких партнерок, то удалит все
         * кроме последней установленой.
         * Необходимо для того, чтобы небыло одновременной генерации пикселей
         * для нескольких cpa
         */
        removeCrossCookies() {
            Site.App.CpaPartners.Main.removeCrossCookieMethods.forEach( function( run ) {
                run();
            } );
        },

        /**
         * Генерация пикселей на основе данных и подготовка к рендеру
         * @param  {Object} options Информация о прошедшей транзакции и пользователе.
         */
        preparePixelsForRender( options ) {
            if ( !Site.Config.Flags.transactionCommitted ) {
                return '';
            }

            this.preparePixelsMethods.forEach( function( run ) {
                run( options );
            } );

            return this.pixelString;
        },

        afterRender( options ) {
            for ( let next of this.afterRenderFunctions ) {
                next( options );
            }
        },
    };

} )();
