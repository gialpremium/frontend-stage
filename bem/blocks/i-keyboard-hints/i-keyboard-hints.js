
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Набор классов, реализующих форму регистрации/авторизации
 * @submodule Site.App.Auth
 */

Site.namespace('Site.App.Auth.Modules.KeyboardHints');

( function() {

/*
    var keyboard = new KeyboardHints();

    keyboard.spyInput($('#my_input'));

    keyboard.isPressCapsLock()
    keyboard.isEngTranslation()
    keyboard.isRusTranslation()
*/

    var KEYCODE_SPACE = 32,
        KEYCODE_CAPSLOCK = 20;

    /**
     * Текущее состояние CapsLock
     *  - null : неизвестно
     *  - true/false : CapsLock включен/выключен
     *  @type {Boolean}
     */
    var _capsLockState,

        /**
     * Состояние раскладки клавиатуры относительно латиницы
     * - null : неизвестно
     * - true/false : латиница/не латиница
     * @type {Boolean}
     */
        _engTranslation,

        /**
     * Состояние раскладки клавиатуры относительно кириллицы
     * - null : неизвестно
     * - true/false : кириллица/не кириллица
     * @type {Boolean}
     */
        _rusTranslation;

    /**
     * Регулярки для проверки вхождения символов в кириллицу
     * @type {RegExp}
     */
    var _rusRegexp = /[А-Яа-я]+/,

        /**
     * Регулярка для проверки вхождения символов в латиницу
     * @type {RegExp}
     */
        _engRegexp = /[A-Za-z]+/;

    /**
     * Класс для сбора данных о пользовательском вводе
     * @class KeyboardHints
     * @constructor
     */
    function KeyboardHints() {}

    /**
     * Возьмет информацию о нажатой клавише из события
     * @private
     * @param  {Object} event Событие клавиатуры
     * @method getChar
     * @for KeyboardHints
     * @return {String} Символ, соответствующий нажатой клавише, либо null
     */
    function getChar( event ) {
        if ( event.which == null ) {
            if ( event.keyCode < KEYCODE_SPACE ) {
                return null;
            }

            return String.fromCharCode( event.keyCode ); // IE
        }

        if ( event.which != 0 && event.charCode != 0 ) {
            if ( event.which < KEYCODE_SPACE ) {
                return null;
            }

            return String.fromCharCode( event.which ); // остальные
        }

        return null; // специальная клавиша
    }

    function resetHints() {
        _capsLockState = null;
        _engTranslation = null;
        _rusTranslation = null;
    }

    KeyboardHints.prototype.spyInput = function( $input ) {
        var input = $input.get( 0 ),
            lastCapsState = false;

        resetHints();

        // На linux/mac системах есть баг с CapsLock. События могут генерироваться неоднократно.
        // По 2-3 раза при нажатии на caps и еще раз при нажатии на любой символ после CapsLock.
        // Поэтому запоминаем последнее состояние caps в lastCapsState и ориентируемся на него при последующих
        // нажатиях Caps в onkeydown.
        // В Windows все работает корректно. Проблема только в linux/mac.
        // Библиотеки типа jquery.hotkeys и keymaster.js проблему не решают
        if ( input ) {
            input.onkeydown = function( e ) {
                var event = e || window.event || {};

                if ( event && event.keyCode === KEYCODE_CAPSLOCK ) {
                    _capsLockState = !lastCapsState;
                }
            };
            input.onkeypress = function( e ) {
                var event = e || window.event || {};
                var chr = getChar( event );

                if ( !chr ) {
                    return;
                }

                if ( chr.toLowerCase() == chr.toUpperCase() ) {
                    return;
                }

                if ( chr.toLowerCase() == chr ) {
                    lastCapsState = _capsLockState = e.shiftKey;
                }

                if ( chr.toUpperCase() == chr ) {
                    lastCapsState = _capsLockState = !e.shiftKey;
                }

                _engTranslation = _engRegexp.test( chr );
                _rusTranslation = _rusRegexp.test( chr );
            };
        }
    };

    /**
     * Определяет нажат CapsLock или нет.
     * @method isPressCapsLock
     * @for KeyboardHints
     * @return {Boolean} true - CapsLock нажат, false - нет.
     */
    KeyboardHints.prototype.isPressCapsLock = function() {
        return _capsLockState;
    };

    /**
     * Определяет является ли текущая раскладка латиницей.
     * @method isEngTranslation
     * @for KeyboardHints
     * @return {Boolean} Текущая раскладка: true - латиница, false - нет.
     */
    KeyboardHints.prototype.isEngTranslation = function() {
        return _engTranslation;
    };

    /**
     * Определяет является ли текущая раскладка кириллицей.
     * @method isRusTranslation
     * @for KeyboardHints
     * @return {Boolean} Текущая раскладка: true - кириллица, false - нет.
     */
    KeyboardHints.prototype.isRusTranslation = function() {
        return _rusTranslation;
    };

    Site.App.Auth.Modules.KeyboardHints = KeyboardHints;

} )();
