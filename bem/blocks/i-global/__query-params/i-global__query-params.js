/**
 * Преобразует строку с параметрами в объект, параметры санитизированы decodeURIComponent.
 * Если параметр не указан строка берётся из window.location.search
 * @method getQueryParams
 * @module window
 * @param  {string} queryString строка запроса вида ?param1=foo&param2=bar
 * @return {object}
 * @example
 *
 * var query = getQueryParams();
 * alert(query.foo);
 */
var getQueryParams = window.getQueryParams = function( queryString ) {

    var queryObject  = {},
        query        = queryString || window.location.search,
        vars         = query.substring( 1 ).split('&'),
        i,
        pair;

    for ( i = 0; i < vars.length; i++ ) {
        pair = vars[i].split('=');

        switch ( typeof queryObject[pair[0]] ) {
        case 'undefined' :
            queryObject[pair[0]] = decodeURIComponent( pair[1] );
            break;

        case 'string' :
            queryObject[pair[0]] = [ queryObject[ pair[0] ], decodeURIComponent( pair[1] ) ];
            break;

        default :
            queryObject[pair[0]].push( decodeURIComponent( pair[1] ) );
        }
    }

    return queryObject;
};

window.queryParams = getQueryParams();
