Site.App.Views.TableRow = Backbone.View.extend( {
    initialize : function() {
        this.model.collection.on( 'reset', this.destroy, this );
        _.extend( this, this.options.settings );

        this.extendInitialize && this.extendInitialize();
        this.render();
    },
    template : function( data ) {
        return JST['b-table__item']( data );
    },
    render : function() {
        var templateData = this.renderCells();

        this.setElement( this.template( templateData ) );

        // console.log('Site.App.Views.TableRow', this)
    },

    // default methods for format data
    formatDomain : function( domain ) {
        var matches = domain.match( /^([^.]+)\.(.*)$/ );

        return matches[1] + '<b>.' + matches[2] + '</b>';
    },
    formatPrice : function( price ) {

        // TODO wanna delete me? grep all this.formatPrice calls
        // price = _.isNumber(price) ? price : Math.floor(price);

        return locale.formatPrice( price, true, true );
    },
} );
