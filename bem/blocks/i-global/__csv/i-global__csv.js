/* eslint-disable */
window.array2csv = function( array ) {
    return _.reduce( array, function( memo, row ) {
        row = _.map( row, csv_escape );

        return memo + row.join(';') + '\r\n';
    }, '' );
};


window.csv_escape = function( string ) {
    string = string + '' || '';
    string = string.replace( /&nbsp;/g, ' ' );

    if ( string.match( /[",;\n\r]/ ) ) {
        string = '"' + string.replace( /"/g, '""' ) + '"';
    }

    return string;
};
