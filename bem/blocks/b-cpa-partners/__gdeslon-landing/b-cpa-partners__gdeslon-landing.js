
/**
 * GdeslonLanding активирует cpa-трекер для gdeslon.ru
 */
Site.namespace('Site.App.CpaPartners.GdeslonLanding');

( function() {
    var MERCHANT_ID = null,
        _gdeslonLandingSingleton = null;

    function GdeslonLanding() {}

    /**
     * Запуск кода
     */
    GdeslonLanding.prototype.exec = function() {
        var createEl = function( params ) {
                var mode = 'mode=' + params.mode,
                    catId = 'cat_id=' + params.cat_id,
                    orderId = 'order_id=' + params.order_id,
                    codesLn = params.codes.length,
                    codes = '',
                    el,
                    path,
                    query;

                if ( codesLn ) {
                    codes = 'codes=' + params.codes.map( function( item ) {
                        return item.id + ':' + item.price;
                    } ).join(',');
                }

                el = document.createElement('script');
                path = 'https://www.gdeslon.ru/landing.js?';
                query = mode
                    + ( codesLn ? '&' + codes : '' )
                    + ( params.cat_id ? '&' + catId : '' )
                    + ( params.order_id ? '&' + orderId : '' )
                    + '&mid=' + MERCHANT_ID;

                el.src = path + query;

                return el;
            },
            body = document.getElementsByTagName('body')[0];

        body.appendChild( createEl( this.data ) );
    };

    GdeslonLanding.prototype.setData = function( data ) {
        this.data = this.data || {};
        Object.assign( this.data, data );
    };

    GdeslonLanding.prototype.setMerchantId = function( merchantId ) {
        MERCHANT_ID = merchantId;
    };

    Site.App.CpaPartners.GdeslonLanding = {
        getInstance : function() {
            if ( !_gdeslonLandingSingleton ) {
                _gdeslonLandingSingleton = new GdeslonLanding();
            }

            return _gdeslonLandingSingleton;
        }, 
    };

} )();
