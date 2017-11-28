Site.namespace('Site.Analytics.EventHandlers');

$( function() {

    $( document ).on( 'submit', '.i-analytics', function() {
        var $this     = $( this ),
            providers = Object.keys( Site.Analytics.EventHandlers ),
            deferreds = [];


        providers.forEach( function( provider ) {
            if ( $this.hasClass( 'i-analytics_event_' + provider ) ) {
                deferreds.push( Site.Analytics.EventHandlers[ provider ]( $this ) );
            }
        } );

        ( $.when.apply( null, deferreds ) ).always( function() {

            $this.removeClass('i-analytics').submit();

        } );

        return false;
    } ).
        on( 'click', '.i-analytics', function() {
            var $this      = $( this ),
                providers  = Object.keys( Site.Analytics.EventHandlers ),
                deferreds  = [],
                isBlank    = $this.attr('target') === '_blank',
                href       = $this.attr('href'),
                $form,
                isSubmit   = $this.attr('type') === 'submit',
                isBSelect  = $this.hasClass('b-select'),
                isCheckbox = $this.attr('type') === 'checkbox',
                isRadio    = $this.attr('type') === 'radio';

            if ( $this.attr('disabled') || $this.is('form') || isCheckbox || isRadio ) {
                return;
            }

            if ( isSubmit ) {
                $form = $this.closest('form');
                isSubmit = !!$form.length;

            // $this.attr('disabled', 'disabled');
            }

            providers.forEach( function( provider ) {
                if ( $this.hasClass( 'i-analytics_event_' + provider ) && Site.Analytics.EventHandlers[ provider ] ) {
                    deferreds.push(
                        Site.Analytics.EventHandlers[ provider ]( isBSelect ? $( '.b-select__select', $this ) : $this )
                    );
                }
            } );

            ( $.when.apply( null, deferreds ) ).always( function() {

                if ( isBlank ) {
                    return;
                }
                else if ( isSubmit ) {
                    $form.submit();
                }
                else if ( href && !href.match( /^#/ ) ) {
                    document.location = href;
                }

            } );

            return isBlank;
        } ).
        on( 'change', '.i-analytics', function() {
            var $this     = $( this ),
                providers = Object.keys( Site.Analytics.EventHandlers );

            if ( $( this ).is(':checked') ) {
                providers.forEach( function( provider ) {
                    if (
                        $this.hasClass( 'i-analytics_event_' + provider )
                    && Site.Analytics.EventHandlers[ provider ]
                    ) {
                        Site.Analytics.EventHandlers[ provider ]( $this );
                    }
                } );
            }

        } );

} );
