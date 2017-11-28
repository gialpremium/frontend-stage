( function() {
    var $multistringInput = $('.b-form-compact__query_style_multistring');

    $multistringInput.autoResize();

    $multistringInput.keydown( function( e ) {
        var ENTER_CODE = 13;

        if ( e.keyCode === ENTER_CODE ) {
            $('#faq-search').submit();

            return false;
        }
    } );
} )();

