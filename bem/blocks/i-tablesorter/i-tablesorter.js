require('jquery.tablesorter/js/jquery.tablesorter.js');

// add parser through the tablesorter addParser method

$.tablesorter.addParser( {
    id : 'data_num',
    is : function() {
        return false;
    },
    format : function( s, table, cell ) {
        return Number( $( cell ).data('sort') );
    },
    type : 'numeric',
} );

$.tablesorter.addParser( {
    id : 'numbers_only',
    is : function() {
        return false;
    },
    format : function( s, table, cell ) {
        var extracted = $( cell ).find('.i-tablesorter__extract').text() || $( cell ).text();

        return Number( extracted.replace( /\D+/ig,'' ) );
    },
    type : 'numeric',
} );

$.tablesorter.addParser( {
    id : 'multiplication',
    is : function() {
        return false;
    },
    format : function( s, table, cell ) {
        var ss = $( cell ).text(),
            re = /\D+/ig,
            entry = ss.split( re, 2 );

        return Number( entry[0] * ( entry[1] || 1 ) );
    },
    type : 'numeric',
} );

$.tablesorter.addParser( {
    id : 'presence',
    is : function() {
        return false;
    },
    format : function( s, table, cell ) {
        var c = '.i-tablesorter__presence';

        return $( cell ).find( c ).length ? 1 : 0;
    },
    type : 'numeric',
} );

$.tablesorter.addParser( {
    id : 'customDate',
    is : function() {
        return false;
    },
    format : function( s, table, cell ) {
        var ss = $( cell ).find('.i-tablesorter__customdate').data('sort');

        ss = ss.replace( /-/g,' ' );
        ss = ss.replace( /:/g,' ' );
        ss = ss.replace( /\./g,' ' );
        ss = ss.split(' ');

        return $.tablesorter.formatFloat( new Date( ss[0], ss[1] - 1, ss[2], ss[3], ss[4], ss[5] ).getTime() );
    },
    type : 'numeric',
} );

$( function() {
    $.tablesorter.defaults.cssDesc = $.tablesorter.defaults.cssDesc || 'b-table__cell_sorted_asc';
    $.tablesorter.defaults.cssAsc = $.tablesorter.defaults.cssAsc || 'b-table__cell_sorted_desc';

    $('.i-tablesorter').each( function() {
        var $this = $( this ),
            $th = $this.find('th'),
            th_length = $th.length,
            params = {},
            sort,
            i;

        for ( i = 0; i < th_length; i++ ) {
            sort = $( $th[i] ).data('parser');

            if ( sort == 'default' ) {
                continue;
            }

            params[i] = {};
            params[i].sorter = sort ? sort : false;
        }

        $this.tablesorter( { headers: params } );

    } );
} );
