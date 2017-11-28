/**
 * Глобальная область видимости window
 * @module window
 */

// INFO: Recaptcha является модулем общего назначения и будет перенесен из Site.App.Auth,
// когда будет решено где хранить модули такого типа

/**
 * Набор классов, реализующих форму регистрации/авторизации
 * @submodule Site.App.Auth
 */

Site.namespace('Site.App.Auth.Modules.Recaptcha');

( function() {

    /**
     * Модуль для работы с reCAPTCHA
     * https://developers.google.com/recaptcha/docs/display
     * @class Recaptcha
     * @constructor
     * @example
        var recaptcha = new Site.App.Auth.Modules.Recaptcha();
        recaptcha.state.fail( function () {
            // Срабатывает когда невозможно загрузить капчу
        } );
        recaptcha.options( {

            callback : function () {
                // Срабатывает, когда пользователь успешно ввел капчу
            },

            // Задаем класс, который применяется когда происходит вызов show() для капчи
            displayClassName : 'b-recaptcha_display_inline-block',

        } );

        // Восстановить состояние текущего инстанса для повторного рендера
        recaptcha.restore();

        // Проверяем видимость капчи
        if (recaptcha.isShown()) { ... }

        recaptcha
            // Загрузка
            .load()
            // Рендер капчи (указываем идентификатор!)
            .renderTo('auth-recaptcha')
            // Показать капчу
            .show()
            // Скрыть капчу
            .hide();

     *
     */

    /* global grecaptcha */
    function Recaptcha() {

        /**
             * Таймаут в течение которого ожидается загрузка скриптов рекапчи.
             * Если скрипты в течение указанного времени не загружены - состояние капчи переводится в Reject
             * @type {Number}
             */
        var LOAD_SCRIPT_TIMEOUT = 6000,

            /**
             * Deferred-состояние загрузки капчи
             * @attribute captchaState
             * @for Recaptcha
             * @type {Promise}
             */
            captchaState = $.Deferred(),

            /**
             * Идентификатор контейнера в котором будет размещен виджет капчи
             * @attribute $captchaContainer
             * @for Recaptcha
             * @type {String}
             */
            $captchaContainer = null,

            /**
             * Состояние видимости элемента с капчей.
             * true - видимый, false - скрыт
             * @attribute isShown
             * @for Recaptcha
             * @type {Boolean}
             */
            isShown = false,

            /**
             * Состояние капчи. Загружена или нет
             * @attribute isLoaded
             * @for Recaptcha
             * @type {Boolean}
             */
            isLoaded = false,

            /**
             * Идентификатор экземпляра капчи. Может быть использован для сброса капчи
             * @attribute captchaInstanceId
             * @for Recaptcha
             * @type {String}
             */
            captchaInstanceId = null,

            /**
             * Идентификатор контейнера, в котором будет размещена капча
             * @attribute captchaContainerId
             * @for Recaptcha
             * @type {String}
             */
            captchaContainerId = null,

            /**
             * Объект опций для капчи.
             * По умолчанию содержит sitekey. Может быть перезаписан методом options()
             * @attribute captchaOpts
             * @for Recaptcha
             * @type {Object}
             */
            captchaOpts = {
                sitekey : Site.Config.Recaptcha.Key,

                /**
                 * Класс для управления отображением контейнера капчи. Добавляется к
                 * контейнеру капчи каждый раз при вызове show() и удаляется при вызове hide()
                 * @type {String}
                 */
                displayClassName : 'b-recaptcha_display_block',

                /**
                 * Коллбек будет вызван при успешном прохождении капчи
                 */
                callback : function() {},
            };


        /**
         * Публичное deferred-состояние загрузки капчи
         * @property state
         * @for Recaptcha
         * @type {Promise}
         */
        this.state = captchaState.promise();

        /**
         * Загрузит скрипт капчи на страницу
         * @method load
         * @for Recaptcha
         * @chainable
         */
        this.load = function() {
            if ( !this.isLoaded() ) {
                loadCaptchaScript();
            }

            return this;
        };

        /**
         * Метод позволяет задать опции для капчи. Вызывать до метода renderTo
         * @method options
         * @for Recaptcha
         * @param  {Object} opts Объект с опциями
         * @chainable
         */
        this.options = function( opts ) {
            captchaOpts = $.extend( captchaOpts, opts );

            return this;
        };

        /**
         * Если текущая капча еще не создавалась, то отрендерит виджет капчи на страницу в
         * указанный контейнер. Иначе пересоздаст капчу на основе captchaInstanceId
         * @method renderTo
         * @for Recaptcha
         * @param  {String} containerId Идентификатор контейнера, где должна быть размещена капча
         * @chainable
         */
        this.renderTo = function( containerId ) {
            captchaContainerId = containerId;
            $captchaContainer = $( '#' + captchaContainerId );
            this.show();
            if ( captchaInstanceId === null ) {
                render();
            }
            else {
                reset();
            }

            return this;
        };

        /**
         * Покажет контейнер с капчей на странице
         * @method show
         * @for Recaptcha
         * @chainable
         */
        this.show = function() {
            $captchaContainer.addClass( captchaOpts.displayClassName );
            isShown = true;

            return this;
        };

        /**
         * Скроет контейнер капчи со страницы
         * @method hide
         * @for Recaptcha
         * @chainable
         */
        this.hide = function() {
            $captchaContainer.removeClass( captchaOpts.displayClassName );
            isShown = false;

            return this;
        };

        /**
         * Проверит виден или скрыт контейнер с капчей
         * @method isShown
         * @for Recaptcha
         * @return {Boolean}
         */
        this.isShown = function() {
            return isShown;
        };

        /**
         * Вернет состояние загрузки скрипта
         * @method isLoaded
         * @for Recaptcha
         * @return {Boolean} true|false
         */
        this.isLoaded = function() {
            return isLoaded;
        };

        /**
         * Восстановит состояние текущего инстанса для повторного рендера.
         * Нужно вызвать когда DOM-элемент, с которым связан текущий инстанс капчи,
         * удаляется со страницы, иначе после повторного рендера того же элемента, в
         * текущем инстансе будет вызываться reset вместо рендер и капча не будет отрендерена.
         * @method restore
         * @for Recaptcha
         * @chainable
         */
        this.restore = function() {
            captchaInstanceId = null;

            return this;
        };

        /**
         * Рендерит виджет капчи на страницу в заданный контейнер (captchaContainerId)
         * @method render
         * @for Recaptcha
         */
        function render() {
            $.when( captchaState ).then( function() {
                captchaInstanceId = grecaptcha.render( captchaContainerId, captchaOpts );
            } );
        }

        /**
         * Пересоздаст виджет капчи по известному ID (captchaInstanceId)
         * @method reset
         * @for Recaptcha
         */
        function reset() {
            $.when( captchaState ).then( function() {
                grecaptcha.reset( captchaInstanceId );
            } );
        }

        /**
         * Загрузит скрипт капчи на страницу и оповестит об этом промис
         * @method loadCaptchaScript
         * @for Recaptcha
         */
        function loadCaptchaScript() {
            var loader = new Site.App.Auth.Modules.Loader(),
                loadState = false;

            setTimeout( function() {
                if ( loadState != true ) {
                    captchaState.reject('load fail');
                }
            }, LOAD_SCRIPT_TIMEOUT );

            // INFO: В гугловых скриптах явно выполняется вызов window['fnName'], поэтому
            // namespace в onload никак не передать
            // https://code.google.com/p/recaptcha/issues/detail?id=232
            loader.load(
                'https://www.google.com/recaptcha/api.js?hl='
                + lang
                + '&render=explicit&onload=captchaMainResolveCallback'
            )

            // Если домен не доступен и скрипт не загружен - fail-коллбек не выполняется,
            // поэтому изворачиваемся при помощи дополнительных флагов и setTimeout
                .done( function( jqXHR, textStatus ) {
                    if ( textStatus == 'success' ) {
                        loadState = true;
                    }
                } );
        }

        /**
         * OnLoad-callback для рекапчи. Будет вызван после загрузки и инициализации рекапчи.
         * @method captchaResolveCallback
         * @for Recaptcha
         */
        function captchaResolveCallback() {
            isLoaded = true;
            captchaState.resolve();
        }

        /**
         * OnLoad-callback для рекапчи. Будет вызван после загрузки и инициализации рекапчи.
         * Активирует все экземпляры капчи на странице, в том числе свой. После активации всех
         * экземпляров капчи, удалит себя из window.
         * @method mainResolveCallback
         * @for Recaptcha
         */
        function mainResolveCallback() {
            var cmrc = window.captchaMainResolveCallback,
                callbackList,
                ln,
                i;

            if ( cmrc && cmrc.resolveCallbacksList ) {
                callbackList = cmrc.resolveCallbacksList;
                ln = callbackList.length;

                for ( i = 0; i < ln; i++ ) {
                    callbackList[i]();
                }

                try {
                    delete window.captchaMainResolveCallback;
                }
                catch ( e ) {
                    window.captchaMainResolveCallback = undefined;
                }
            }
            captchaResolveCallback();
        }

        /**
         * Добавит OnLoad callback для рекапчи в window, если он отсутствует. Так же создаст
         * список resolve-методов для всех экземпляров капчи, которые могут быть созданы на странице.
         * @method captchaResolveCreator
         * @for Recaptcha
         */
        function captchaResolveCreator() {
            if ( !window.captchaMainResolveCallback ) {
                mainResolveCallback.resolveCallbacksList = [];
                window.captchaMainResolveCallback = mainResolveCallback;
            }
            else {
                window.captchaMainResolveCallback.resolveCallbacksList.push( captchaResolveCallback );
            }
        }

        captchaResolveCreator();

        return this;
    }

    Site.App.Auth.Modules.Recaptcha = Recaptcha;

} )();

