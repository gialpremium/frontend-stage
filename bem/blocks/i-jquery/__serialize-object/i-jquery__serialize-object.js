/**
 * пара слов о сериализация объекта
 * @class serializeObject
 * @submodule $.fn
 * @static
 */
$.fn.serializeObject = $.fn.serializeObject || function( serializedArray ) {
    var o = {},
        a = serializedArray || this.serializeArray();

    $.each( a, function() {
        if ( o[this.name] !== undefined ) {
            if ( !o[this.name].push ) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push( this.value || '' );
        }
        else {
            o[this.name] = this.value || '';
        }
    } );

    return o;
};
