/* global bPopupInit */
( function( $ ) {
    $.fn.bPopupDropdown = function( settings ) {
        return this.each( function() {
            var o = settings || {},
                $dropdown = $( this ),
                $dropdownTrigger = $dropdown.closest('.b-popup-dropdown__wrapper').find('.b-popup-dropdown__trigger'),
                $dropdownTriggerMain = $dropdownTrigger.not( $dropdown.find('.b-popup-dropdown__trigger') );

            if ( $dropdownTrigger.length ) {

                bPopupInit( $dropdown );
                $dropdown.hooc( 'set', {
                    hide : function() {
                        $( this ).hide();

                        if ( o.onHide ) {
                            o.onHide.apply( $dropdown );
                        }

                        if ( o.toggleTriggerClass ) {
                            $dropdownTriggerMain.removeClass( o.toggleTriggerClass );
                        }
                    },
                    show : function() {
                        $( this ).show();

                        if ( o.onShow ) {
                            o.onShow.apply( $dropdown );
                        }

                        if ( o.toggleTriggerClass ) {
                            $dropdownTriggerMain.addClass( o.toggleTriggerClass );
                        }
                    },
                } );
                $dropdownTrigger.off('.popup-dropdown').on( 'click.popup-dropdown', function( e ) {
                    $dropdown.hooc( e, 'toggle' );

                    return false;
                } );
            }
        } );
    };

    // init
    $( function() {
        $('.b-popup-dropdown').bPopupDropdown();
    } );
} )( jQuery );
