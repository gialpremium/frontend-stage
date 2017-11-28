( function( $ ) {
    $.fn.sliderImg = function( o ) {
        var options = $.extend( {
            beforeStart : null,
            afterEnd    : null,
        }, o || {} );

        return this.each( function( i ) {
            var $sliderImg = $( this ),
                $sliderImgCounter = $( '.b-slider-img__counter', $sliderImg ),
                $sliderImgCurrent = $( '.b-slider-img__counter-current', $sliderImgCounter ),
                $sliderImgTotal = $( '.b-slider-img__counter-total', $sliderImgCounter ),
                $sliderImgSwitchNext = $( '.b-slider-img__switch_direct_next', $sliderImg ),
                $sliderImgSwitchPrev = $( '.b-slider-img__switch_direct_prev', $sliderImg ),
                $sliderImgTitle = $( '.b-slider-img__list-item-title', $sliderImg ),
                $sliderImgList = $( '.b-slider-img__list', $sliderImg ).children(),
                sliderImgArray = [],
                sliderImgLength = $sliderImgList.length,
                sliderImgCurrentIndex = 0,
                useFancybox = $sliderImg.hasClass('b-slider-img_fancybox_on') ? 1 : 0,
                useNumberedTitles = $sliderImg.hasClass('b-slider-img_numbered-titles_on') ? 1 : 0,
                animationTime = 200;

            $sliderImgList.each( function( i ) {
                sliderImgArray.push( {
                    img   : $( this ),
                    num   : i + 1,
                    title : $( this ).attr('title'),
                } );
            } );

            $sliderImgSwitchPrev.click( function() {
                switchScreenshoot('prev');

                return false;
            } );

            $sliderImgSwitchNext.add( $sliderImgTotal ).click( function() {
                switchScreenshoot('next');

                return false;
            } );

            if ( useFancybox ) {
                $sliderImgList.attr( 'rel', 'for_b-slider-img_' + i ).fancybox( { cyclic: true } );
            }
            else {
                $sliderImgList.click( function() {
                    if ( sliderImgLength > 1 ) {
                        switchScreenshoot('next');
                    }

                    return false;
                } );
            }

            if ( sliderImgLength == 1 ) {
                $( '.b-slider-img__switcher', $sliderImg ).hide();
            }

            switchScreenshoot( sliderImgCurrentIndex );

            function switchScreenshoot( direct ) {
                if ( options.beforeStart ) {
                    options.beforeStart.call(
                        $sliderImg,
                        sliderImgArray[sliderImgCurrentIndex].img,
                        sliderImgCurrentIndex
                    );
                }

                sliderImgArray[sliderImgCurrentIndex].img.fadeOut( animationTime );
                sliderImgCurrentIndex = !isNaN( parseInt( direct, 10 ) )
                    ? direct
                    : ( direct === 'prev' ? sliderImgCurrentIndex - 1 : sliderImgCurrentIndex + 1 );

                sliderImgCurrentIndex = checkSliderImgIndex( sliderImgCurrentIndex );

                if ( sliderImgArray[sliderImgCurrentIndex].img.height() ) {
                    $( '.b-slider-img__list_height_dynamic', $sliderImg )
                        .height( sliderImgArray[sliderImgCurrentIndex].img.height() );
                }

                sliderImgArray[sliderImgCurrentIndex].img.fadeIn( animationTime );
                updateSliderImgCounter( sliderImgCurrentIndex );
                updateSliderImgTitle( sliderImgCurrentIndex );

                if ( options.afterEnd ) {
                    options.afterEnd.call(
                        $sliderImg,
                        sliderImgArray[sliderImgCurrentIndex].img,
                        sliderImgCurrentIndex
                    );
                }
            }

            function checkSliderImgIndex( a ) {
                return ( a >= 0 && a < sliderImgLength ) ? a : ( a < 0 ? sliderImgLength - 1 : 0 );
            }

            function updateSliderImgCounter( a ) {
                $sliderImgCurrent.text( sliderImgArray[a].num + ' / ' );
                $sliderImgTotal.text( sliderImgLength );
            }

            function updateSliderImgTitle( a ) {
                if ( sliderImgArray[a].title ) {
                    if ( useNumberedTitles ) {
                        $sliderImgTitle.text( sliderImgArray[a].num + '. ' + sliderImgArray[a].title ).show();
                    }
                    else {
                        $sliderImgTitle.text( sliderImgArray[a].title ).show();
                    }
                }
                else {
                    $sliderImgTitle.hide();
                }
            }
        } );
    };

    $( function() {
        $('.i-slider-img').sliderImg();
    } );
} )( jQuery );
