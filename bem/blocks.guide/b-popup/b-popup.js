// TODO
//
// 1. сделать плагин
//      * задавать кастомные координаты
//      * отказаться от width ???
//      * методы close/open/toggle
//      * закрывать на esc
//      options
//      * отключение hooc
//      * фейд как у auth popup

$( function() {
    var popupZindex  = 800,
        escapeCode   = 27,
        enterCode    = 13,
        throttleTime = 700,

        $window = $( window ),

        /**
         * Вычисляет значение margin заданному попапу для его корректного позиционирования
         * @param  {Object} $targetPopup Целевой попап
         * @return {String} Новое значение margin
         */
        getPopupMargin = function( $targetPopup ) {
            return '0 0 50px -' + Math.round( $targetPopup.outerWidth() / 2 ) + 'px';
        },

        /**
         * Обработчик $window.resize.
         * Перебирает все открытые попапы, меняет из позиционирование и размеры
         */
        handleResize = function( $activePopups ) {
            if ( $activePopups ) {
                $activePopups.not('.b-popup_responsive').each( function() {
                    var $popup = $( this );

                    $popup.css( { margin: getPopupMargin( $popup ) } );
                } );
            }
        },

        bPopupInit = window.bPopupInit = function( $popups ) {
            var $popupsInit = typeof $popups === 'undefined' ? $('.b-popup') : $popups;

            $popupsInit.each( function() {
                var $popup = $( this );

                $( this ).hooc( 'set', {
                    hide : function() {
                        popupZindex--;

                        $popup.hide();
                    },
                    show : function() {
                        var topMin = 0,
                            popupCss = {},
                            isResponsive = $popup.hasClass('b-popup_responsive'),
                            offsetTop;

                        popupZindex++;

                        if ( $('.b-menu').length
                            && !Site.App.isAdaptivePage
                            && !$popup.hasClass('b-popup_modal')
                            && !$popup.hasClass('b-popup_overlayed') ) {

                            topMin = $('.b-menu').outerHeight() + $('.b-menu').offset().top;
                        }

                        offsetTop = Math.max( topMin, $window.scrollTop()
                            + Math.max( 0, ( ( $window.height() - $popup.outerHeight() ) / 2 ) ) );

                        if ( isResponsive ) {
                            popupCss = {
                                top    : offsetTop,
                                zIndex : popupZindex,
                            };
                        }
                        else {
                            popupCss = {
                                left   : '50%',
                                top    : offsetTop,
                                margin : getPopupMargin( $popup ),
                                zIndex : popupZindex,
                            };
                        }

                        $popup
                            .show()
                            .css( popupCss )
                            .find('.b-popup__fade').show();

                    },

                } );
            } );
        };

    bPopupInit();

    $window.resize(
        _.throttle( handleResize.bind( this, $('.b-popup.i-hooc__popup_visible_true') ),
            throttleTime,
            { leading: false }
        )
    );

    $( document )
        .on( 'click', '.b-popup__trigger-open', function( e ) {
            var $this = $( this ),
                href = $this.attr('href'),
                $popup = $( /^#/.test( href ) ? href : $this.attr('rel') );

            $popup.hooc( 'toggle', e );

            return false;
        } )
        .on( 'click', '.b-popup__fade', function( e ) {
            var $popup = $( e.target ).closest('.b-popup');

            if ( !$popup.hasClass('b-popup_modal') ) {
                $popup.hooc('hide');
            }
        } )
        .on( 'click', '.b-popup__trigger-close', function( e ) {
            var $popup = $( e.target ).closest('.b-popup');

            $popup.hooc( 'hide', e );

            return false;
        } )
        .on( 'keyup', function( e ) {
            var key = e.which,
                $popups,
                $submitPopup,
                $upperPopup;

            if ( key == escapeCode || key == enterCode ) {
                $popups = $('.b-popup.i-hooc__popup_visible_true');

                if ( $popups.length ) {
                    $popups.each( function() {
                        if ( !$upperPopup ) {
                            $upperPopup = $( this );
                        }
                        else if ( $( this ).css('zIndex') * 1 > $upperPopup.css('zIndex') * 1 ) {
                            $upperPopup = $( this );
                        }
                    } );

                    if ( key == escapeCode ) {
                        $upperPopup.hooc('hide');
                    }
                    else if ( key == enterCode && e.target.nodeName !== 'TEXTAREA' && e.target.nodeName !== 'INPUT' ) {
                        $submitPopup = $( '.b-button_color_primary', $upperPopup );

                        if ( $submitPopup.length == 1 ) {
                            $submitPopup[0].click();
                        }
                    }
                }
            }
        } );

    setTimeout( function() {
        $('.b-popup_open_auto').hooc('show');
    }, 100 ); // честно говоря, не разбирался почему. возможно какие-то события генерятся
} );
