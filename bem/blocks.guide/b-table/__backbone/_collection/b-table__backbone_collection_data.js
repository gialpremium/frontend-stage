window.Site.App.Collections.TableData = Backbone.Collection.extend( {
    initialize : function( options ) {
        this.perPage = options && options.perPage ? options.perPage : 20;
        this.resultsCounter = 1; // кол-во запросов
        this.lastSort = false;

        // this.lastSort = {
        //     attr: '',
        //     order: ''
        // };

        this.on( 'switchPage getRows', this.processMethod, this );
        this.extendInitialize && this.extendInitialize();
    },
    processMethod : function( page ) {

        // console.log('processMethod', page)
        var startIndex,
            endIndex;

        if ( !page ) {
            startIndex = this.getStartIndex();
        }
        else {
            startIndex = this.getStartIndex( page );
            this.currentPage = page;
        }

        endIndex = this.getEndIndex( startIndex );

        this.trigger( 'drawResults', startIndex, endIndex );
    },
    getStartIndex : function( page ) {

        // console.log('getStartIndex');
        var index;

        if ( page ) {
            index = this.perPage * ( page - 1 );
        }
        else if ( this.currentPage ) {
            index = this.perPage * ( this.currentPage - 1 );
        }
        else {
            index = 0;
        }

        return index < 0 ? 0 : index;
    },
    getEndIndex : function( startIndex ) {

        // console.log('getEndIndex');
        return startIndex + this.perPage < this.size() ? startIndex + this.perPage : this.size();
    },
    sort : function( attr, order ) {
        this.models = this.sortBy( function( model ) {
            var value = model.get( attr );

            if ( attr == 'price' ) {
                return this.sortingNum( value, order );
            }
            else if ( attr == 'domain' ) {
                return this.sortingStr( value, order );
            }

        }, this );

        this.lastSort = {
            attr  : attr,
            order : order,
        };

        return this;
    },
    sortingNum : function( value, order ) {
        if ( order == 'asc' ) {
            return -value * 1;
        }
        else {
            return value * 1;
        }
    },
    sortingStr : function( value, order ) {
        if ( order == 'asc' ) {
            return _.map( value.toLowerCase().split(''), function( letter ) {
                return String.fromCharCode( -( letter.charCodeAt( 0 ) ) );
            } );
        }
        else {

            return value.toLowerCase();
        }
    },
} );
