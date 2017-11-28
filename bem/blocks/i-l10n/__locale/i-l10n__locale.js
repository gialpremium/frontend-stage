/* eslint-disable */
window.locale = window.locale || {};

if ( window.ru ) {

    window.locale.roundPrice = function( price ) {
        return Math.round( price );
    };

    window.locale.formatPrice = function( price, currency, round ) {
        price = price * 1;

        if ( round ) {
            price = window.locale.roundPrice( price );
        }

        price = price.toString().replace(
            /(\d)(?=(\d\d\d)+([^\d]|$))/g,
            '$1&nbsp;'
        );
        if ( currency ) {
            price = price + '&nbsp;р.';
        }

        return price;
    };

}
else {

    window.locale.roundPrice = function( price ) {
        return parseFloat( price ).toFixed( 2 );
    };

    window.locale.formatPrice = function( price, currency, round ) {
        price = price * 1;

        if ( round ) {
            price = window.locale.roundPrice( price );
        }

        price = price.toString().replace(
            /(\d)(?=(\d\d\d)+([^\d]|$))/g,
            '$1,'
        );
        if ( currency ) {
            price = '$' + price;
        }

        return price;
    };

}
