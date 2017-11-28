Site.App.Views.TableSorting = Backbone.View.extend( {
    initialize : function() {
        this.collection.on( 'reset', this.destroy, this );
        this.render();
    },
    render : function() {
        if ( this.collection.lastSort ) {
            this.sortResults( this.collection.lastSort );
        }

        // console.log('Site.App.Views.TableRow', this.collection.lastSort)
    },
    events      : { 'click .b-table__cell': 'sortResults' },
    sortResults : function( e ) {
        var $sortCell,
            sortAttr,
            sortOrder,
            isEvent;

        // console.log('sortResults');
        // если это клик в thead
        if ( e.target ) {
            if ( !$( e.currentTarget ).find('.b-table__sort-link').length ) {
                return;
            }

            $sortCell = $( e.currentTarget );
            sortAttr  = $sortCell.find('.b-table__sort-link').attr('href').slice( 1 );
            sortOrder = $sortCell.hasClass('b-table__cell_sorted_desc') ? 'asc' : 'desc';
            isEvent   = true;

        // e - объект
        }
        else {
            $sortCell = this.$('.b-table__sort-link').filter( '[href = #' + e.attr + ']' ).parent();
            sortAttr  = e.attr;
            sortOrder = e.order;
        }

        this.collection.sort( sortAttr, sortOrder );
        isEvent && this.collection.trigger('getRows');

        this.$('.b-table__cell').removeClass('b-table__cell_sorted_asc b-table__cell_sorted_desc');

        // this.$('.b-table__sort-link').removeClass('b-table__sort-link_sorted_desc b-table__sort-link_sorted_asc');
        $sortCell.addClass( 'b-table__cell_sorted_' + sortOrder );
    },
} );
