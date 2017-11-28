$( function() {
    window.Site.namespace('Site.App.Common');

    Site.App.Common = {
        escapeRegexString : function( string ) {
            return string.replace( /[-[\]/{}()*+?.\\^$|]/g, '\\$&' );
        }, 
    };
} );
