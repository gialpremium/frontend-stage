$( function() {
    $('.b-input-wrapper').each( function() {
        var $input = $( 'input', this ),
            defaultValue = $input.data('default-value') || '',
            $inputClear = $( '.b-input-wrapper__clear', this );

        if ( $inputClear.length ) {
            $input.on( 'keyup change', function() {

                if ( $( this ).val() !== '' ) {
                    $inputClear.show();
                }
                else {
                    $inputClear.hide();
                }

            } );

            $inputClear.on( 'click', function() {
                $input.val( defaultValue ).change();

                return false;
            } );

            !$input.val() && $inputClear.hide();
        }
    } );
} );
