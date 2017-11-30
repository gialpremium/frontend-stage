
/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Корневое пространство имен RegRu
 * @submodule Site
 */
( function() {

    window.Site = window.Site || {};

    /**
     * Метод для удобного создания неймспейсов.
     * @example
     *     Site.namespace('Site.App.Auth.AuthFormBlock');
     *     Site.namespace('Site.Config');
     * @param {String} ns Неймспейс, который нужно создать
     * @method namespace
     * @for Site
     */
    Site.namespace = function( ns ) {
        var pathItems = ns.split('.'),
            ln = pathItems.length - 1,
            parent = window,
            i;

        if ( arguments.length > 1 ) {
            console.warn( 'Внимание! Формат Site.namespace(path, value); не актуален.\n'
                        + 'Используйте Site.namespace(path); для объявления неймспейса!' );
        }

        for ( i = 0; i <= ln; i++ ) {

            // Это промежуточный элемент path и он отсутствует в род.объекте - добавим его как объект
            if ( !parent[pathItems[i]] ) {
                parent[pathItems[i]] = {};
            }

            // Перед переходом на следующий уровень вложенности текущий уровень делаем родительским
            parent = parent[pathItems[i]];
        }
    };

} )();

