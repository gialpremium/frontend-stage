
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Набор вьюх
 * @submodule Site.App.Views
 */

Site.namespace('Site.App.Views.ConfirmationEmail');

( function() {

    /**
     * Хранит синглтон ConfirmationEmail
     * @private
     */
    var _ConfirmationEmailSingleton = null,
        responseValidator = Site.App.Auth.Modules.ResponseValidator;

    /**
     * Окно подтверждения email после регистрации
     * @class ConfirmationEmail
     * @constructor
     */
    function ConfirmationEmail() {}

    /**
     * Возвращает синглтон ConfirmationEmail
     * @static
     * @method getInstance
     * @for ConfirmationEmail
     * @return {Object} Экземпляр класса ConfirmationEmail
     */
    ConfirmationEmail.getInstance = function() {
        if ( !_ConfirmationEmailSingleton ) {
            _ConfirmationEmailSingleton = new ConfirmationEmail();
        }

        return _ConfirmationEmailSingleton;
    };

    /**
     * Старт модуля
     * @method init
     * @for ConfirmationEmail
     * @return {Object} Promise-состояние отправки email со ссылкой подтверждения. (Отправлено успешно|не успешно)
     */
    ConfirmationEmail.prototype.init = function() {
        var $popup = $('.b-confirmation-email');

        if ( $popup.length ) {
            this.$popup = $popup;
        }
        else {
            this.$popup = $('<div class="b-confirmation-email">');
            $('body').append( this.$popup );
        }
        this.initHandlers();

        return this.show();
    };

    /**
     * Инициализирует обработчики
     * @method initHandlers
     * @for ConfirmationEmail
     */
    ConfirmationEmail.prototype.initHandlers = function() {
        this.$popup
            .off('click')
            .on( 'click', '.b-confirmation-email__confirm-btn', this.handleClickConfirmBtn.bind( this ) );
    };

    /**
     * Обработчик клика по кнопке "Отправить email со ссылкой подтверждения".
     * Дергает ajax-action, который отправляет email пользователю.
     *
     * @method handleClickConfirmBtn
     * @for ConfirmationEmail
     */
    ConfirmationEmail.prototype.handleClickConfirmBtn = function() {
        var self = this;

        showLoader();

        // Запрашиваем ссылку подтверждения на email
        sendConfirmationRequest( { url: '/user/resend_confirmation_letter' } )
            .done( this.confirmationRequestDone.bind( this ) )
            .fail( function( data ) {
                self.defer.reject( data );
            } );
    };

    /**
     * Обработчик запроса на отправку email.
     * @param  {Object} data Ответ сервера
     * @method confirmationRequestDone
     * @for ConfirmationEmail
     */
    ConfirmationEmail.prototype.confirmationRequestDone = function( data ) {
        var response = responseValidator.create( data ),
            message = null;

        if ( response.isSuccessful() ) {

            // Выводим сообщения
            message = response.getMessageByCode('EMAIL_CONFIRMAION_TOKEN_WAS_SENT');
            if ( message ) {
                showMessage( message );
            }
            this.defer.resolve();
        }
        else {
            renderErrors( response.reduce( errorsReducer, [] ) );
        }
        hideLoader();
    };

    /**
     * Отрисует попап в заранее заготовленный контейнер. Создаст и вернет promise-объект
     * @method show
     * @for ConfirmationEmail
     * @return {Object} Promise-состояние отправки email со ссылкой подтверждения. (Отправлено успешно|не успешно)
     */
    ConfirmationEmail.prototype.show = function() {
        this.defer = $.Deferred();
        this.$popup.html( require('./b-confirmation-email.jade')() );

        return this.defer.promise();
    };

    /**
     * Удалит попап со страницы
     * @method hide
     * @for ConfirmationEmail
     */
    ConfirmationEmail.prototype.hide = function() {
        this.$popup.find('.b-popup').remove();
    };

    /**
     * Отправит запрос с заданными опциями
     * @static
     * @private
     * @param  {Object} options Опции для отправки запроса
     * @method sendConfirmationRequest
     * @for ConfirmationEmail
     * @return {Object} jQuery-promise запроса
     */
    function sendConfirmationRequest( options ) {
        return $.ajax( {
            type : options.type || 'POST',
            url  : options.url,
            data : options.data || {},
        } );
    }

    /**
     * Покажет сообщение bMessage
     * @static
     * @private
     * @param  {Object} message Параметры сообщения
     * @method showMessage
     * @for ConfirmationEmail
     */
    function showMessage( message ) {
        $('.b-confirmation-email__message-item')
            .empty()
            .bMessage( message.text, 'done'/* message.type? */, '', { no_indent: 1 } );

        // TODO: Хак из-за предполагаемой ошибки в bem/blocks.guide/b-message/b-message.jade.
        // Там не регулируется наличие/отсутствия margin'a
        $('.b-confirmation-email__message-item .b-message').removeClass('l-margin_bottom-normal');
    }

    /**
     * Отрендерит ошибки в попапе
     * @static
     * @private
     * @param  {Array} errors Массив с ошибками
     * @method renderErrors
     * @for ConfirmationEmail
     */
    function renderErrors( errors ) {
        $('.b-confirmation-email__errors').empty().append( errors );
    }

    /**
     * Функция-reducer массива сообщений в массив ошибок
     * @static
     * @private
     * @param  {Array} prev    Предыдущий результат выполнения функции
     * @param  {Object} current Очередной элемент исходного массива
     * @method errorsReducer
     * @for ConfirmationEmail
     * @return {Array} Результат очередной итерации преобразования
     */
    function errorsReducer( prev, current ) {

        // TODO: Нет уверенности, что сервер присылает корректный тип для ошибок.
        // Возможно следует фильтровать не по error. Уточнить.
        if ( current.type == 'error' ) {
            prev.push( $( '<div class="b-confirmation-email__error-item">' + current.text + '</div>' ) );
        }

        return prev;
    }

    /**
     * Покажет лоадер на попапе
     * @static
     * @private
     * @method showLoader
     * @for ConfirmationEmail
     */
    function showLoader() {
        var $loading = JST['b-loading']( {
            wrapped : true,
            bgColor : 'invert',
        } );

        $('.b-confirmation-email__window').prepend( $loading );
    }

    /**
     * Скроет лоадер
     * @static
     * @private
     * @method hideLoader
     * @for ConfirmationEmail
     */
    function hideLoader() {
        $('.b-loading').remove();
    }

    Site.App.Views.ConfirmationEmail = { getInstance: ConfirmationEmail.getInstance };

} )();

