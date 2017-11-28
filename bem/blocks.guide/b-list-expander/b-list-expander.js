( function( $ ) {
    function matchExpandersString( hash ) {
        return hash.match( /(?:^|&)(expanders=[^&]+)/g );
    }

    function getExpandersString( hash ) {
        return hash.replace( /.*(?:^|&)(expanders=[^&]+).*/, '$1' );

    }

    function getExpandersStringIDs( hash ) {
        return hash.replace( /.*(?:^|&)expanders=([^&]+).*/, '$1' );
    }


    function getExpandersWithAmp( hash ) {
        return hash.replace( /.*(^|&)(expanders=[^&]+).*/, '$1$2' );
    }



    function openClosedExpander( $item ) {

        $item
            .removeClass('b-list-expander__item_state_collapse')
            .removeClass('b-list-expander__item_state_collapse@mobile')
            .addClass('b-list-expander__item_state_expand')
            .next('.b-list-expander__item-content')
            .removeClass('b-list-expander__item-content_state_collapse@mobile"')
            .show();

        $( '.b-list-expander__item-title-icon', $item )
            .removeClass('b-list-expander__item-content_state_collapse@mobile"')
            .addClass('b-list-expander__item-title-icon_state_expand');
    }

    // ��� ������� ������ � ������������
    window.showExpanderBlock = function( $item ) {
        var id = $item.attr('id'),
            urlHash,
            expandersFromHash,
            lastExpanderId,
            newExpanders;

        openClosedExpander( $item );

        if ( id ) {
            urlHash = window.location.hash.replace( /^#/, '' );
            expandersFromHash = matchExpandersString( urlHash ) ? getExpandersString( urlHash ) : '';

            if ( expandersFromHash ) {
                lastExpanderId = expandersFromHash.replace( /.*(?:,|=)(\w*)$/, '$1' ),
                newExpanders;
                newExpanders = lastExpanderId == id ? expandersFromHash : expandersFromHash + ',' + id;
                window.location.hash = urlHash.replace( expandersFromHash, newExpanders );
            }
            else {
                window.location.hash = urlHash.replace( id, '' ) == ''
                    ? 'expanders=' + id : urlHash + '&expanders=' + id;
            }
        }
    };

    window.hideExpanderBlock = function( $item ) {
        var id = $item.attr('id'),
            urlHash,
            newExpanders = [],
            expandersFromHash,
            newExpandersString;

        $item
            .removeClass('b-list-expander__item_state_expand')
            .addClass('b-list-expander__item_state_collapse')
            .next('.b-list-expander__item-content').hide();
        $( '.b-list-expander__item-title-icon', $item )
            .removeClass('b-list-expander__item-title-icon_state_expand');

        if ( id ) {
            urlHash = window.location.hash.replace( /^#/, '' );
            expandersFromHash = matchExpandersString( urlHash ) ? getExpandersStringIDs( urlHash ).split(',') : '';

            if ( expandersFromHash ) {

                _.each( expandersFromHash, function( expander ) {
                    if ( expander != id ) {
                        newExpanders.push( expander );
                    }
                } );

                newExpandersString = newExpanders.join(',');
                if ( newExpanders.length > 0 ) {
                    newExpandersString = 'expanders=' + newExpandersString;

                    if ( urlHash == getExpandersString( urlHash ) ) {
                        window.location.hash = urlHash.replace( getExpandersWithAmp( urlHash ),newExpandersString );
                    }
                    else {
                        window.location.hash = urlHash.replace( getExpandersWithAmp( urlHash ),newExpandersString );
                    }
                }
                else {
                    if ( urlHash == 'expanders=' + id ) {
                        if ( 'pushState' in history ) {
                            history.pushState( '', document.title, window.location.pathname + window.location.search );
                        }
                        else {
                            window.location.hash = '!';
                        }
                    }
                    else {
                        window.location.hash = urlHash.replace( getExpandersWithAmp( urlHash ), '' );
                    }
                }

            }
            else {
                window.location.hash = urlHash.replace( id, '' );
            }
        }
    };

    $.fn.expanderList = function() {
        this.removeClass('b-list-expander_js_no').each( function() {
            var $expanderItems    = $( '.b-list-expander__item', $( this ) ),
                $expanderTriggers = $('.b-list-expander__item-trigger'),
                isAccordion       = $( this ).hasClass('b-list-expander_type_accordion') ? 1 : 0,
                urlHash           = window.location.hash.replace( /^#/, '' ),
                expandersFromHash = matchExpandersString( urlHash ) ? getExpandersStringIDs( urlHash ).split(',') : '',
                $target;

            $expanderItems.off('click').on( 'click', function() {
                var $this = $( this );

                // if ( $this.hasClass('b-list-expander__item_state_disabled') ) return false;
                if ( $this.hasClass('b-list-expander__item_state_disabled') ) {
                    return;
                }

                if ( $this.hasClass('b-list-expander__item_state_collapse@mobile') ) {
                    $this.removeClass('b-list-expander__item_state_collapse@mobile');
                    $this.next('.b-list-expander__item-content')
                        .removeClass('b-list-expander__item-content_state_collapse@mobile');
                }

                $this.hasClass('b-list-expander__item_state_collapse')
                    ? window.showExpanderBlock( $this )
                    : window.hideExpanderBlock( $this );

                if ( isAccordion ) {
                    $expanderItems.not( $this ).each( function() {
                        if ( $( this ).hasClass('b-list-expander__item_state_expand') ) {
                            window.hideExpanderBlock( $( this ) );
                        }
                    } );
                }

                // ���������� ����������
                // return false;
            } );

            $expanderTriggers.click( function() {
                var $target = $( $( this ).attr('href') );

                if ( $target && $target.length == 1 ) {

                    if ( $target.hasClass('b-list-expander__item_state_collapse') ) {
                        window.showExpanderBlock( $target );
                    }

                    $('html, body').stop().animate( { scrollTop: $target.offset().top }, 1000 );
                }

                return false;
            } );

            if ( urlHash.length ) {
                if ( expandersFromHash.length > 1 ) {
                    _.each( expandersFromHash, function( expander ) {
                        var $target = $( '#' + expander );

                        if ( $target.hasClass('b-list-expander__item_state_collapse@mobile') ) {
                            $target.removeClass('b-list-expander__item_state_collapse@mobile');
                            $target.next('.b-list-expander__item-content')
                                .removeClass('b-list-expander__item-content_state_collapse@mobile');

                            return;
                        }

                        if ( $target.hasClass('b-list-expander__item_state_collapse') ) {
                            openClosedExpander( $target );
                        }
                    } );
                }
                else {
                    $expanderItems.each( function() {
                        if ( $( this ).attr('id') && ( ( $( this ).attr('id') === urlHash )
                            || ( $( this ).attr('id') === expandersFromHash[0] ) ) ) {

                            $target = $( this );

                            return false;
                        }
                    } );

                    if ( $target && $target.length == 1 ) {
                        if ( $target.hasClass('b-list-expander__item_state_collapse@mobile') ) {
                            $target.removeClass('b-list-expander__item_state_collapse@mobile');
                            $target.next('.b-list-expander__item-content')
                                .removeClass('b-list-expander__item-content_state_collapse@mobile');

                            return;
                        }
                        if ( $target.hasClass('b-list-expander__item_state_collapse') ) {
                            $target.click();
                        }

                        $('html, body').stop().animate( { scrollTop: $target.offset().top }, 1000 );
                    }
                }

            }
        } );

        return this;
    };
} )( jQuery );

$( function() {
    $('.b-list-expander').expanderList();
} );
