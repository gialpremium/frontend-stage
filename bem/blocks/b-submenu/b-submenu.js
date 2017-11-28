$( function() {
    var $menu            = $('.b-menu'),
        $menuWrapper     = $( '.b-menu__wrapper', $menu ),
        $submenuTriggers = $( '.b-menu__link_submenu_has', $menuWrapper ),
        $submenus        = $( '.b-submenu', $menuWrapper ),
        $groupTriggers   = $('.b-submenu__trigger, .b-submenu-trigger'),
        $submenuBack     = $('.b-submenu__back');

    $submenuTriggers.on( 'click', function( e ) {
        var $submenuTrigger = $( this ),
            $currentSubmenu = $( '.b-submenu-' + $submenuTrigger.data('submenu') );

        if ( !$currentSubmenu.length ) {
            return false;
        }

        if ( $submenuTrigger.hasClass('b-menu__link_state_current') ) {
            $currentSubmenu
                .removeClass('b-submenu_state_opened').addClass('b-submenu_state_closed')
                .removeClass('b-submenu_state_expanded').addClass('b-submenu_state_collapsed');

            $menu.removeClass('b-menu_submenu_opened');
            $('body').removeClass('b-page_submenu_opened');

            $submenuTrigger.removeClass('b-menu__link_state_current');
        }
        else {
            $submenus
                .removeClass('b-submenu_state_opened').addClass('b-submenu_state_closed')
                .removeClass('b-submenu_state_expanded').addClass('b-submenu_state_collapsed');

            $submenuTriggers
                .removeClass('b-menu__link_state_current')
                .parent('.b-menu__item')
                .removeClass('b-menu__item_state_current');

            $currentSubmenu
                .removeClass('b-submenu_state_closed')
                .addClass('b-submenu_state_opened')
                .hooc( e, {
                    hide : function() {
                        $( this ).addClass('b-submenu_state_closed').removeClass('b-submenu_state_opened');

                        $submenuTrigger
                            .addClass('b-menu__link_state_current')
                            .parent('.b-menu__item')
                            .addClass('b-menu__item_state_current');
                    }, 
                } );

            $menu.addClass('b-menu_submenu_opened');
            $('body').addClass('b-page_submenu_opened');

            $submenuTrigger
                .addClass('b-menu__link_state_current')
                .parent('.b-menu__item')
                .addClass('b-menu__item_state_current');
        }

        return false;
    } );

    $( document ).on( 'click', function( e ) {

        if ( !$( e.target ).closest('.b-menu__width-wrapper').length ) {
            $('.b-menu').removeClass('b-menu_status_visible');

            $submenuTriggers
                .removeClass('b-menu__link_state_current')
                .parent('.b-menu__item')
                .removeClass('b-menu__item_state_current');
        }

    } );

    if ( Modernizr.touchevents || Site.App.isAdaptivePage ) {
        $( '.b-submenu__link', $menuWrapper ).on( 'click', submenuEventClick );
    }
    else {
        $( '.b-submenu__list', $menuWrapper )
            .menuAim( {
                activate   : showSubmenuGroup,
                deactivate : hideSubmenuGroup,
            } );
    }

    $groupTriggers.on( 'click', function( e ) {
        var $group = $( $( this ).attr('href') );

        if ( !$group.length ) {
            return false;
        }

        $('.b-menu')
            .addClass('b-menu_transition_off')
            .addClass('b-menu_status_visible');


        if ( Site.App.isAdaptivePage ) {
            $group.closest('.b-submenu')
                .find('.b-submenu__item:not(.b-submenu__item_type_back)')
                .hide();

            $group.closest('.b-submenu__item').show();
            $group.prev('.b-submenu__link').hide();

            $group.closest('.b-submenu').prev('.b-menu__link_submenu_has').click();
        }

        $group
            .removeClass('b-submenu__groups_state_closed')
            .addClass('b-submenu__groups_state_opened')
            .addClass('b-submenu__groups_state_standalone')
            .css( { height: 'auto' } )
            .hooc( e, {
                hide : function() {
                    $group
                        .addClass('b-submenu__groups_state_closed')
                        .removeClass('b-submenu__groups_state_opened')
                        .removeClass('b-submenu__groups_state_standalone')
                        .closest('.b-submenu')
                        .find('.b-submenu__item, .b-submenu__link')
                        .show();
                }, 
            } );

        return false;
    } );

    $('.b-submenu__groups-close').on( 'click', function() {
        var $group = $( this ).parent();

        $group
            .addClass('b-submenu__groups_state_closed')
            .removeClass('b-submenu__groups_state_opened')
            .removeClass('b-submenu__groups_state_standalone');

        $('.b-menu').removeClass('b-menu_status_visible');

        return false;
    } );

    $('.b-submenu__group-link').on( 'click', function() {
        var currentUrl = document.location.pathname,
            link = $( this ).attr('href').replace( /#.*$/, '' );

        if ( currentUrl === link ) {
            $submenus
                .removeClass('b-submenu_state_opened').addClass('b-submenu_state_closed')
                .removeClass('b-submenu_state_expanded').addClass('b-submenu_state_collapsed');

            $submenuTriggers.removeClass('b-menu__link_state_current');
        }
    } );

    $submenuBack.on( 'click', function() {
        $('.b-menu').removeClass('b-menu_status_visible');

        $( this ).closest('.b-menu__item').children('.b-menu__link_state_current').click();
        hideSubmenuGroup( $( this ).closest('.b-submenu__item') );
        $submenus.hooc('hide');

        $submenuTriggers
            .removeClass('b-menu__link_state_current')
            .parent('.b-menu__item')
            .removeClass('b-menu__item_state_current');
    } );

    function showSubmenuGroup( $row ) {
        var $groupTrigger        = $( '.b-submenu__link', $row ),
            $submenu             = $groupTrigger.closest('.b-submenu'),
            $submenuList         = $( '.b-submenu__list', $submenu ),
            $currentGroup        = $groupTrigger.next('.b-submenu__groups'),
            currentSubmenuH      = Math.max( $submenuList.height(), $currentGroup.height() ),
            currentSubmenuGroupH = currentSubmenuH;


        if ( !$currentGroup.length ) {
            return false;
        }

        if ( $currentGroup.hasClass('b-submenu__groups_height_auto') ) {
            currentSubmenuGroupH = $currentGroup.height();
        }

        $groupTrigger.addClass('b-submenu__link_state_current');

        $currentGroup
            .removeClass('b-submenu__groups_state_closed')
            .addClass('b-submenu__groups_state_opened');

        $submenu
            .removeClass('b-submenu_state_collapsed')
            .addClass('b-submenu_state_expanded');

        if ( !$submenus.hasClass('b-submenu_state_closed') ) {
            $currentGroup.height( currentSubmenuGroupH );
            $submenu.height( currentSubmenuH );
        }
    }

    function hideSubmenuGroup( $row ) {
        var $groupTrigger  = $( '.b-submenu__link', $row ),
            $submenu       = $groupTrigger.closest('.b-submenu'),
            $submenuGroups = $( '.b-submenu__groups', $submenu );

        $groupTrigger.removeClass('b-submenu__link_state_current');

        $submenuGroups
            .removeClass('b-submenu__groups_state_opened')
            .addClass('b-submenu__groups_state_closed');

        $submenu
            .removeClass('b-submenu_state_expanded')
            .addClass('b-submenu_state_collapsed')
            .css( { height: 'auto' } );
    }

    /**
     * Клик по сабменю
     * @method submenuEventClick
     */
    function submenuEventClick() {
        var $currentRow  = $( this ).closest('.b-submenu__item'),
            $submenuRows = $currentRow.closest('.b-submenu__list'),
            $prevRow     = $( '.b-submenu__link_state_current', $submenuRows ).closest('.b-submenu__item');

        if ( $( '.b-submenu__link', $currentRow ).hasClass('b-submenu__link_state_current') ) {
            hideSubmenuGroup( $currentRow );

            return false;
        }

        $( '.b-submenu__link', $submenuRows ).removeClass('b-submenu__link_state_current');

        hideSubmenuGroup( $prevRow );

        if ( $( '.b-submenu__groups', $currentRow ).length ) {
            showSubmenuGroup( $currentRow );

            return false;
        }
    }
} );
