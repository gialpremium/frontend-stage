Site.App.Views.TablePagination = Backbone.View.extend( {
    initialize : function() {
        this.collection.on( 'reset', this.destroy, this );
        this.render();
    },
    template : function( data ) {
        return JST['b-table__pagination']( data );
    },
    render : function() {
        var templateData = {};

        templateData.pages = Math.ceil( this.collection.size() / this.collection.perPage );
        templateData.colspan = this.options.colspan;

        if ( this.collection.resultsCounter > 1 ) {
            templateData.prev = this.getLinkTitle('prev');
        }
        if ( this.collection.showNext ) {
            templateData.next = this.getLinkTitle('next');
        }

        this.setElement( this.template( templateData ) );
        this.$pages = this.$('.b-pagination__link')
            .not('.b-pagination__link_icon_previous, .b-pagination__link_icon_next');
        this.$pages.first().addClass('b-pagination__link_state_current');

        // this.switchPage();
    },
    events : { 'click .b-pagination__link': 'switchPage' },

    // todo more flexible
    getLinkTitle : function( type ) {
        var from,
            to;

        if ( type == 'next' ) {
            from = this.collection.resultsCounter * 100 + 1;
            to =  ( this.collection.resultsCounter + 1 ) * 100;
        }
        else if ( type == 'prev' ) {
            from = ( this.collection.resultsCounter - 2 ) * 100 + 1;
            to =  ( this.collection.resultsCounter - 1 ) * 100;
        }

        return t('premium.table.domains') + from + ' - ' + to;
    },
    switchPage : function( e ) {
        var $target = e ? $( e.currentTarget ) : this.$pages.first();

        if ( $target.hasClass('b-pagination__link_icon_previous')
            || $target.hasClass('b-pagination__link_icon_next') ) {

            this.collection
                .trigger( 'switchResults', $target.hasClass('b-pagination__link_icon_next') ? 'next' : 'previous' );
        }
        else {
            this.$pages.removeClass('b-pagination__link_state_current');
            $target.addClass('b-pagination__link_state_current');
            this.collection.trigger( 'switchPage', $target.attr('href').slice( 1 ) );
        }

        return false;
    },
} );
