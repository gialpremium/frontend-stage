Site.Analytics.EventHandlers.ecommerce = function( $trigger ) {

    var d = $.Deferred(),
        ec_id,
        product;

    if ( !Site.Analytics.IsEnabled.ecommerce ) {
        return d.reject().promise();
    }

    ec_id = $trigger.data('ecommerce-id');
    product = Site.Analytics.Ecommerce.addProduct[ec_id];

    if ( product ) {
        ga( 'ec:addProduct', product );
        ga( 'ec:setAction', 'click', { list: product.list } );

        ga( 'send', 'event', 'eec', 'click', 'Choose', {
            hitCallback : function() {
                var ecommerceStorage = new Storage( { prefix: 'ecommerce_' } );

                ecommerceStorage.remove('addProduct');
                d.resolve();
            }, 
        } );
    }
    else {
        d.reject();
    }

    return d.promise();
};
