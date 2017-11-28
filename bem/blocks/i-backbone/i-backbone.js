window.Backbone = require('imports-loader?this=>window!backbone/backbone.js');
window.Backbone.$ = require('jquery');

Backbone.View = Backbone.View.extend( {
    destroy : function() {
        this.undelegateEvents();
        this.unbind();
        this.remove();
    }, 
} );
