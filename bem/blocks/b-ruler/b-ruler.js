( function( $ ) {
    'use strict';

    /**
     * jQuery плагин для построения рулетки для jquery-ui-slider'а.
     * Строить может тремя способами:
     * 1) По параметрам jquery-ui-slider'а (fromSlider);
     * 2) По массиву значений values;
     * 3) По параметрам min, max, step.
     * @class bRuler
     * @submodule $
     * @namespace $
     * @static
     */
    var pluginName = 'bRuler',

        /**
         * Настройки плагина по умолчанию.
         * @type {Object}
         */
        defaults = {

            /**
             * Флаг для отображения рулетки ПЕРЕД выбранным DOM-элементом.
             * @type {Boolean}
             */
            prepend : false,

            /**
             * Взять параметры для построения рулетки из параметров слайдера,
             * для которого рулетка выводится.
             * Учитывается min/max/step/orientation.
             * @type {Boolean}
             */
            fromSlider : false,

            /**
             * Ориентация рулетки (horizontal/vertical).
             * @type {String}
             */
            orientation : 'horizontal',

            /**
             * Начальное значение рулетки.
             * @type {Number}
             */
            min : 0,

            /**
             * Конечное значение рулетки.
             * @type {Number}
             */
            max : 10,

            /**
             * Шаг делений рулетки.
             * Eсли decimal - будет выбрана удобная степень 10.
             * @type {String|Number}
             */
            step : 'decimal',

            /**
             * Отсчитывать шаги линейки не от min, а со stepFrom.
             * @type {Number}
             */
            stepFrom : null,

            /**
             * Длина шагов не одинаковая - пропорциональна значниям.
             * Шаг 5-10 в 5 раз длинее шага 1-2.
             * Используется в whois/history, /ssl-certificate/choose
             * @type {Boolean}
             */
            proportionalStep : false,

            /**
             * Не показывать предпоследний штрих, если до последнего <= 40% шага
             * @type {Number}
             */
            lastStepMinLength : 0.4, // eslint-disable-line no-magic-numbers

            /**
             * Значения по которым строится рулетка.
             * @type {Array}
             */
            values : [],

            /**
             * Массив подписей.
             * Если отсутствует - ставятся текущие значения шагов.
             * @type {Array}
             */
            labels : [],

            /**
             * Callback-функция, вызываемая при клике на подписях.
             * Функция вызывается с 3 параметрами:
             * @param {Jquery} $ruler - Сама рулетка
             * @param {Number} index - Номер шага/деления
             * @param {String} label - Значение подписи
             * @type {Function}
             */
            callback : null,

            /**
             * Именование классов в верстке.
             * ruler - класс блока;
             * prepend - стили для отображения рулетки перед слайдером (цифры сверху/слева);
             * vertical - вертикальное расположение рулетки;
             * step - деление рулетки;
             * firstStep - первое деление рулетки;
             * lastStep - последнее деление рулетки;
             * highlight - подсвеченное деление рулетки;
             * limit - для выделения границ диапазон подсвеченных значений;
             * disabled - неактивное/отключенное деление рулетки;
             * label - значение деления/шага.
             * @type {Object}
             */
            classes : {
                ruler     : 'b-ruler',
                prepend   : 'b-ruler_mode_prepend',
                vertical  : 'b-ruler_mode_vertical',
                step      : 'b-ruler__step',
                firstStep : 'b-ruler__step_mode_first',
                lastStep  : 'b-ruler__step_mode_last',
                highlight : 'b-ruler__step_style_highlight',
                limit     : 'b-ruler__step_style_limit',
                disabled  : 'b-ruler__step_mode_disabled',
                label     : 'b-ruler__label',
            },
        };

    /**
     * Проверяет переданные плагину параметры.
     * @param  {Object} options Объект с переданными параметрами
     * @return {Boolean} Результат проверки
     */
    function areParamsValid( options ) {
        if ( options.fromSlider ) { // Данные слайдера считаем корректными
            return true;
        }
        else if ( Array.isArray( options.values ) ) {
            return options.values.length > 1;
        }
        else {
            return $.isNumeric( options.min ) && $.isNumeric( options.max ) && options.max > options.min;
        }
    }

    /**
     * Конструктор плагина.
     * @param {Object} element DOM-элемент для которого вызывается плагин
     * @param {Object} options Настройки плагина
     */
    function Ruler( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this.init();
    }

    $.extend( Ruler.prototype, {

        /**
         * Инициализация плагина. Устанавливаем необходимые параметры. Генерируем и рендерим блок.
         * @method init
         * @private
         */
        init : function() {
            this.$element = $( this.element );

            if ( !this.settings.values.length ) {
                this._setSettingValues();
            }

            this.$ruler = this._buildRuler();
            this.$steps = this.$ruler.find( '.' + this.settings.classes.step );

            this._renderRuler();

            if ( typeof this.settings.callback === 'function' ) {
                this._defineCallback();
            }
        },

        /**
         * Устанавливает значения для блока.
         * Либо берет из значений слайдера, либо вызывает функцию для построения диапазона из settings.
         * @method setSettingValues
         * @private
         */
        _setSettingValues : function() {
            if ( this.settings.fromSlider ) {
                try {
                    this._rewriteSettingsFromSlider();
                }
                catch ( e ) {
                    if ( window.console && console.warn ) {
                        console.warn( e.message );
                    }
                }
            }

            if ( !this.settings.values.length ) {
                this.settings.values = this._buildRangeFromOptions( this.settings );
            }
        },

        /**
         * Перезаписывает настройки блока, используя значения из слайдера, для которого вызывается.
         * Заменяется массив значений(values) и ориентация рулетки.
         * @method rewriteSettingsFromSlider
         * @private
         */
        _rewriteSettingsFromSlider : function() {
            var $element      = this.$element,
                sliderOptions = $element.slider('option');

            this.settings.values = this._buildRangeFromOptions( sliderOptions );
            this.settings.orientation = sliderOptions.orientation;

            if ( typeof this.settings.callback !== 'function' ) {
                if ( sliderOptions.range === 'min' || sliderOptions.range === 'max' ) {
                    this.settings.callback = this._defaultCallbackForFixRangeSlider.bind( this );
                }
                else {
                    this.settings.callback = this._defaultCallbackForSlider.bind( this );
                }
            }
        },

        /**
         * Строит массив значений по заданным параметрам.
         * @method buildRangeFromOptions
         * @param {Object} [option] Опции для генерации массива значений.
         * @param {Number} [option.min] Начальное значение массива.
         * @param {Number} [option.max] Конечное значение массива.
         * @param {Number} [option.step] Шаг для генерации значений.
         * @return {Array} массив сгенерированных значений.
         * @private
         */
        _buildRangeFromOptions : function( options ) {
            var max               = options.max,
                step              = options.step == 'decimal' ? this._chooseStepExp() : options.step,
                stepFrom          = this.settings.stepFrom === null ? options.min : this.settings.stepFrom,
                range             = [ options.min ],
                lastStepMinLength = this.settings.lastStepMinLength,
                i;

            for ( i = stepFrom + step; i <= max - step * lastStepMinLength; i += step ) {
                range.push( i );
            }

            range.push( options.max );

            return range;
        },

        /**
         * Выбираем в качестве шага подходящую степень 10.
         * @method chooseStepExp
         * @return {Integer} Шаг рулетки
         * @private
         */
        _chooseStepExp : function() {
            var exp = Math.ceil( Math.log10( this.settings.max ) );

            return Math.pow( 10, exp - 1 );
        },

        /**
         * Генерирует jquery-объект блока, навешивая необходимые классы.
         * @method buildRuler
         * @return {jQuery} Объект готовый для рендера.
         * @private
         */
        _buildRuler : function() {
            var $ruler = $( '<div/>', { class: this.settings.classes.ruler } );

            if ( this.settings.orientation === 'vertical' ) {
                $ruler.addClass( this.settings.classes.vertical );
            }

            if ( this.settings.prepend ) {
                $ruler.addClass( this.settings.classes.prepend );
            }

            return $ruler.html( this._buildRulerSteps() );
        },

        /**
         * Генерирует html-содержимое блока ( шаги/метки ).
         * @method buildRulerSteps
         * @return {String} html-содержимое блока рулетки
         * @private
         */
        _buildRulerSteps : function() {
            var self         = this,
                settings     = this.settings,
                direction    = settings.orientation === 'horizontal' ? 'left:' : 'bottom:',
                valuesLength = settings.values.length,
                rulerHtml    = '';

            settings.values.forEach( function( value, i ) {
                var stepClass = settings.classes.step,
                    stepLabel = typeof settings.labels[i] === 'undefined' ? value : settings.labels[i],
                    stepPos   = self._calculateStepPosition( value, i );

                if ( i === 0 ) {
                    stepClass = stepClass + ' ' + settings.classes.firstStep;
                }
                else if ( i === valuesLength - 1 ) {
                    stepClass = stepClass + ' ' + settings.classes.lastStep;
                }

                /* eslint-disable max-len */
                rulerHtml += '<div class="' + stepClass + '" data-ruler="' + i + '" style="' + direction + stepPos + '%"><span class="' + settings.classes.label + '">' + stepLabel + '</span></div>';

                /* eslint-enable max-len */
            } );

            return rulerHtml;
        },

        /**
         * Рассчитывает смещение шага рулетки относительно ее начала.
         * @param  {[type]} value Значение шага
         * @param  {[type]} index Номер шага
         * @return {[Number]} Смещение шага, относительно начала блока, в %.
         * Используются для позиционирования шага(left/bottom).
         */
        _calculateStepPosition : function( value, index ) {
            var settings = this.settings,
                stepPos;

            if ( settings.proportionalStep ) {
                stepPos = ( value - settings.min ) / ( settings.max - settings.min ) * 100;
            }
            else {
                stepPos = 100 / ( settings.values.length - 1 ) * index;
            }

            return stepPos;
        },

        /**
         * Устанавливает callback-функцию, вызываемую при клике на label.
         * @method defineCallback
         * @private
         */
        _defineCallback : function() {
            var callback = this.settings.callback,
                classes  = this.settings.classes,
                $ruler   = this.$ruler;

            this.$steps.click( function() {
                var $this = $( this ),
                    label = $this.find( '.' + classes.label ).text(),
                    index = +$this.data('ruler');

                if ( !$this.hasClass( classes.disabled ) ) {
                    callback( $ruler, index, label );
                }
            } );
        },

        /**
         * Рендерит рулетку до/после слайдера.
         * @method renderRuler
         * @private
         */
        _renderRuler : function() {
            if ( this.settings.prepend ) {
                this.$element.before( this.$ruler );
            }
            else {
                this.$element.after( this.$ruler );
            }
        },

        /**
         * Подсвечивает диапазон значений с from до to.
         * Если передан только один параметр, подсвечивает до него.
         *
         * @param {Number} from Начальное значение подсвеченного диапазона
         * @param {Number|Undefined} to Конечное значение подсвеченного диапазона
         * @method highlight
         */
        highlight : function( from, to ) {
            var classes       = this.settings.classes,
                hideLeftLimit = false,
                rangeStart    = from,
                rangeEnd     = to;

            if ( typeof to === 'undefined' ) {
                rangeEnd  = from;
                rangeStart = this.$steps.eq( 0 ).data('ruler');
                hideLeftLimit = true;
            }

            this.$steps.each( function( index ) {
                var $step = $( this );

                if ( index >= rangeStart && index <= rangeEnd ) {
                    if ( ( index == rangeStart && !hideLeftLimit ) || index == rangeEnd ) {
                        $step.addClass( classes.limit );
                    }
                    else {
                        $step.removeClass( classes.limit );
                    }

                    $step.addClass( classes.highlight );
                }
                else {
                    $step.removeClass( classes.limit + ' ' + classes.highlight );
                }
            } );
        },

        /**
         * Отключает диапазон значений с from до to.
         * Callback для отключенных значений не срабатывает.
         * @param {Number} from Начальное значение отключенного диапазона
         * @param {Number} to Конечное значение отключенного диапазона
         * @method disable
         */
        disable : function( from, to ) {
            var classes = this.settings.classes;

            this.$steps.each( function( index ) {
                var $step = $( this );

                if ( index >= from && index <= to ) {
                    $step.addClass( classes.disabled );
                }
                else {
                    $step.removeClass( classes.disabled );
                }
            } );
        },

        /**
         * Дефолтный колбек для рулетки, при использовения вместе со слайдером.
         * @param {Jquery} $ruler - Сама рулетка
         * @param {Number} index - Номер шага/деления
         * @type {Function}
         */
        _defaultCallbackForSlider : function( $ruler, index ) {
            var sliderLength  = this.settings.values.length,
                currentValues = this.$element.slider('values'),
                newValues;

            if ( currentValues[0] == currentValues[1] ) {
                newValues = index > currentValues[1] ? [ currentValues[0], index ] : [ index, currentValues[1] ];
            }
            else {
                if ( ( index >= sliderLength / 2 ) || ( index > currentValues[1] ) ) {
                    newValues = [ currentValues[0], index ];
                }
                else {
                    newValues = [ index, currentValues[1] ];
                }
            }

            this.$element.slider( 'values', newValues );
        },

        /**
         * Колбек для рулетки, при использовения вместе с range-fix слайдером (один ползунок)
         * @param {Jquery} $ruler - Сама рулетка
         * @param {Number} index - Номер шага/деления
         * @type {Function}
         */
        _defaultCallbackForFixRangeSlider : function( $ruler, index ) {
            this.$element.slider( 'value', index );
        },
    } );

    $.fn[pluginName] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, pluginName ) && areParamsValid( options ) ) {
                $.data( this, pluginName, new Ruler( this, options ) );
            }
        } );
    };
} )( jQuery );
