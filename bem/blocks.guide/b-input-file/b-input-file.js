window.JST = window.JST || {};
window.JST['b-input-file'] = require('./b-input-file.jade');

( function( $ ) {
    var MINSIZE_FILE_BYTES = 8;

    var options = {
        minfile : MINSIZE_FILE_BYTES,
        STRING  : {
            en : { remove: '' },
            ru : { remove: '' },
        },
        multifileName : 'b-input-file',
        wrapper       : '.b-input-file__button-wrap',
        lang          : lang || 'ru',

        /**
         * Коллбэк после добавления файла в список, устанавливает ширину списка
         * равную ширине кнопки. Также прячет кнопку, если макс. кол-во файлов = 1.
         * @method afterFileAppend
         * @private
         */
        afterFileAppend : function( element, value, multifile ) {
            multifile.list
                .width( multifile.block.find('.b-button').outerWidth( true ) );

            if ( multifile.max == 1 ) {
                multifile.wrapper.addClass('b-input-file__button-wrap_display_none');
            }
        },

        /**
         * Коллбэк после удаления файла. Показывет кнопку, если кол-во файлов = 1.
         * @method afterFileRemove
         * @private
         */
        afterFileRemove : function( element, value, multifile ) {
            if ( multifile.max == 1 ) {
                multifile.wrapper.removeClass('b-input-file__button-wrap_display_none');
            }
        },

        /**
         * Клиентский коллбэк после удаления файла
         * @method afterFileRemoveCallback
         * @public
         */
        afterFileRemoveCallback : function() {

            // element, value, multifile
        },

        /**
         * Коллбэк после добавления файла в список
         * @method afterFileAppendCallback
         * @public
         */
        afterFileAppendCallback : function() {

            // element, value, multifile
        },
    };

    /**
     * Инициализиуем плагин $.MultiFile для блока b-input-file
     * @class b-input-file
     * @uses $.MultiFile
     */

    $.fn.bInputFile = function() {
        return this.each( function() {
            var $block    = $( this ),
                $input    = $( '.b-input-file__input', $block ),
                params    = $.extend( $block.data(), options );

            params.minsize = params.minsize || options.minfile;

            $input.MultiFile( params );

            $block.data( 'MultiFile', $input.MultiFile('data') );
        } );
    };

    // init
    $( function() {
        $('.b-input-file').bInputFile();

        $( document ).on( 'mouseenter', '.b-input-file__button-wrap', function() {
            $( '.b-button', this ).addClass('b-button_state_hover');
        } ).on( 'mouseleave', '.b-input-file__button-wrap', function() {
            $( '.b-button', this ).removeClass('b-button_state_hover');
        } );

        // Исключить случайное нажатие кнопки
        $( document ).on( 'click', '.b-input-file .b-button', function() {
            return false;
        } );
    } );

} )( jQuery );
