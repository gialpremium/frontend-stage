require('jquery-migrate/jquery-migrate.js');

if ( window.REGRU.is_production ) {
    jQuery.migrateMute = true;
    jQuery.migrateTrace = false;

    // jQuery.migrateWarnings.push = function( item ) {
    //     window.Raven.captureMessage( item, { level: 'warning' } );
    //
    //     Array.prototype.push.call( jQuery.migrateWarnings, item );
    // };
}
