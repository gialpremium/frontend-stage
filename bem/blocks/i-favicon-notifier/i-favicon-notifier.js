window.iFaviconNotifier = ( function() {
    'use strict';

    var iFaviconNotifier = function( options ) {
        var $link = $('link[rel=icon]').eq( 0 );

        this.options = _.extend( {
            folder   : '/',
            icon     : 'favicon-exclaim.ico',
            interval : 1000,
            title    : null,
        }, options );

        this.$title        = $('title');
        this.$head         = $('head');

        this.originalIcon  = $link.attr('href');
        this.originalTitle = this.$title.text();

        this.originalState = true;
    };

    iFaviconNotifier.prototype = {

        constructor : iFaviconNotifier,

        start : function() {
            var self = this;

            this.interval = setInterval( function() {
                self.toggle();
            }, this.options.interval );
        },

        stop : function() {
            clearInterval( this.interval );

            if ( !this.originalState ) {
                this.toggle();
            }
        },

        toggle : function() {
            var url,
                title;

            if ( this.originalState ) {
                url   = this.options.folder + this.options.icon;
                title = this.options.title;
            }
            else {
                url   = this.originalIcon;
                title = this.originalTitle;
            }

            $( 'link[rel=icon]', this.$head ).remove();
            this.$head.append( '<link rel="icon" type="image/x-icon" href="' + url + '" />' );

            if ( title ) {
                this.$title.text( title );
            }

            this.originalState = !this.originalState;
        },
    };

    return iFaviconNotifier;
} )();
