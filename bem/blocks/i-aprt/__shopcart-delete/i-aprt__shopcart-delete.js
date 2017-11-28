Site.namespace('Site.App.CpaPartners.APRT.Events');


Site.App.CpaPartners.APRT.Events = {
    initAprtEvents : function() {

    /**
     * Удаление товара из корзины
     */
        $( document ).on( 'shopcart-delete-item', function( e, deletedItemName ) {
            var aprtInstance = Site.App.CpaPartners.APRT.getInstance(),
                isCurrentItem = function( item ) {
                    return item.name === deletedItemName;
                },
                currentItem = ( aprtInstance.getData().basketProducts || [] ).filter( isCurrentItem )[0],
                currentProduct = _.pick( currentItem || {}, 'id', 'name', 'price' ),

                /**
             * Извещает aprt о том, что текущий вызов - это событие удаления элемента из корзины
             * @type {Number}
             */
                aprtPageType = 9;

            aprtInstance.sendAprt( {
                pageType       : aprtPageType,
                currentProduct : currentProduct,
            } );

        } );
    }, 
};
