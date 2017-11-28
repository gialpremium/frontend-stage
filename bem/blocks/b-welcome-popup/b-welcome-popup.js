
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Набор вьюх
 * @submodule Site.App.Views
 */

Site.namespace('Site.App.Views.WelcomePopup');

( function() {

    /**
     * Хранит синглтон WelcomePopup
     * @private
     */
    var _welcomePopupSingleton = null;

    /**
     * Класс приветственного окна для вновь зарегистрированного пользователя
     * @class WelcomePopup
     * @constructor
     * @param {Recaptcha} recaptcha Экземпляр класса Recaptcha
     */
    function WelcomePopup() {}

    /**
     * Возвращает синглтон WelcomePopup
     * @static
     * @method getInstance
     * @for WelcomePopup
     * @return {Object} Синглтон класса WelcomePopup
     */
    WelcomePopup.getInstance = function() {
        if ( !_welcomePopupSingleton ) {
            _welcomePopupSingleton = new WelcomePopup();
        }

        return _welcomePopupSingleton;
    };

    /**
     * Создает на странице блок в котором будет размещен приветственный попап.
     * @param  {Object} options Набор опций для попапа
     * @method init
     * @for WelcomePopup
     */
    WelcomePopup.prototype.init = function( options ) {
        this.options = options;
        this.$popup = $('<div class="b-welcome-popup">');
        $('body').append( this.$popup );
    };

    /**
     * Инициализирует отработчики на попапе
     * @method initHandlers
     * @for WelcomePopup
     */
    WelcomePopup.prototype.initHandlers = function() {
        this.$popup.on( 'click', '.b-welcome-popup__btn', this.hide.bind( this ) );
    };

    /**
     * Добавит попап на страницу, покажет его и активирует обработчики
     * @method show
     * @for WelcomePopup
     */
    WelcomePopup.prototype.show = function() {
        this.$popup.html( require('./b-welcome-popup.jade')( this.options ) );
        this.initHandlers();
    };

    /**
     * Удалит поап со страницы
     * @method hide
     * @for WelcomePopup
     */
    WelcomePopup.prototype.hide = function() {
        this.$popup.find('.b-popup').remove();
    };

    /**
     * Обработчик клика по кнопке "Продолжить" на приветственном попапе.
     * @method handleClickContinueBtn
     * @for WelcomePopup
     */
    WelcomePopup.prototype.handleClickContinueBtn = function() {
        if ( document.location.pathname == '/' ) {
            showLoader();

            // Редирект на страницу с вводом кодового слова
            document.location.href = '/user';
        }
        else {
            this.hide();
        }
    };


    /**
     * Покажет лоадер на попапе
     * @private
     * @static
     * @method showLoader
     * @for WelcomePopup
     */
    function showLoader() {
        var $loading = JST['b-loading']( {
            wrapped : true,
            bgColor : 'invert',
        } );

        $('.b-welcome-popup__window').prepend( $loading );
    }

    Site.App.Views.WelcomePopup = { getInstance: WelcomePopup.getInstance };

} )();
