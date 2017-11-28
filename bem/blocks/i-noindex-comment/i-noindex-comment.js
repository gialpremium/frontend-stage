$( function() {
    var COMMENT_NODE = 8;

    $('.i-noindex-comment').each( function() {
        $( this ).contents().filter( function() {
            return this.nodeType === COMMENT_NODE;
        } ).each( function() {
            $( this ).replaceWith(
                this.nodeValue
                    .replace( /--\|>/g, '-->' )
                    .replace( '<noindex>', '<!--noindex-->' )
                    .replace( '</noindex>', '<!--/noindex-->' )
            );
        } );
    } );
} );
