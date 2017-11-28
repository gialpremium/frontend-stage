Site.namespace('Site.App.BugReporter.Core');

( function() {

    var _bugReporterSingleton = null;

    /**
     * Класс описывает форму отправки сообщений о багах
     * @class BugReporter
     * @constructor
     */
    function BugReporter() {}

    /**
     * Возвращает синглтон BugReporter.
     * @static
     * @method getInstance
     * @for BugReporter
     * @return {Object} Синглтон класса BugReporter
     */
    BugReporter.getInstance = function() {
        if ( !_bugReporterSingleton ) {
            _bugReporterSingleton = new BugReporter();
        }

        return _bugReporterSingleton;
    };

    /**
     * Метод инициализации.
     * @param  {String} selection выделенный текст
     * @method init
     * @for BugReporter
     */
    BugReporter.prototype.init = function( selection, context ) {
        this.renderReporter( selection, context );
        this.initHandlers( selection, context );
    };

    /**
     * Рисует репортер в попапе и инициализирует аттачменты внутри него.
     * @param  {String} selection выделенный текст
     * @param  {Object} context
     * @param  {String} context.text текст вокруг выделения
     * @param  {Integer} context.start позиция первого символа выделенного текста
     * @private
     * @method renderReporter
     * @for BugReporter
     */
    BugReporter.prototype.renderReporter = function( selection, context ) {
        var splittedContext = null;

        if ( selection.length && context ) {
            if ( selection.trim().length !== context.text.trim().length ) {
                splittedContext = this.getSplittedContext( selection, context );
            }

            $('.b-bug-reporter__content-wrapper')
                .html( require('./b-bug-reporter.jade')( {
                    selection : selection,
                    context   : splittedContext,
                } ) )
                .find('.b-input-file')
                .bInputFile();
        }
        else {
            $('.b-bug-reporter__content-wrapper')
                .html( require('./b-bug-reporter_selection_none.jade')() );
        }
    };

    /**
     * Делит текст вокруг выделения на строки до и после
     * @param  {String}  selection выделенный текст
     * @param  {Object}  context
     * @param  {String}  context.text текст вокруг выделения
     * @param  {Integer} context.start позиция первого символа выделенного текста
     * @private
     * @method getSplittedContext
     * @for BugReporter
     * @return {Object} Объект, содержащий строки находящиеся до/после выделения.
     */
    BugReporter.prototype.getSplittedContext = function( selection, context ) {
        return {
            begin : context.text.substr( 0, context.start ),
            end   : context.text.substr( context.start + selection.length ),
        };
    };

    /**
     * Инициализация обработчиков внутри формы
     * @param  {String} selection выделенный текст
     * @param  {String} context   текст вокруг выделения
     * @private
     * @method initHandlers
     * @for BugReporter
     */
    BugReporter.prototype.initHandlers = function( selection, context ) {
        var $form = $('.b-bug-reporter__form'),
            $loading = $( JST['b-loading']( {
                wrapped : true,
                bgColor : 'invert',
            } ) ),
            data = {
                context       : context.text,
                text          : selection,
                url           : window.location.href,
                use_faq_email : Site.App.BugReporter.IsFaqEmail ? '1' : '0',
            };

        if ( REGRU.user ) {
            data.user = REGRU.user;
        }

        $form.on( 'submit', function() {
            $form.ajaxSubmit( {
                type         : 'POST',
                dataType     : 'json',
                data         : data,
                beforeSubmit : function() {
                    $form.prepend( $loading );
                },
                success : function( data ) {
                    $loading.remove();

                    if ( data.success ) {
                        alert( t('bug_reporter.success'), {
                            ok : function() {
                                $('.b-bug-reporter').hooc('hide');
                                this.close();
                            }, 
                        } );
                    }
                },
                error : function() {
                    alert( t('common.SERVER_ERROR') );
                    $loading.remove();
                },
            } );

            return false;
        } );
    };

    /**
     * Показывает попап с репортером
     * @param  {Boolean} isTextSelected был ли выделен текст на момент вызова
     * @method showReporter
     * @for BugReporter
     */
    BugReporter.prototype.showReporter = function( /* isTextSelected */ ) {
        var self = this;

        $('.b-bug-reporter').hooc( 'show', {
            onhide : function() {
                self.clearReporter();
            }, 
        } );

        if ( !Modernizr.input.placeholder && typeof $.fn.placeholder !== 'undefined' ) {
            $('.b-bug-reporter').placeholder();
        }
    };

    /**
     * Очищает форму
     * @private
     * @method clearReporter
     * @for BugReporter
     */
    BugReporter.prototype.clearReporter = function() {
        $('.b-bug-reporter__content-wrapper').empty();

        return this;
    };

    Site.App.BugReporter.Core = { getInstance: BugReporter.getInstance };

} )();
