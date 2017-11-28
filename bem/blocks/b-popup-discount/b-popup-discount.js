( function( $ ) {
    $.fn.popupDiscount = function() {
        var $toggle,
            $discountPopup,
            $discountPopupVisWrapper,
            toggleOffset,
            discountPopupW,
            discountPopupH,
            cssTop,
            cssLeft,
            visibleAreaWidth,
            visibleAreaHeight,
            dX,
            dY,
            visWrapperOffset,
            relativeX,
            relativeY,
            popupMargin = 15;

        this.each( function() {
            $( this ).on( 'mouseenter mousemove', function( e ) {

                if ( Site.App.isAdaptivePage ) {
                    return false;
                }

                $toggle                  = $( this ).addClass('b-popup-discount__toggle_status_active');
                $discountPopup           = $( '.b-popup-discount', $toggle );
                $discountPopupVisWrapper = $('.b-popup-discount__visible-wrapper');
                toggleOffset             = $toggle.offset();
                discountPopupW           = $discountPopup.outerWidth();
                discountPopupH           = $discountPopup.outerHeight();
                cssTop                   = e.pageY - toggleOffset.top + popupMargin;
                cssLeft                  = e.pageX - toggleOffset.left + popupMargin;

                if ( $discountPopupVisWrapper.length ) {
                    visWrapperOffset = $discountPopupVisWrapper.offset();
                    relativeX        = ( e.pageX - visWrapperOffset.left );
                    relativeY        = ( e.pageY - visWrapperOffset.top );

                    visibleAreaWidth = $discountPopupVisWrapper.innerWidth() - 20;
                    visibleAreaHeight = $discountPopupVisWrapper.innerHeight();

                    if ( relativeX + discountPopupW + popupMargin > visibleAreaWidth ) {
                        dX = relativeX + discountPopupW + popupMargin - visibleAreaWidth;
                        cssLeft = cssLeft - dX;
                    }

                    if ( relativeY + discountPopupH + popupMargin > visibleAreaHeight ) {
                        dY = discountPopupH + popupMargin * 2;
                        cssTop = cssTop - dY;
                    }
                }
                else {
                    visibleAreaWidth = document.compatMode == 'CSS1Compat'
                    && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;

                    if ( e.pageX + discountPopupW + popupMargin > visibleAreaWidth ) {
                        dX = e.pageX + discountPopupW + popupMargin - visibleAreaWidth;
                        cssLeft = cssLeft - dX;
                    }
                }

                $discountPopup.css( {
                    top  : cssTop,
                    left : cssLeft,
                } ).show();
            } ).on( 'mouseleave', function() {
                $( this ).removeClass('b-popup-discount__toggle_status_active')
                    .find('.b-popup-discount').hide();
            } );
        } );

        return this;
    };
} )( jQuery );

$( function() {
    if ( !window.Modernizr.touchevents ) {
        $('.b-popup-discount__toggle').popupDiscount();
    }
} );
