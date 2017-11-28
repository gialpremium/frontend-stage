( function( $ ) {
    $.fn.bPopupNotice = function() {
        return this.each( function() {
            var $popup = $( this ),
                $popupClose = $( '.b-popup-notice__close', $popup );

            if ( $popupClose.length ) {
                $popupClose.on( 'click', function() {
                    $popup.slideUp();

                    return false;
                } );
            }
        } );
    };

    // init
    $( function() {
        $('.b-popup-notice').bPopupNotice();
    } );
} )( jQuery );
