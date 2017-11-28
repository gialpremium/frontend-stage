
/**
 * Глобальная область видимости window
 * @module window
 */

// INFO: Loader является модулем общего назначения и будет перенесен из Site.App.Auth,
// когда будет решено где хранить модули такого типа
/**
 * Набор классов, реализующих форму регистрации/авторизации
 * @submodule Site.App.Auth
 */

Site.namespace('Site.App.Auth.Modules.Loader');

( function() {

    /**
     * Модуль загрузчика файлов
     * @class Loader
     * @constructor
     */
    function Loader() {
        return this;
    }

    /**
     * Загружает на страницу скрипт из указанного url
     * @for Loader
     * @method load
     * @param {String} url Путь скрипта, который нужно загрузить
     * @return {Promise}
     */
    Loader.prototype.load = function( url ) {
        return $.ajax( {
            url      : url,
            charset  : 'utf-8',
            dataType : 'script',
            cache    : true,
        } );
    };

    /**
     * Кастомный загрузчик для отладки скриптов.
     * @for Loader
     * @method customLoad
     * @param {String} src Путь скрипта, который нужно загрузить
     */
    Loader.prototype.customLoad = function( src ) {
        var scriptState = $.Deferred();
        var script;
        var pendingScripts = [];
        var firstScript = document.scripts[0];

        if ( 'async' in firstScript ) {

            // modern browsers
            script = document.createElement('script');
            script.charset = 'utf-8';
            script.onload = onLoadHandler;
            script.async = false;
            script.src = src;
            document.head.appendChild( script );
        }
        else if ( firstScript.readyState ) {

            // IE<10
            script = document.createElement('script');
            script.charset = 'utf-8';
            pendingScripts.push( script );
            script.onreadystatechange = stateChange;
            script.onload = onLoadHandler;
            script.src = src;
        }
        else {

            // fall back to defer
            document.write( '<script src="' + src + '" charset="utf-8" defer></script>' );
        }

        function onLoadHandler() {
            scriptState.resolve();
        }

        // Watch scripts load in IE
        function stateChange() {
            var pendingScript;

            while ( pendingScripts[0] && pendingScripts[0].readyState == 'loaded' ) {
                pendingScript = pendingScripts.shift();
                pendingScript.onreadystatechange = null;
                firstScript.parentNode.insertBefore( pendingScript, firstScript );
            }
        }

        return scriptState.promise();
    };

    Site.App.Auth.Modules.Loader = Loader;

} )();
