$( function() {
    $('.b-menu__addition-trigger').on( 'click', function() {
        var href = $( this ).attr('href'),
            path = document.location.pathname,
            re   = new RegExp( '^' + path + '#' ),
            $additionBlock;

        if ( href.match( re ) ) {
            href = href.replace( path, '' );
        }

        if ( href.match( /^#/ ) ) {
            $additionBlock = $( href );

            $('html, body').animate( { scrollTop: $additionBlock.offset().top } );

            return false;
        }
    } );
} );
