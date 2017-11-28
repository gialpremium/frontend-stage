( function( $ ) {
    var methods = {

        /**
         * [setPointer устанавливаем каретку в заданную позицию]
         * @params {[HTMLElement]}  this   [ инпут ]
         * @params {[json]}         params [ start: int, end: int ]
         * @return {[HTMLElement]}         [ инпут ]
         */

        setPointer : function( params ) {
            var range;
            var caret = {
                start : params.start,
                end   : params.end,
            };

            if ( this.type == 'textarea' || this.type == 'text' ) {
                if ( this.selectionStart || this.selectionStart === 0 ) {

                    /**
                     * Сафари не уводит фокус/блюр с поля при любых кликах
                     * нужно принудительно "разбудить"
                     */
                    this.focus();
                    this.setSelectionRange( caret.start, caret.end );

                }
                else if ( document.selection ) {

                    // IE8 and earlier specific code
                    this.focus();
                    range = document.selection.createRange();
                    range.moveEnd( 'character', caret.start ); // move 0 characters from current position
                    range.select();
                }
            }

            return this;
        },

        /**
         * [getInputSelection получаем позицию каретки в инпуте]
         * @param  {[HTMLElement]} this [ инпут ]
         * @return {[json]}             [ start: int, end: int ]
         */
        getPointer : function() {
            var start = 0,
                end = 0,
                normalizedValue,
                range,
                textInputRange,
                len,
                endRange;

            if ( this.type == 'textarea' || this.type == 'text' ) {


                if ( typeof this.selectionStart == 'number' && typeof this.selectionEnd == 'number' ) {
                    start = this.selectionStart;
                    end = this.selectionEnd;
                }
                else {
                    range = document.selection.createRange();

                    if ( range && range.parentElement() == this ) {
                        len = this.value.length;
                        normalizedValue = this.value.replace( /\r\n/g, '\n' );

                        // создаем TextRange для инпута
                        textInputRange = this.createTextRange();
                        textInputRange.moveToBookmark( range.getBookmark() );

                        // Проверяем где находится курсор - в конце инпута или нет
                        endRange = this.createTextRange();
                        endRange.collapse( false );

                        if ( textInputRange.compareEndPoints( 'StartToEnd', endRange ) > -1 ) {
                            start = end = len;
                        }
                        else {
                            start = -textInputRange.moveStart( 'character', -len );
                            start += normalizedValue.slice( 0, start ).split('\n').length - 1;

                            if ( textInputRange.compareEndPoints( 'EndToEnd', endRange ) > -1 ) {
                                end = len;
                            }
                            else {
                                end = -textInputRange.moveEnd( 'character', -len );
                                end += normalizedValue.slice( 0, end ).split('\n').length - 1;
                            }
                        }
                    }
                }

                return {
                    start : start,
                    end   : end,
                };
            }

        },
    };

    /**
     * [inputPointer description]
     * @param  {[type]} options [ если определен {start: int, end: int }, устанавливает каретку для инпута ]
     * @return {[type]}         [ this ]
     */
    $.fn.inputPointer = function( options ) {
        var caret,
            pointers = [];


        if ( options && options.start && options.end ) {
            return this.each( function() {
                methods.setPointer.call( this, options );
            } );
        }
        else {

            if ( this.length == 1 ) {

                methods.getPointer.call( this.get( 0 ) );

                return caret;
            }
            else {
                this.each( function() {
                    var caret = methods.getPointer.call( this.get( 0 ) );

                    pointers.push( {
                        el    : this,
                        caret : caret,
                    } );
                } );

                return pointers;
            }
        }
    };

} )( jQuery );
