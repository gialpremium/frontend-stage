$( function() {

    if ( history.length > 2 ) {
        $('.b-history_go_back').removeClass('b-history_display_none');
    }


    $('.b-history_go_back').on( 'click', function() {

        history.back();

        return false;
    } );
} );
