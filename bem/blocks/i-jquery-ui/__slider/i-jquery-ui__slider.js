require('jquery.ui/ui/slider.js');

/* "Патч" для плавного перетаскивания ui.slider */
( function( $ ) {

    var _mouseCapture;

    $.extend( $.ui.slider.prototype.options, { dragAnimate: true } );

    _mouseCapture = $.ui.slider.prototype._mouseCapture;

    $.widget( 'ui.slider', $.extend( {}, $.ui.slider.prototype, {
        _mouseCapture : function() {
            _mouseCapture.apply( this, arguments );
            this._animateOff = this.options.dragAnimate;

            return true;
        }, 
    } ) );

}( jQuery ) );

/* Конец патча */
