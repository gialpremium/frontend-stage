( function( $, window ) {
    var adaptiveSelector = document.querySelector( '.' + Site.Config.adaptiveClass ),
        isTouchSupported = window.Modernizr.touch;

    setAdaptivePage();

    $( function() {
        $( window ).on( 'resize', setAdaptivePage );
    } );

    /**
     * Задает актуальный статус адаптивности страницы
     * @method setAdaptivePage
     */
    function setAdaptivePage() {
        Site.App.isAdaptivePage = !!( adaptiveSelector && window.innerWidth < Site.Config.desktopWidth );
        Site.App.isMobileDevice = isTouchSupported && screen.width < Site.Config.desktopWidth;
    }

}( jQuery, window ) );
