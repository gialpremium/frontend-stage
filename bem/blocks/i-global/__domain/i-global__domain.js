/* eslint-disable */
window.truncate_domain_middle = function( domain, size ) {
    if ( typeof size === 'undefined' ) {
        size = 8;
    }

    var regexp = new RegExp(
            '(^\\S{%i})\\S{2,}([^\\.\\s]{%i})(\\.\\S+)'.replace( /%i/g, size )
        ),
        matches = domain.match( regexp );

    if ( matches === null ) {
        return domain;
    }

    var left  = matches[1],
        right = matches[2] + matches[3],
        oversize = right.length - size;

    if ( oversize > 0 ) {
        left = left.substr( 0, left.length - Math.ceil( oversize / 2 ) );
        right = right.substr( Math.ceil( oversize / 2 ) );
    }

    return left + '&hellip;' + right;
};

window.split_domain_in_status = function( status ) {
    var matches;

    if ( status.tld && status.dname ) {
        return status;
    }

    matches = status.domain.match( /^([^.]+)\.(.*)$/ );
    status.dname = matches[1];
    status.tld   = matches[2];

    return status;
};

window.is_idn = function( domain ) {
    return /(^|\.)xn--/i.test( domain ) || !/^[0-9a-z\.-]+$/i.test( domain );
};
