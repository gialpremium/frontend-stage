// прижимаем футер внизу
$( document ).ready( function() {
    var $currency    = $('.b-footer__currency'),
        $pagePadding = $('.b-page__footer-down-content'),
        $footer      = $('.b-footer'),
        $breadcrumbs = $('.b-breadcrumbs'),
        url          = window.location.protocol + '//' + window.location.host,
        tld          = window.location.hostname.substr( window.location.hostname.lastIndexOf('.') + 1 ),
        currentUrl  = '';

    if ( window.currentClient && window.currentClient.browser === 'ie' ) {
        $( window ).on( 'resize', function() {
            if ( $footer.outerHeight() !== parseInt( $pagePadding.css('padding-bottom') ) ) {

                $pagePadding.css( { paddingBottom: $footer.outerHeight() } );

                $footer.css( { marginTop: $footer.outerHeight() * -1 } );

                $breadcrumbs.css( { marginTop: ( $footer.outerHeight() + $breadcrumbs.outerHeight() / 2 ) * -1 } );
            }
        } ).on( 'load', function() {
            $( this ).resize();
        } );
    }

    if ( !window.location.search.length ) {
        url += window.location.pathname;
    }

    url += window.location.hash;

    if ( $currency.data('bSelect') ) {
        $currency.data('bSelect').$items.each( function() {
            var optionlang = $( this ).data('lang');

            if ( optionlang == lang ) {
                currentUrl = url;
                $( this ).data( 'url', currentUrl );
            }
            else {
                $( this ).data( 'url', url.replace( '.' + tld, '.' + $( this ).data('value') ) );
            }
        } );

        $currency.bSelect( 'setOption', 'onSelected', function() {
            if ( this.$selected.data('url') !== currentUrl ) {
                window.location = this.$selected.data('url');
            }
        } );
    }

} );
