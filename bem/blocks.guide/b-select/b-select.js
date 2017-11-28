window.JST = window.JST || {};
window.JST['b-select'] = require('./b-select.jade');

( function( $ ) {

    'use strict';

    /**
     * jQuery плагин кастомизированного селекта
     * @class bSelect
     * @submodule $
     * @namespace $
     * @static
     */
    var pluginName     = 'bSelect',
        scrollBarWidth = $.getScrollbarWidth(),
        deviceType     = window.currentClient.deviceType,
        defaults       = {

            /**
             * Именование классов в верстке
             * block    - класс блока
             * current  - общий элемент выбранной опции
             * title    - заголовок выбранной опции
             * text     - текст выбранной опции
             * wrapper  - обертка выпадающего списка
             * list     - выпадающий список
             * listItem - элемент выпадающего списка
             * error    - ошибка
             * input    - инпут для ручного ввода
             * @type {string}
             * @optional
             */
            selectors : {
                block    : 'b-select',
                current  : 'b-select__current',
                title    : 'b-select__title',
                text     : 'b-select__text',
                wrapper  : 'b-select__wrapper',
                list     : 'b-select__list',
                listItem : 'b-select__list-item',
                select   : 'b-select__select',
                error    : 'b-select__error',
                input    : 'b-select__manual-input',
            },

            /**
             * Дополнительные классы состояний
             * @type {Object}
             */
            state : {
                disabled : '_state_disabled',
                selected : '_state_selected',
                active   : '_state_active',
                error    : '_state_error',
                matched  : '_state_matched',
            },

            /**
             * Ручной ввод
             * @type {Boolean}
             */
            isManualInput : false,

            /**
             * Коллбэкк, срабатывает после установки выбранного элемента
             * @method onSelected
             */
            onSelected : function() {

                // callback
            },
        },

        /**
         * Публичные методы, доступные через $(selector).bSelect(method, [...params])
         * @type {Object}
         */
        publicMethods = {

            /**
             * Открывает дропдаун
             * @method open
             * @param  {Event}     e Объект события, нужен для hooc
             */
            open : function( e ) {

                this.$list.hooc( 'toogle', function() {
                    this.$block.removeClass( this._states.block.active );
                }.bind( this ), e );

                this.$block.addClass( this._states.block.active );

                // селект может быть скрыт другим блоком, поэтому
                // фиксим высоту при открытии дропа
                if ( this.$block.data('size') && !this.$list.data('height') ) {
                    this._setListHeight( this.$block.data('size') );
                    this.$list.data( 'height', this.$list.height() );
                }
            },

            /**
             * Закрывает дропдаун
             * @method close
             * @param  {Event}      e Объект события, нужен для hooc
             */
            close : function( e ) {
                this.$block.removeClass( this._states.block.active );
                this.$list.hooc( 'hide', e );
            },

            /**
             * Включает селект
             * @method enable
             * @chainable
             */
            enable : function() {
                this.$block.removeClass( this._states.block.disabled );
                this.$select.removeAttr( 'disabled', 'disabled' );

                return this;
            },

            /**
             * Переключает в состояние disabled, выключает селект
             * @method disable
             * @chainable
             */
            disable : function() {
                this.$block.addClass( this._states.block.disabled );
                this.$select.attr( 'disabled', 'disabled' );

                return this;
            },

            /**
             * Устанавливает сначала высоту списка, затем ширину дропдауна
             * @chainable
             * @method setDimensions
             */
            setDimensions : function() {
                this.$list
                    .addClass( this.settings.selectors.list + '_switch_visibility' )
                    .data( 'height', this.$list.height() );

                if ( this.settings.listSize ) {
                    this._setListHeight( this.settings.listSize );
                }

                if ( !this.$block.data('autowidth') ) {
                    this.setWrapperWidth();
                }

                this.$list.removeClass( this.settings.selectors.list + '_switch_visibility' );
            },

            /**
             * Устанавливает ширину дропдауна с учетом скроллбара
             * @method setWrapperWidth
             */
            setWrapperWidth : function() {
                var wrapperWidth = this.$list.width();

                if ( this.$list.data('height') > this.$list.height() ) {
                    wrapperWidth += scrollBarWidth;
                }

                this.$wrapper.width( wrapperWidth );

                return this;
            },

            /**
             * Устанавливает элемент, меняет value селекта
             * @method setCurrent
             * @param  {String}   value Значение селекта
             */
            setCurrent : function( value ) {
                this._setCurrentItem( value );
                this.$select.val( value );
            },

            /**
             * Показывает ошибку
             * @method showError
             * @param  {String}  text Текст ошибки
             */
            showError : function( text ) {
                if ( !this.$error.length ) {
                    this.$error = $( '<div class="' + this.settings.selectors.error + '" />' )
                        .html( text )
                        .appendTo( this.$block );
                }
                else {
                    this.$error.html( text );
                }

                this.$block.addClass( this._states.block.error );
            },

            /**
             * Убирает ошибку
             * @method hideError
             */
            hideError : function() {
                this.$block.removeClass( this._states.block.error );
            },

            /**
             * Меняем настройки плагина для каждого объекта
             * @method setOption
             * @param  {String}             option Имя опции
             * @param  {String|Function}    value  Значение опции
             */
            setOption : function( option, value ) {
                if ( this.settings[option] && typeof value !== 'undefined' ) {
                    this.settings[option] = value;
                }
                else {
                    console.error('Option not found or value is undefined');
                }

            },
        };


    /**
     * Конструктор плагина
     * @method Select
     * @param  {Object} element DOM-элемент для которого вызывается плагин
     * @param  {Object} options Настройки
     * @constructor
     */
    function Select( element, options ) {
        this.element    = element;
        this.settings   = $.extend( {}, defaults, options );
        this._defaults  = defaults;
        this._name      = pluginName;
        this._states    = this._generateStates( ['block','listItem'] );
        this._selectors = this._generateSelectors();
        this.init();
    }

    $.extend( Select.prototype, publicMethods, {

        /**
         * Инициализация плагина, вешаем события,
         * устанавливаем высоту и ширину дропдауна
         * @method init
         * @private
         */
        init : function() {

            this.$block   = $( this.element );
            this.$current = $( this._selectors.current, this.element );
            this.$list    = $( this._selectors.list, this.element );
            this.$items   = $( this._selectors.listItem, this.element );
            this.$select  = $( this._selectors.select, this.element );
            this.$wrapper = $( this._selectors.wrapper, this.element );
            this.$error   = $( this._selectors.error, this.element );
            this.$input   = $( this._selectors.input, this.element );
            this.$selected = this.$items.filter( '[data-value="' + this.$select.val() + '"]' );

            this.settings.listSize = parseInt( this.$block.data('size') );

            this.setDimensions();

            if ( this.$input.length ) {
                this.settings.isManualInput = true;
                this.$select.attr( 'disabled', 'disabled' );
                this.$block.addClass( this.settings.selectors.block + '_manual-input_active' );
            }

            if ( deviceType == 'mobile' ) {
                this.$block.addClass( this.settings.selectors.block + '_mode_native' );
            }
        },

        /**
         * Устанавливает ширину дропдауна с учетом скроллбара
         * @method _setWrapperWidth
         * @chainable
         * @private
         */
        _setWrapperWidth : function() {
            var wrapperWidth = this.$list.width();

            if ( this.$list.data('height') > this.$list.height() ) {
                wrapperWidth += scrollBarWidth;
            }

            this.$wrapper.width( wrapperWidth );

            return this;
        },

        /**
         * Устанавливает высоту списка в зависимости от атрибута size
         * @param {int} size высота списка в кол-ве его элементов
         * @method _setListHeight
         * @private
         */
        _setListHeight : function( size ) {
            var itemsToShow = parseInt( size ),
                listHeight = 0;

            this.$items.each( function( index ) {
                listHeight += $( this ).innerHeight();

                if ( index === itemsToShow - 1 ) {
                    return false;
                }
            } );

            this.$list.height( listHeight );
        },

        /**
         * Устанавливает заголовок и текст выбранного элемента
         * @method setCurrentItem
         * @param  {String}   value Значение селекта
         * @private
         */
        _setCurrentItem : function( value ) {
            var $selected = this.$items.filter( '[data-value="' + value + '"]' ),
                data  = $selected.data() || {},
                title = data.title || $( this._selectors.title, $selected ).html(),
                text  = data.text || $( this._selectors.text, $selected ).html();

            this.$items.removeClass( this._states.listItem.active );
            $selected.addClass( this._states.listItem.active );

            $( this._selectors.title, this.$current ).html( title );
            $( this._selectors.text, this.$current ).html( text );

            if ( !this.$block.hasClass( this._states.block.selected ) ) {
                this.$block.addClass( this._states.block.selected );
            }

            this.$selected = $selected;

            // this._testWrapperWidth();
        },

        /**
         * Проверяем ширину враппера, если заголовок и текст выбранной опции
         * не помещаюся в дроп чем ожидалось - селект растянется.
         * @method _testWrapperWidth
         * @private
         */
        _testWrapperWidth : function() {
            var wrapperWidth = this.$wrapper.width();

            this.$wrapper.css( { 'width': 'auto' } );

            if ( this.$wrapper.width() > wrapperWidth ) {
                wrapperWidth = this.$wrapper.width();
            }

            this.$wrapper.width( wrapperWidth );
        },

        /**
         * [generateSelectors description]
         * @method generateSelectors
         * @return {Object} selectors Объект с классами-селекторами
         * @private
         */
        _generateSelectors : function() {
            var selectors = {},
                i;

            for ( i in this.settings.selectors ) {
                selectors[i] = '.' + this.settings.selectors[i];
            }

            return selectors;
        },

        /**
         * Генерит классы состояний
         * @method generateStates
         * @param  {Array}  elements массив с именами селекторов для которых
         * сгенерить состояния
         * @return {Object} states   объект с готовыми классами
         * @private
         */
        _generateStates : function( elements ) {
            var states = {},
                name,
                i,
                s;

            for ( i = 0; i < elements.length; i++ ) {
                name = elements[i];

                for ( s in this.settings.state ) {
                    states[name] = states[name] || {};
                    states[name][s] = this.settings.selectors[name] + this.settings.state[s];
                }
            }

            return states;
        },

        /**
         * Показывает только опции с совпадениями
         * @method showRelevantItems
         * @private
         * @chainable
         */
        _showRelevantItems : function() {
            var value = this.$input.val(),
                regExp = new RegExp( Site.App.Common.escapeRegexString( value ) , 'i' ),
                itemsToShow = 0,
                self = this;

            this.$items.removeClass( self._states.listItem.matched ).each( function() {
                if ( $( this ).data('title').match( regExp ) ) {
                    $( this ).addClass( self._states.listItem.matched );
                }
            } );

            this.$input.removeAttr('disabled');
            this.$select.attr( 'disabled', 'disabled' );

            itemsToShow = this.$items.hide().filter( '.' + self._states.listItem.matched ).show().length;

            if ( !itemsToShow ) {
                this.$list.height( 0 );
                this.close();
            }
            else {
                this.open();
                this._setListHeight( Math.min( itemsToShow, this.settings.listSize ) );
            }

            return this;
        },

        events : {

            /**
             * При срабатывании change селекта устанавливает текущий выбранный элемент
             * @method onSelectChange
             * @param  {Event}       e Объект события
             * @private
             */
            onSelectChange : function( e ) {
                this.setCurrent( this.$select.val() );
                this.close( e );

                if ( typeof this.settings.onSelected === 'function' ) {
                    this.settings.onSelected.apply( this, arguments );
                }
            },

            /**
             * При клике на элемент списка дропдауна, вызывает change селекта
             * и при наличии инпута дизейблит последний
             * @method onListItemClick
             * @param  {Object}        $item
             * @private
             */
            onListItemClick : function( $item ) {
                if ( !$item.hasClass( this._states.listItem.disabled ) ) {
                    if ( this.$select.val() !== $item.data('value') ) {
                        if ( this.settings.isManualInput ) {
                            this.$input.attr( 'disabled', 'disabled' ).val( $item.data('title') );
                            this.$select.removeAttr('disabled');
                            this._setListHeight( this.settings.listSize );
                            this.close();
                            this.$items.show();
                            $.validator.defaults.unhighlight( this.$input, 'glamor_error_border' );
                        }

                        this.$select.val( $item.data('value') ).trigger('change');
                    }
                    else {
                        this.close();
                    }

                }
            },

            /**
             * Событие при клике на дропдаун
             * @method onCurrentClick
             * @param  {Event} e Объект события
             * @private
             */
            onCurrentClick : function( e ) {

                if ( !this.$block.hasClass( this._states.block.disabled ) ) {
                    if ( this.$block.hasClass( this._states.block.active ) ) {
                        this.close( e );
                    }
                    else {
                        this.open( e );
                        this.hideError();
                        if ( this.settings.isManualInput ) {
                            this.$select.attr( 'disabled', 'disabled' );
                            this.$input.removeAttr('disabled').focus();
                        }
                    }
                }
            },

            /**
             * Событие при печатании в инпуте
             * @method onInputKeyup
             * @param  {Event} e Объект события
             * @private
             */
            onInputKeyup : function() {
                this._showRelevantItems();
            },
        },

    } );

    $.fn[pluginName] = function( options ) {
        var settings = $.extend( {}, defaults, typeof options === 'string' ? '' : options ),
            args = Array.prototype.slice.call( arguments, 1 );

        var $nodes = this.each( function() {
            var pluginData = $.data( this, pluginName ),
                method;

            if ( pluginData ) {
                if ( typeof options === 'string' ) {
                    method = publicMethods[options];

                    if ( method && typeof method === 'function' ) {
                        method.apply( pluginData, args );
                    }
                    else {
                        console.error( 'Unknown method: \'' + method + '\'' );
                    }
                }
            }
            else {
                $.data( this, pluginName, new Select( this, options ) );
            }

        } );

        if ( !$.data( document, pluginName + 'bindEvents' ) ) {
            $.data( document, pluginName + 'bindEvents', true );

            bindEvents( ['block', 'select', 'current', 'listItem'] );
        }

        /**
         * Бинд событий через document
         * @method bindEvents
         * @param  {Array}   items необходмые для бинда селекторы
         * @private
         */
        function bindEvents( items ) {
            var selectors = {},
                i;

            for ( i = 0; i < items.length; i++ ) {
                selectors[items[i]] = '.' + settings.selectors[items[i]];
            }


            $( document )
                .on( ( deviceType == 'mobile' ? 'touchstart' : 'click' ) + '.' + pluginName,
                    selectors.block, function( e ) {
                        var bSelect = $( e.target ).closest( selectors.block ).data( pluginName ),
                            $target = $( e.target ),
                            $listItem;

                        if ( bSelect && !bSelect.settings.isManualInput && deviceType == 'mobile' ) {
                            return false;
                        }

                        if ( bSelect ) {
                            bSelect.events.onCurrentClick.apply( bSelect, arguments );

                            $listItem = $target.closest( selectors.listItem );

                            if ( $listItem.length ) {
                                bSelect.events.onListItemClick.apply( bSelect, [$listItem] );
                            }
                        }
                    } )
                .on( 'change.' + pluginName, selectors.select, function( e ) {
                    var bSelect = $( e.target ).closest( selectors.block ).data( pluginName );

                    if ( bSelect ) {
                        bSelect.events.onSelectChange.apply( bSelect, arguments );
                    }
                } )
                .on( 'keyup.' + pluginName, selectors.input, function( e ) {
                    var bSelect = $( e.target ).closest( selectors.block ).data( pluginName );

                    if ( bSelect && bSelect.settings.isManualInput ) {
                        bSelect.events.onInputKeyup.apply( bSelect, arguments );
                    }
                } );
        }

        return $nodes;
    };

    /**
     * Строит DOM-структуру для селекта, использовать только для самых простых
     * случаев
     * @class bSelectBuilder
     * @submodule $
     * @namespace $
     * @return {Object} $
     * @example $('.b-select_init_builder').bSelectBuilder()
     *
     */
    $.fn[pluginName + 'Builder'] = function() {
        var uniqueId = Math.round( new Date().getTime() + Math.random() );

        this.each( function() {
            var $bSelectBuild,
                attrs   = {},
                options = [],
                attr,
                option,
                a,
                i;

            for ( a in this.attributes ) {
                attr = this.attributes[a];
                if ( typeof attr.nodeValue !== 'undefined' ) {
                    attrs[attr.nodeName] = attr.nodeValue;
                }
            }

            attrs.disabled = !!attrs.disabled;

            for ( i = 0; i < this.options.length; i++ ) {
                option = this.options[i];
                options.push( {
                    attr : {
                        value    : option.value,
                        disabled : option.disabled,
                        selected : option.selected,
                    },
                    title : option.innerHTML,
                    data  : $( option ).data(),
                } );
            }

            $bSelectBuild = $( JST['b-select']( {
                attr        : attrs,
                options     : options,
                select_size : attrs.size,
                autowidth   : attrs['data-autowidth'],
            } ) );

            $( this ).after( $bSelectBuild ).remove();

            $bSelectBuild.attr( 'data-' + pluginName + 'Builder', uniqueId );
        } );

        return $( '[data-' + pluginName + 'Builder="' + uniqueId + '"]' );
    };

    $( function() {
        $('.b-select:not(.b-select_init_builder)').bSelect();

        $('.b-select_init_builder')
            .removeClass('b-select b-select_init_builder')
            .bSelectBuilder()
            .bSelect();
    } );

} )( jQuery );
