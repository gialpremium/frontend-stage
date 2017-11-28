// popup hiding on outer click
// example:
// $('a').click(function(e){
//    $('#popup').hooc(e, {
//        hide: function(){ $(this).slideUp(300); }
//    });
// });
( function( $ ) {
    var

        // список попапов
        _layers  = { visible: {} },

        // умолчания
        _defaults = {

            // список элементов, клик и фокус на которых игнорируется плагином всегда
            ignore : [
                '.ui-datepicker',
                '.ui-datepicker-next',
                '.ui-datepicker-next .ui-icon',
                '.ui-datepicker-prev',
                '.ui-datepicker-prev .ui-icon',
                '.ui-datepicker-current',
                '.message_box_block_bg',
                '.message_box_to_hide',
                '.message_box_to_hide *',
                '.b-popup__user-message',
                '.b-popup__user-message *',
                '.b-live-tooltip',
                '.b-dialog',
                '.b-dialog *',
            ],
            dontIgnore : [
            ],
        },

        // счетчик
        _layerIDCounter = 0,

        _setAncestors = function( layer, e ) {

            // сохраняем родительские попапы в настройки
            if ( !layer._ancestors && layer._ancestors !== null ) {
                $( e.target ).parents('.i-hooc__popup').each( function() {
                    var classes,
                        $ancestor,
                        i,
                        l;

                    if ( typeof layer._ancestors == 'undefined' ) {
                        layer._ancestors = {};
                    }

                    classes = $( this ).attr('class').match( /i-hooc__popup_id_\d+/g );

                    for ( i = 0, l = classes.length; i < l; i++ ) {

                        if ( classes[i] === layer.ID ) {
                            continue;
                        }

                        $ancestor = $( '.' + classes[i] );
                        layer._ancestors = _.extend( layer._ancestors, $ancestor.hooc('get')._ancestors );
                        layer._ancestors[classes[i].replace( /[^\d]/g, '' ) * 1] = i;
                    }
                } );

                if ( typeof layer._ancestors == 'undefined' ) {
                    layer._ancestors = null;
                }
            }
        },

        // получаем объект hooc или создаём новый
        _get = function( $layer, settings, e ) {
            var layer,
                $target;

            if ( $layer.data('hideOnOuterClick') ) {
                layer = _layers[$layer.data('hideOnOuterClick')];
                layer.settings = _.extend( layer.settings, settings );
            }
            else {
                layer = new Layer( $layer );
                _layers[layer.ID] = layer;
                $layer.data( 'hideOnOuterClick', layer.ID );

                layer.settings = _.extend( layer.settings, settings );

                layer.$ignore = $( layer.settings.ignore.join(', ') )
                    .addClass( 'i-hooc__ignore_id_' + layer.ID );
                layer.$dontIgnore = $( layer.settings.dontIgnore.join(', ') )
                    .addClass( 'i-hooc__dont-ignore_id_' + layer.ID );
            }

            if ( e ) {
                _setAncestors( layer, e );

                // помечаем ссылку-триггер
                $target = $( e.target );
                $target.add( $target.parents('a') ).addClass( 'i-hooc__ignore_id_' + layer.ID );
            }

            return layer;
        },

        // проверка, скрывать ли попап
        _check = function( $target, e ) {
            var hide,
                $test,
                layer,
                tohideID,
                id,
                tohide = {};

            for ( id in _layers.visible ) {
                layer = _layers[id];
                $test = $target;
                hide  = true;

                // на случай некорректно скрытого попапа
                if ( layer.$popup.hasClass('i-hooc__popup_visible_false') ) {
                    delete _layers.visible[id];
                    continue;
                }

                if ( $test.hasClass( 'i-hooc__popup_id_' + id ) || $test.closest( '.i-hooc__popup_id_' + id ).length ) {
                    hide = false;
                    if (
                        $test.hasClass( 'i-hooc__dont-ignore_id_' + id )
                        || $test.closest( '.i-hooc__dont-ignore_id_' + id ).length
                    ) {
                        hide = true;
                    }
                }
                else {
                    do {
                        if (
                            $test.hasClass( 'i-hooc__ignore_id_' + id )
                            || $test.closest( '.i-hooc__ignore_id_' + id ).length
                        ) {
                            hide = false;
                            break;
                        }
                        $test = $test.parent();
                    } while ( $test.length );
                }

                if ( hide ) {
                    tohide[id] = id;
                }

                if ( e ) {
                    _setAncestors( layer, e );
                }

                if ( layer.settings.keepAncestors && layer._ancestors ) {

                    // не скрываем родительские попапы
                    // предполагаем, что у предков id всегда меньше
                    for ( tohideID in tohide ) {
                        if ( tohideID in layer._ancestors ) {
                            delete tohide[tohideID];
                        }
                    }
                }
            }

            for ( tohideID in tohide ) {
                _layers[tohideID].hide( e );
            }
        },

        // обработчик-замена событий click и focus
        _bindHandler = function( handleObj ) {
            var handler = handleObj.handler;

            handleObj.handler = function( e ) {
                var skip,
                    $target,
                    i,
                    l;

                if ( e.target !== window && e.target !== document ) {

                    skip = false;
                    $target = $( e.target );

                    // не обрабатываем одно и то же событие повторно
                    if ( 'hooc' in e ) {
                        skip = true;
                    }

                    // умолчательный игнор
                    if ( !skip ) {
                        for ( i = 0, l = _defaults.ignore.length; i < l; i++ ) {
                            if ( $target.is( _defaults.ignore[i] ) ) {
                                skip = true;
                                break;
                            }
                        }
                    }

                    if ( !skip ) {
                        e.hooc = true; // не обрабатываем одно и то же событие повторно
                        _check( $target, e );
                    }
                }

                // родной обработчик
                return handler.apply( this, arguments );
            };
        };

        // класс попапа
    function Layer( popup ) {

        this.ID = ++_layerIDCounter;

        this.settings = {

            // функция, вызываемая перед закрытием. this == $popup. если возвращает false, попап не закрывается
            ifhide : function() {
                return true;
            },

            // функция, вызываемая после закрытия. this == $popup, e == event
            onhide : function() { },

            // функция, вызываемая после открытия. this == $popup, e == event
            onshow : function() { },

            // массив селекторы элементов, клик по которым не должен скрывать попап
            ignore : _defaults.ignore,

            // массив селекторов элементов, клик по которым тем не менее попап скроет
            dontIgnore : _defaults.ignore,

            // анимация скрытия. this == $popup
            hide : function() {
                $( this ).hide();
            },

            // анимация отображения. this == $popup
            show : function() {
                $( this ).show();
            },

            // не скрывать родительские попапы, если не скрывается текущий
            keepAncestors : true,
        };

        // хеш id родительских попапов, заполняется сам. null если родительских попапов нет
        // this._ancestors = undefined;

        this.$popup = $( popup )
            .addClass('i-hooc__popup')
            .addClass( 'i-hooc__popup_id_' + this.ID );
    }

    // скрыть попап
    Layer.prototype.hide = function( e ) {
        if ( this.settings.ifhide( this.$popup ) === false ) {
            return;
        }

        this.settings.hide.apply( this.$popup );
        this.$popup
            .removeClass('i-hooc__popup_visible_true')
            .addClass('i-hooc__popup_visible_false');
        this.settings.onhide.apply( this.$popup, [e] );
        delete _layers.visible[this.ID];
    };

    // показать попап
    Layer.prototype.show = function() {
        this.settings.show.apply( this.$popup );
        this.$popup
            .addClass('i-hooc__popup_visible_true')
            .removeClass('i-hooc__popup_visible_false');
        this.settings.onshow.apply( this.$popup );
        _layers.visible[this.ID] = this;
    };

    // переключить состояние попапа
    Layer.prototype.toggle = function() {
        if ( this.ID in _layers.visible ) {
            this.hide();
        }
        else {
            this.show();
        }
    };

    // замена стандартного click
    $.event.special.clickOriginal = $.event.special.click;
    $.event.special.click = { add: _bindHandler };

    // замена стандартного focus
    $.event.special.focusOriginal = $.event.special.focus;
    $.event.special.focus = { add: _bindHandler };

    // замена стандартного touchstart
    $.event.special.touchstartOriginal = $.event.special.touchstart;
    $.event.special.touchstart = { add: _bindHandler };

    // замена стандартного touchend
    $.event.special.touchendOriginal = $.event.special.touchend;
    $.event.special.touchend = { add: _bindHandler };

    // сам плагин hooc
    $.fn.hideOnOuterClick = function() {
        var e = null,
            settings = {},
            onhide = null,
            action = 'init',
            selectors = [],
            layer,
            $first,
            i,
            j,
            k,
            l;

        // порядок аргументов произвольный, допустимые аргументы:
        // [object] e, [object] settings, [string] action,
        // [function] settings.onhide, [string] selector, [array] selectors
        for ( i = 0; i < arguments.length; i++ ) {
            if ( typeof arguments[i] == 'string' ) {
                if ( action == 'init' ) {
                    action = arguments[i];
                }
                else {
                    selectors = arguments[i].split(',');
                }
            }
            else if ( typeof arguments[i] == 'function' ) {
                onhide = arguments[i];
            }
            else if ( typeof arguments[i] == 'object' ) {
                if ( arguments[i] instanceof Array ) {
                    selectors = arguments[i];
                }
                else if ( 'currentTarget' in arguments[i] ) {
                    e = arguments[i];
                }
                else {
                    settings = arguments[i];
                }
            }
        }

        if ( e ) {
            stopEvent( e );
        }

        // если любой из параметров функция - она перезапишет settings.onhide
        if ( typeof onhide == 'function' ) {
            settings.onhide = onhide;
        }

        // trim селекторов
        selectors = _.map( selectors, function( selector ) {
            return selector.replace( /(^\s+|\s+$)/g, '' );
        } );

        // API

        // дефолты
        if ( action.indexOf('.') > 0 ) {
            switch ( action ) {
            case 'ignore.add':

                // добавить умолчательные селекторы ignore
                // второй параметр - cтрока-селектор или массив строк
                // пример: $.fn.hooc('ignore.add', '.avail_unavail_list input');
                for ( i = 0, l = selectors.length; i < l; i++ ) {
                    _defaults.ignore.push( selectors[i] );
                }
                _defaults.ignore = _.uniq( _defaults.ignore );

                break;
            case 'ignore.remove':

                // убрать умолчательные селекторы ignore
                // второй параметр - cтрока-селектор или массив строк
                // пример: $.fn.hooc('ignore.remove', '.avail_unavail_list input');
                for ( i = 0, l = selectors.length; i < l; i++ ) {
                    for ( j = 0, k = _defaults.ignore.legnth; j < k; j++ ) {
                        if ( selectors[i] === _defaults.ignore[j] ) {
                            _defaults.ignore[j] = null;
                            break;
                        }
                    }
                }
                _defaults.ignore = _.compact( _defaults.ignore );
                break;
            }
        }
        else if ( action == 'get' ) { // get работает только для первого элемента
            $first = this.eq( 0 );

            layer = _get( $first, settings, e );

            return layer;

        }
        else {

            return this.each( function() {
                layer = _get( $( this ), settings, e );

                switch ( action ) {
                case 'set':

                    // поменять настройки
                    break;

                case 'hide':

                    // скрыть попап
                    layer.hide();
                    break;

                case 'toggle':

                    // переключить состояние попапа
                    layer.toggle();
                    break;

                case 'init':
                case 'show':
                default:

                    // показать попап
                    layer.show();
                    break;
                }
            } );
        }
    };

    // короткое название плагина
    $.fn.hooc = $.fn.hideOnOuterClick;

    $( function() {

        /**
         * пустой обработчик на документе, чтобы срабатывал клик на элементах без обработчика
         *
         * @example
         *  $(document).on('click', function(e) {
                ...           // переопределение обработчика вместе с return false
                return false; // ломает поведедение hooc'а
            });
         */
        $( document ).on( 'click touchstart touchend', function() {} );
    } );

    window._layers = _layers;
} )( jQuery );
