( function( $ ) {

    $( function() {
        $('body').on( 'click', '.i-post-link', function( e ) {
            var $this = $( this ),
                url   = $this.attr('href');

            stopEvent( e );

            confirmDialogPromise( $this, e )
                .done( function() {
                    $( '<form method="post" action="' + url + '">'
                        + '<input type="hidden" name="_csrf" value="' + $.csrf.getToken() + '" />'
                        + '</form>' ).appendTo('body').submit();
                } );

            return false;
        } );
    } );

} )( jQuery );
