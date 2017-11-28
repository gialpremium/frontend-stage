Site.namespace('Site.App.BugReporter.Manager');

( function() {

    var ENTER_KEY_CODE = 13;

    var _bugReporterManagerSingleton = null;
    var _bugReporterInstance = null;

    /**
     * Исправляет недостатки нативного Range, нужен для точного
     * определения координат выбранного текста. Например, для случаев: 1. выделено
     * несколько абзацев (со строками переноса); 2. Выделение захватывает
     * перенос строки в конце абзаца (<br>). Создает textNodes в элементе, поэтому
     * после использования лучше зачистить с помощью element.normalize
     * https://github.com/mir3z/texthighlighter/blob/master/src/TextHighlighter.js#L75
     * @method refineRangeBoundaries
     * @param  {Object} range window.getSelection().getRangeAt(0)
     * @return {Object}
     */
    function refineRangeBoundaries( range ) {
        var startContainer = range.startContainer,
            endContainer = range.endContainer,
            ancestor = range.commonAncestorContainer;

        if ( range.endOffset === 0 ) {
            while ( !endContainer.previousSibling && endContainer.parentNode !== ancestor ) {
                endContainer = endContainer.parentNode;
            }
            endContainer = endContainer.previousSibling;
        }
        else if ( endContainer.nodeType === 3 ) {
            if ( range.endOffset < endContainer.nodeValue.length ) {
                endContainer.splitText( range.endOffset );
            }
        }
        else if ( range.endOffset > 0 ) {
            endContainer = endContainer.childNodes.item( range.endOffset - 1 );
        }

        if ( startContainer.nodeType === 3 ) {
            if ( range.startOffset !== startContainer.nodeValue.length && range.startOffset > 0 ) {
                startContainer = startContainer.splitText( range.startOffset );

                if ( endContainer === startContainer.previousSibling ) {
                    endContainer = startContainer;
                }
            }
        }
        else if ( range.startOffset < startContainer.childNodes.length ) {
            startContainer = startContainer.childNodes.item( range.startOffset );
        }
        else {
            startContainer = startContainer.nextSibling;
        }

        return {
            startContainer : startContainer,
            endContainer   : endContainer,
        };
    }

    /**
     * Класс -- контроллер отправки сообщений о багах с сайта.
     * Проверяет наличие выделенного текста, реагирует на нажатие
     * ctrl (cmd) + enter и подгружает скрипт самой формы отправки.
     * @class BugReporterManager
     * @constructor
     */
    function BugReporterManager() {
        this.init();
    }

    /**
     * Возвращает синглтон BugReporterManager.
     * @static
     * @method getInstance
     * @for BugReporterManager
     * @return {Object} Синглтон класса BugReporterManager
     */
    BugReporterManager.getInstance = function() {
        if ( !_bugReporterManagerSingleton ) {
            _bugReporterManagerSingleton = new BugReporterManager();
        }

        return _bugReporterManagerSingleton;
    };

    /**
     * Метод инициализации конструктора. Создаёт загрузчик для формы.
     * Активирует обработчики событий и вызывает создание prefetch-link.
     * @method init
     * @for BugReporterManager
     * @uses Site.App.Auth.Modules.Loader Загрузчик произвольных скриптов
     */
    BugReporterManager.prototype.init = function() {
        this.initHandlers();
    };

    /**
     * Загрузка и инициализация скрипта баг-репортера.
     * @private
     * @method loadBugReporterAsync
     * @for BugReporterManager
     * @return {Promise} Статус готовности репортера
     */
    BugReporterManager.prototype.loadBugReporterAsync = function() {
        var self = this;

        return import('b-bug-reporter/b-bug-reporter.deps.js')
            .then( function() {
                self.initBugReporter();
            } );
    };

    /**
     * Инициализируем экземпляр баг-репортера.
     * @private
     * @method initBugReporter
     * @for BugReporterManager
     * @uses Site.App.BugReporter.Core скрипт формы отправки сообщений об ошибке
     */
    BugReporterManager.prototype.initBugReporter = function() {
        _bugReporterInstance = Site.App.BugReporter.Core.getInstance();

        return true;
    };

    /**
     * Проверяет наличие загруженного скрипта репортера.
     * @private
     * @method isReporterLoaded
     * @for BugReporterManager
     * @return {Boolean} true - загружен, false - не загружен
     */
    BugReporterManager.prototype.isReporterLoaded = function() {
        return !!_bugReporterInstance;
    };

    /**
     * Инициализируем обработчики, которые должны быть созданы до инициализации репортера
     * @private
     * @method initHandlers
     * @for BugReporterManager
     */
    BugReporterManager.prototype.initHandlers = function() {
        var self = this;

        $('body').on( 'keyup', function( e ) {
            if ( e.ctrlKey && e.keyCode === ENTER_KEY_CODE ) {
                return self.checkTarget( e );
            }
            else if ( self.meta && e.keyCode === ENTER_KEY_CODE ) {
                self.meta = false;

                return false;
            }
        } ).on( 'keydown', function( e ) {
            if ( e.metaKey && e.keyCode === ENTER_KEY_CODE ) {
                self.meta = true;

                return self.checkTarget( e );
            }
        } );
    };

    /**
     * Непосредственно обработка нажатия клавиш. Само нажатие проверяется в initHandlers
     * @param  {Object} e Event
     * @return {Boolean}
     */
    BugReporterManager.prototype.checkTarget = function( e ) {
        if ( e.target.className.match('ctrl-enter-submit') === null
            && e.target.nodeName !== 'INPUT'
            && e.target.nodeName !== 'TEXTAREA'
        ) {
            stopEvent( e );
            this.openPopup();

            return false;
        }

        return true;
    };

    /**
     * Возвращает выделенный текст на странице
     * @private
     * @method getSelectionText
     * @for BugReporterManager
     */
    BugReporterManager.prototype.getSelectionText = function() {
        var text = '';

        if ( window.getSelection ) {

            /*
                Текст, полученный через window.getSelection(),
                не соответствует аналогичному участку текста, находящемуся внутри context,
                полученного с помощью document.createRange() в getSelectionContext.
                Они отличаются длиной (переносами/лишними пробелами), и это приводит к ошибке
                при расчёте длины текста, необходимого для выделения strong'ом.
            */

            text = window.getSelection().getRangeAt( 0 ).toString();
        }
        else if ( document.selection && document.selection.type !== 'Control' ) {
            text = document.selection.createRange().text;
        }

        return text;
    };

    /**
     * Возвращает выделенный текст на странице + соседние слова
     * @private
     * @method getSelectionContext
     * @for BugReporterManager
     */
    BugReporterManager.prototype.getSelectionContext = function() {
        var selection,
            selectionContext,
            comparedPosition,
            startPosition,
            endPosition,
            isSelectionBackward = false,
            contextSize         = 200,
            refinedBoundaries,
            startOffset,
            newSelectionContext;

        if ( window.getSelection ) {
            selection = window.getSelection();

            if ( !selection.anchorNode ) {
                return '';
            }

            comparedPosition = selection.anchorNode.compareDocumentPosition( selection.focusNode );

            // comparedPosition == 0 if nodes are the same

            startOffset = selection.anchorOffset;

            if (
                !comparedPosition && selection.anchorOffset > selection.focusOffset
                || comparedPosition === Node.DOCUMENT_POSITION_PRECEDING
            ) {
                isSelectionBackward = true;
                startOffset = selection.focusOffset;
            }

            newSelectionContext = document.createRange();

            if ( isSelectionBackward ) {
                startPosition = selection.focusOffset >= contextSize ? selection.focusOffset - contextSize : 0;

                newSelectionContext.setStart( selection.focusNode, startPosition );

                if ( selection.anchorNode.length ) {
                    endPosition = ( selection.anchorNode.length - selection.anchorOffset ) >= contextSize
                        ? ( selection.anchorOffset + contextSize )
                        : selection.anchorNode.length;

                    newSelectionContext.setEnd( selection.anchorNode, endPosition );
                }
                else {
                    refinedBoundaries = refineRangeBoundaries( selection.getRangeAt( 0 ) );
                    newSelectionContext.setEnd( refinedBoundaries.endContainer, refinedBoundaries.endContainer.length );
                    refinedBoundaries.endContainer.parentNode.normalize();
                }
            }
            else {
                startPosition = selection.anchorOffset >= contextSize ? selection.anchorOffset - contextSize : 0;

                newSelectionContext.setStart( selection.anchorNode, startPosition );

                if ( selection.focusNode.length ) {
                    endPosition = ( selection.focusNode.length - selection.focusOffset ) >= contextSize
                        ? ( selection.focusOffset + contextSize )
                        : selection.focusNode.length;

                    newSelectionContext.setEnd( selection.focusNode, endPosition );
                }
                else {
                    refinedBoundaries = refineRangeBoundaries( selection.getRangeAt( 0 ) );
                    newSelectionContext.setEnd( refinedBoundaries.endContainer, refinedBoundaries.endContainer.length );
                    refinedBoundaries.endContainer.parentNode.normalize();
                }

            }

            return {
                text  : newSelectionContext.toString(),
                start : startOffset - newSelectionContext.startOffset,
            };

        }
        else if ( document.selection && document.selection.type !== 'Control' ) {

            selectionContext = document.selection.createRange();
            selectionContext.moveStart( 'character', -contextSize );
            selectionContext.moveEnd( 'character', contextSize );

            return {
                text  : selectionContext.text,
                start : contextSize,
            };
        }

    };

    /**
     * Загружает репортер и при готовности показывает его
     * @private
     * @method openPopup
     * @for BugReporterManager
     */
    BugReporterManager.prototype.openPopup = function() {
        var self = this;

        this.getReporter()
            .then( function() {
                _bugReporterInstance.init( self.getSelectionText(), self.getSelectionContext() );
                _bugReporterInstance.showReporter();
            } );
    };

    /**
     * Получить промис загруженного репортера
     * @return Promise
     */
    BugReporterManager.prototype.getReporter = function() {
        if ( this.isReporterLoaded() ) {
            return Promise.resolve( true );
        }
        else {
            return this.loadBugReporterAsync();
        }
    };

    Site.App.BugReporter.Manager = { getInstance: BugReporterManager.getInstance };
    Site.App.BugReporter.Manager.getInstance();

} )();
