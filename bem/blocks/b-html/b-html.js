$( function() {
    var ENTER_KEY = 13;

    // target blank
    $('a[rel*=blank]').attr( 'target', '_blank' );

    // фикс фавикона для ff, если на паге меняеться hash (https://bugzilla.mozilla.org/show_bug.cgi?id=519028)
    $( window ).on( 'hashchange', function() {
        $('link[type*=icon]').detach().appendTo('head');
    } ).trigger('hashchange');

    // сабмит формы по ctrl+enter
    $('.ctrl-enter-submit').bind( 'keypress', function( e ) {
        if ( e.ctrlKey && ( ( e.keyCode == 10 ) || ( e.keyCode == ENTER_KEY ) ) ) {
            $( this ).closest('form').submit();
        }
    } );

    // сабмит формы по enter
    $('.enter-submit').bind( 'keypress', function( e ) {
        if ( ( e.keyCode == 10 ) || ( e.keyCode == ENTER_KEY ) ) {
            $( this ).closest('form').submit();
        }
    } );

} );

