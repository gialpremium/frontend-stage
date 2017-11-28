window.Site.App.Views.Table = Backbone.View.extend( {
    initialize : function() {
        this.settings = this.getTableSettings();

        this.collection.perPage = this.settings.perPage;
        this.collection.on( 'reset', this.destroy, this );
        this.collection.on( 'drawResults', this.renderRows, this );

        this.extendInitialize && this.extendInitialize();
        this.render();
    },
    template : function( data ) {
        return JST['b-table']( data );
    },
    render : function() {
        this.setElement( this.template( this.settings ) );

        if ( this.collection.perPage && ( this.collection.size() > this.collection.perPage ) ) {
            this.pagination = new Site.App.Views.TablePagination( {
                collection : this.collection,
                colspan    : this.settings.columns_num,
            } );

            this.$('tbody').after( this.pagination.el );
        }

        if ( this.$('thead .b-table__sort-link').length ) {
            this.sorting = new Site.App.Views.TableSorting( {
                collection : this.collection,
                el         : this.$('thead').get( 0 ),
            } );
        }

        this.collection.trigger('getRows');

        // console.log('Site.App.Views.Table', this)
    },
    renderRows : function( from, to ) {
        var tableRow,
            i;

        // console.log('renderRows', arguments, this, this.$el);

        if ( !this.currentResult ) {
            this.currentResult = [];
        }

        this.removeOldRows();

        for ( i = from; i < to; i++ ) {
            tableRow = new Site.App.Views.TableRow( {
                model    : this.collection.at( i ),
                settings : this.getRowSettings(),
            } );

            this.currentResult.push( tableRow );
        }

        this.$('tbody').html( _.pluck( this.currentResult, 'el' ) );
        this.collection.trigger('finishRenderRows');

        if ( this.settings.scrollOnRender ) {
            $('html, body').animate( { scrollTop: this.$el.offset().top } );
        }
    },
    removeOldRows : function() {
        this.$('tbody').empty();

        if ( this.currentResult.length ) {
            _.each( this.currentResult, function( view ) {
                view.destroy();
            }, this );

            this.currentResult.length = 0;
        }
    },
    destroy : function() {
        this.unbind();
        this.collection.off( null, this.renderRows );
        this.remove();

        // console.log('destroy', this, arguments)
    },
} );
