window.JST = window.JST || {};
window.JST['b-table'] = require('./b-table.jade');
window.JST['b-table__item'] = require('./b-table__item.jade');
window.JST['b-table__pagination'] = require('./b-table__pagination.jade');

$( function() {
    $('.b-table__wrapper').each( function() {
        var $tableWrapper = $( this ),
            $tableTypeSwitch = $( '.b-table__switch-type', $tableWrapper ),
            $table = $( '.b-table', $tableWrapper ),
            prefix,
            ls,
            currentType,
            type;

        if ( $tableTypeSwitch.length ) {
            prefix = window.REGRU ? ( window.REGRU.user || '' ) : '';
            ls = new Storage( { prefix: prefix + '_tableViewSettings_' } );
            currentType = ls.get('type') || {};

            $( '.b-list-buttons__item', $tableTypeSwitch ).on( 'click', function( e ) {
                if ( $( this ).hasClass('b-list-buttons__item_state_current') ) {
                    return false;
                }

                type = $( this ).attr('href').replace( '#', '' );

                if ( type == 'compact' ) {
                    $table.addClass('b-table_type_compact');
                }
                else {
                    $table.removeClass('b-table_type_compact');
                }

                ls.set( 'type', { value: type } );
                $( '.b-list-buttons__item', $tableTypeSwitch ).removeClass('b-list-buttons__item_state_current');
                $( this ).addClass('b-list-buttons__item_state_current');
                $( this ).closest('.b-popup-dropdown').hooc( e, 'hide' );

                return false;
            } );

            $( '.b-list-buttons__item[href="#' + currentType.value + '"]', $tableTypeSwitch ).click();
        }
    } );
} );
