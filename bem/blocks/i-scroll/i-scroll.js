$( function() {
    $( document ).on( 'click', '.i-scroll', function() {
        var $block = $( $( this ).attr('href') ),
            scrollPos,
            time;

        if ( !$block.length ) {
            return false;
        }

        scrollPos = $block.offset().top;
        time = $( this ).data('scroll') || 1000;

        $('html, body').animate( { scrollTop: scrollPos }, time );

        return false;
    } );
} );
