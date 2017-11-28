$.fn.faqBlock = function() {
    this.each( function() {
        $( this ).find('.b-faq-block__toggle-addon').on( 'click', function() {
            var $addon = $( this ).closest('.b-faq-block').find('.b-faq-block__addon');

            if ( $addon.length ) {
                $addon.toggleClass('b-faq-block__addon_state_opened');
                $( this ).text( $addon.is(':visible') ? 'Скрыть' : 'Показать полностью' );
            }

            return false;
        } );
    } );

    return this;
};

$( function() {
    $('.b-faq-block').faqBlock();
} );
