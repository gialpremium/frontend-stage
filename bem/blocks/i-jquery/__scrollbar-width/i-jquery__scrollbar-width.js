( function( $ ) {

    /* eslint-disable no-magic-numbers */

    var scrollbarWidth = 0,
        IE;

        // @cc_on IE = 1;
    $.getScrollbarWidth = function() {
        var $textarea1,
            $textarea2,
            $div;

        if ( !scrollbarWidth ) {
            if ( IE ) {
                $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
                    .css( {
                        position : 'absolute',
                        top      : -1000,
                        left     : -1000,
                    } ).appendTo('body');
                $textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
                    .css( {
                        position : 'absolute',
                        top      : -1000,
                        left     : -1000,
                    } ).appendTo('body');
                scrollbarWidth = $textarea1.width() - $textarea2.width();
                $textarea1.add( $textarea2 ).remove();
            }
            else {
                $div = $('<div />')
                    .css( {
                        width    : 100,
                        height   : 100,
                        overflow : 'auto',
                        position : 'absolute',
                        top      : -1000,
                        left     : -1000,
                    } )
                    .prependTo('body').append('<div />').find('div')
                    .css( {
                        width  : '100%',
                        height : 200,
                    } );

                scrollbarWidth = 100 - $div.width();
                $div.parent().remove();
            }
        }

        return scrollbarWidth;
    };
} )( jQuery );
