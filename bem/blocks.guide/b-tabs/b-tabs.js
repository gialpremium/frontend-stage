( function( $ ) {

    function toTab( $tab, $tabs, tags, expanders ) {
        var name,
            newTags,
            newExpanders,
            expandersArray,
            expanderId,
            height,
            $expanderTitle,
            $tabParent,
            $tabContent;

        if ( $tab.hasClass('b-tabs__item-title_state_current') ) {
            return false;
        }

        $tabContent = $( '.b-tabs__item-content[data-content-name="' + $tab.data('tab-name') + '"]', $tabs );

        $tabs
            .find('.b-tabs__item-content, .b-tabs__item-title')
            .removeClass('b-tabs__item-title_state_current b-tabs__item-content_state_current');

        $tab.addClass('b-tabs__item-title_state_current');

        if ( !$tabContent.length ) {
            $tabContent = $tab.next('.b-tabs__item-content');
        }

        $tabContent.addClass('b-tabs__item-content_state_current');

        name         = $tab.data('tab-name');
        newTags      = tags ? ( '&' + tags ) : '';
        newExpanders = expanders ? ( '&' + expanders ) : '';
        $tabParent   = $tab.parent();

        if ( name && $tabParent.data('namesEnabled') ) {
            window.location.hash = name + newTags + newExpanders;
            $tabParent.data( 'active', name );
        }

        if ( expanders ) {
            expandersArray = expanders.replace( /^expanders=([^&]+).*/, '$1' ).split(',');
            if ( expandersArray.length === 1 ) {
                expanderId = expandersArray[0];
                $expanderTitle = $( '#' + expanderId, $tabContent );

                if ( $expanderTitle.length ) {
                    height = $expanderTitle.offset().top;
                    if ( $expanderTitle.hasClass('b-list-expander__item_state_collapse') ) {
                        $expanderTitle.click();
                    }
                    $('html, body').stop().animate( { scrollTop: height }, 1000 );
                }
            }
        }

        return true;
    }

    $.fn.bTabs = function() {
        this.removeClass('b-tabs_js_no').each( function() {
            var $tabs             = $( this ),
                $tabsTitles       = $( '.b-tabs__item-title', $tabs ),
                tabNames          = [],
                urlHash           = window.location.hash.replace( /^#/, '' ),
                tabFromHash       = _.compact( urlHash.replace( /(^|&)[^&]+=[^&]+/gi, '$1' ).split('&') )[0],
                tagsFromHash      =  urlHash.match( /(?:^|&)(tags=[^&]+)/g )
                    ? urlHash.replace( /.*(?:^|&)(tags=[^&]+).*/, '$1' ) : '',
                expandersFromHash =  urlHash.match( /(?:^|&)(expanders=[^&]+)/g )
                    ? urlHash.replace( /.*(?:^|&)(expanders=[^&]+).*/, '$1' ) : '',
                i;

            $tabsTitles.each( function() {
                if ( $( this ).data('tab-name') ) {
                    tabNames.push( {
                        $tab : $( this ),
                        name : $( this ).data('tab-name'),
                    } );
                }
            } );

            $tabsTitles.on( 'click', function( event, params ) {
                var tags = params && params.tags ? params.tags : '',
                    expanders = params && params.expanders ? params.expanders : '';

                if ( $tabs.data('disabled') ) {
                    return false;
                }

                if ( $( '.b-tabs__item-title-link', this ).length ) {
                    window.location.href = $( '.b-tabs__item-title-link', this ).attr('href');

                    return false;
                }


                $tabs.data( 'namesEnabled', 'true' );
                toTab( $( this ), $tabs, tags, expanders );
                $( window ).trigger('resize');

                return false;
            } );

            if ( urlHash.length && tabNames.length ) {
                for ( i = 0; i < tabNames.length; i++ ) {
                    if ( tabFromHash === tabNames[i].name ) {
                        tabNames[i].$tab.trigger( 'click', {
                            tags      : tagsFromHash,
                            expanders : expandersFromHash,
                        } );
                        break;
                    }
                }
            }

            if ( !$tabsTitles.filter('.b-tabs__item-title_state_current').length ) {
                toTab( $tabsTitles.eq( 0 ), $tabs );
                $tabs.data( 'namesEnabled', 'true' );
            }
        } );


    };

    // init
    $( function() {
        $('.b-tabs').bTabs();

        $( document ).on( 'click', '.b-tabs-open', function() {
            var name,
                $tab,
                scrollPos,
                tabName = $( this ).attr('href') || $( this ).data('tab');

            if ( !tabName.match( /^#/ ) ) {
                return false;
            }

            name      = tabName.replace( /^[^#]*#/, '' );
            $tab      = $( '.b-tabs__item-title[data-tab-name=' + name + ']' );
            scrollPos = $tab.offset().top;

            $tab.click();

            $('html, body').animate( { scrollTop: scrollPos }, 1000 );

            return false;
        } );

    } );
} )( jQuery );
