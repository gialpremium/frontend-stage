/*
global
    Anno,
    bPopupInit
*/

Site.namespace('Site.App.Tips.Core');

( function() {

    var _tipsSingleton = null;

    /**
     * Класс описывает создание и показ визардов-аннотаций
     * @class Tips
     * @constructor
     */
    function Tips() {

    }

    /**
     * Возвращает синглтон класса Tips.
     * @static
     * @method getInstance
     * @for Tips
     * @return {Object} Синглтон класса Tips
     */
    Tips.getInstance = function() {
        if ( !_tipsSingleton ) {
            _tipsSingleton = new Tips();
        }

        return _tipsSingleton;
    };

    /**
     * Метод инициализации.
     * @param  {Array} tipWizards массив айди визардов
     * @method init
     * @for Tips
     */
    Tips.prototype.init = function( tipWizards ) {
        this.tipWizards = tipWizards;
        this.tipWizardInstances = {};
        this.isLauncherNeeded = !REGRU.is_production && !window.location.hash.match( /^#intro=\d+/ );
        this.slideShownTiming = 0;
        this.getTipsData();
        this.initHandlers();
    };

    /**
     * Получает данные о визардах с сервера
     * @private
     * @method  getTipsData
     * @for     Tips
     * @uses    customizeTipsData
     */
    Tips.prototype.getTipsData = function() {
        $.ajax( {
            url      : '/tipwizard/',
            method   : 'POST',
            dataType : 'json',
            data     : { ids: this.tipWizards.join(',') },
            context  : this,
        } )
            .done( function( data ) {
                this.customizeTipsData( data );
            } );
    };

    /**
     * Создает объекты визардов и рисует лончер в тестовой среде
     * @private
     * @method  createTips
     * @for     Tips
     * @uses    renderTipWizardsLauncher
     * @param   {Object} tipWizardsData объект, содержащий модифицированные данные
     * обо всех визардах, актуальных для данного показа страницы
     */
    Tips.prototype.createTips = function( tipWizardsData ) {
        var self = this,
            tipWizardsInstancesNamesArray = [],
            tipWizardsIds = Object.keys( tipWizardsData );

        if ( tipWizardsIds.length ) {
            tipWizardsIds.forEach( function( tipWizardsId, i ) {
                self.tipWizardInstances[ 'tipWizard' + tipWizardsId ] = new Anno( tipWizardsData[tipWizardsId].items );
                tipWizardsInstancesNamesArray.push( 'tipWizard' + tipWizardsId );

                if ( i === 0 && REGRU.is_production ) {
                    self.showTip( self.tipWizardInstances[ 'tipWizard' + tipWizardsId ] );
                }

            } );

            if ( self.isLauncherNeeded ) {
                self.renderTipWizardsLauncher( tipWizardsInstancesNamesArray );
            }

        }
    };

    /**
     * Рисует центр управления визардами с кнопками запуска
     * @private
     * @method  renderTipWizardsLauncher
     * @for     Tips
     * @param   {Array} tipWizardsInstancesNamesArray массив айди визардов
     */
    Tips.prototype.renderTipWizardsLauncher = function( tipWizardsInstancesNamesArray ) {
        var launcher = require('b-tips-launcher/b-tips-launcher.jade');

        $('body').append( launcher( { tipWizardsInstancesNames: tipWizardsInstancesNamesArray } ) );
    };

    /**
     * Инициализация обработчиков
     * @private
     * @method initHandlers
     * @for Tips
     */
    Tips.prototype.initHandlers = function() {
        var self = this;

        $('body')
            .on( 'click', '.b-tips-greeting-popup', function( e ) {
                var $popup           = $( this ),
                    $popupButton     = $( '.b-tips-greeting-popup__button', $popup ),
                    annoInstanceName = $popupButton.data('anno-instance'),
                    annoId           = annoInstanceName.replace( 'tipWizard', '' );

                if ( e.target.className.match('b-popup__close') || e.target.className.match('b-popup__fade') ) {
                    self.sendStats( 1, 0, 'close' );
                    $popup.remove();
                    self.tipWizardInstances[ annoInstanceName ].hide();
                    self.closeTipWizard( annoId );
                }

            } )
            .on( 'click', '.b-tips-greeting-popup__button', function() {
                var $this            = $( this ),
                    annoInstanceName = $this.data('anno-instance'),
                    nextChainIndex   = parseInt( $this.data('nextchain') ),
                    $popup           = $this.closest('.b-popup');

                $popup.remove();
                self.sendStats( 1, 0, 'next' );
                self.tipWizardInstances[ annoInstanceName ].chainIndex( nextChainIndex ).show();

                return false;
            } )
            .on( 'click', '.b-tips__close', function() {
                var $this             = $( this ),
                    currentChainIndex = $this.data('anno-chainindex'),
                    stepCounter       = $this.data('anno-stepcounter'),
                    annoInstanceName  = $this.data('anno-instance'),
                    annoId            = annoInstanceName.replace( 'tipWizard', '' );

                self.tipWizardInstances[ annoInstanceName ].chainIndex( currentChainIndex ).hide();
                self.sendStats( parseInt( annoId ), parseInt( stepCounter ), 'close' );
                self.closeTipWizard( annoId );

                return false;
            } )
            .on( 'click', '.b-tips-launcher__button', function() {
                var $this            = $( this ),
                    annoInstanceName = $this.data('instance-name');

                self.showTip( self.tipWizardInstances[ annoInstanceName ] );

                return false;
            } )
            .on( 'click', '.anno-overlay', function() {
                var $this  = $( this ),
                    annoId = $this.data('current-tip-wizard'),
                    step = $this.data('current-step');

                self.sendStats( parseInt( annoId ), parseInt( step ), 'close' );
                self.closeTipWizard( annoId );
            } )
            .on( 'keyup', function( e ) {
                var $greetingPopup = $('.b-tips-greeting-popup.i-hooc__popup_visible_true'),
                    keyCode = e.which,
                    ESCAPE_CODE = 27,
                    annoInstanceName,
                    annoId;

                if ( $greetingPopup.length && keyCode === ESCAPE_CODE ) {
                    annoInstanceName = $greetingPopup.attr('id').replace( /_\S+/, '' );
                    annoId = annoInstanceName.replace( 'tipWizard', '' );
                    self.tipWizardInstances[ annoInstanceName ].hide();
                    self.closeTipWizard( annoId );
                }

            } );
    };

    /**
     * Завершает визард, добавляя его айди в список просмотренных в localStorage
     * и разблокируя кнопки запуска в тестовой среде
     * @private
     * @method  closeTipWizard
     * @for     Tips
     * @uses    enableLauncherButtons
     * @uses    addViewedTipToStorage
     * @param   {String} annoId айди визарда
     */
    Tips.prototype.closeTipWizard = function( annoId ) {

        if ( this.isLauncherNeeded ) {
            this.enableLauncherButtons();
        }

        clearInterval( this.slideShownTimer );
        this.addViewedTipToStorage( parseInt( annoId ) );
    };

    /**
     * Разблокирует кнопки запуска визардов
     * @private
     * @method  enableLauncherButtons
     * @for     Tips
     */
    Tips.prototype.enableLauncherButtons = function() {
        $('.b-tips-launcher__button').removeAttr('disabled');
    };

    /**
     * Дополняет объекты шагов всех визардов до соответствия дизайну и заданным требованиям
     * @private
     * @method  customizeTipsData
     * @for     Tips
     * @uses    closeTipWizard
     * @uses    onShowTip
     * @uses    createTips
     * @param   {Object} tipWizardsData объект, содержащий данные обо всех визардах
     */
    Tips.prototype.customizeTipsData = function( tipWizardsData ) {
        var self = this,
            tipClassName,
            tipButtons,
            isWizardWithPopup,
            wizardsToRemove = [],
            isFakeTargetNeeded,
            wizardItems,
            backClassName = 'b-tips__button b-tips__button_direction_back',
            forwardClassName = 'b-tips__button b-tips__button_direction_forward';

        Object.keys( tipWizardsData ).forEach( function( tipWizardsId ) {
            isWizardWithPopup = false;
            wizardItems = [];

            if ( tipWizardsData[ tipWizardsId ].items && tipWizardsData[ tipWizardsId ].items.length ) {
                isFakeTargetNeeded = false;

                tipWizardsData[ tipWizardsId ].items.forEach( function( tip ) {
                    tipClassName = 'b-tips';

                    if ( !tip.target ) {
                        tip.target = '.b-tips__fake-target';
                        tipClassName += ' b-tips_visibility_none';
                        tip.showOverlay = function() {};
                        isWizardWithPopup = true;
                        isFakeTargetNeeded = true;
                    }
                    else {
                        tipClassName += ' l-width_grid-5';

                        if ( !$( tip.target ).length && wizardsToRemove.indexOf( tipWizardsId ) === -1 ) {
                            if ( !REGRU.is_production ) {
                                console.warn( 'no b-tips target found: ' + tip.target );
                            }

                            // skip optional
                            if ( tip.optional ) {
                                if ( !REGRU.is_production ) {
                                    console.warn('target is optional, skipping');
                                }

                                return;
                            }

                            // or remove whole wizard
                            wizardsToRemove.push( tipWizardsId );

                            return;
                        }

                    }

                    Object.assign( tip, {
                        tipWizardsId : tipWizardsId,
                        instanceName : 'tipWizard' + tipWizardsId,
                        className    : tipClassName,
                        onShow       : self.onShowTip.bind( self ),
                    } );

                    wizardItems.push( tip );
                } );

                if ( isFakeTargetNeeded ) {
                    $('body').append('<div class="b-tips__fake-target"></div>');
                }

                // navigation
                wizardItems.forEach( function( tip, i ) {
                    tipButtons = [
                        {
                            text      : t('tip_wizards.buttons.back'),
                            className : backClassName,
                            click     : function( anno ) {
                                self.sendStats( anno.tipWizardsId, anno.indexForCounter, 'prev' );
                                anno.switchToChainPrev();

                                return false;
                            },
                        },
                        {
                            text      : t('tip_wizards.buttons.forward'),
                            className : forwardClassName,
                            click     : function( anno ) {
                                self.sendStats( anno.tipWizardsId, anno.indexForCounter, 'next' );
                                anno.switchToChainNext();

                                return false;
                            },
                        },
                    ];

                    if ( i === 0 ) {
                        Object.assign( tipButtons[ 0 ], {
                            className : backClassName + ' b-tips__button_state_disabled',
                            click     : function() {
                                return false;
                            },
                        } );
                    }

                    if ( i === wizardItems.length - 1 ) {
                        Object.assign( tipButtons[ 1 ], {
                            text      : t('tip_wizards.buttons.done'),
                            className : 'b-tips__button',
                            click     : function( anno ) {
                                self.sendStats( anno.tipWizardsId, anno.indexForCounter, 'close' );
                                anno.hide();
                                self.closeTipWizard( anno.tipWizardsId );

                                return false;
                            },
                        } );
                    }

                    Object.assign( tip, {
                        buttons         : tipButtons,
                        stepIndex       : i,
                        indexForCounter : isWizardWithPopup ? i : i + 1,
                        tipWizardLength : isWizardWithPopup ? wizardItems.length - 1 : wizardItems.length,
                    } );
                } );

                tipWizardsData[ tipWizardsId ].items = wizardItems;
            }
            else {
                delete tipWizardsData[ tipWizardsId ];
            }

        } );

        if ( wizardsToRemove.length ) {
            wizardsToRemove.forEach( function( tipWizardsId ) {
                delete tipWizardsData[ tipWizardsId ];
            } );
        }

        self.createTips( tipWizardsData );
    };

    /**
     * При показе каждого нового шага визарда делает с ним некоторые вещи:
     * вставляет крестик; приветственный шаг скрывает и показывает вместо него попап;
     * шагу с полем new вставляет заголовок "Новое на сайте"; на оверлей вешает параметр,
     * чтобы тот "поумнел" и смог адекватно реагировать на клик по себе, завершая визард;
     * в условиях тестовой среды блокирует кнопки запуска всех визардов.
     * @method  onShowTip
     * @for     Tips
     * @param   {Object} anno объект с данными о данном шаге визарда
     * @param   {Object} $target объект элемента, к которому "цепляется" данный шаг
     * @param   {Object} $annoElem объект элемента самого шага визарда
     */
    Tips.prototype.onShowTip = function( anno, $target, $annoElem ) {
        var self = this,
            popupId = anno.instanceName + '_step' + anno.stepIndex + '_popup',
            $annoOverlay = $('.anno-overlay'),
            POPUP_TIMEOUT = 300;

        $annoOverlay
            .data( 'current-tip-wizard', anno.tipWizardsId )
            .data( 'current-step', anno.indexForCounter );

        if ( self.isLauncherNeeded ) {
            $('.b-tips-launcher__button').attr( 'disabled', 'disabled' );
        }

        if ( anno.new ) {
            $annoElem
                .find('.anno-content')
                .prepend( '<strong class="b-tips__title">' + t('tip_wizards.new_on_the_site') + '</strong>' );
        }

        if ( anno.target === '.b-tips__fake-target' ) {
            $('body').append(
                require('b-tips/b-tips-greeting-popup.jade')( {
                    popupId          : popupId,
                    annoInstanceName : anno.instanceName,
                    nextChainIndex   : anno.stepIndex + 1,
                    content          : anno.content,
                } )
            );
            bPopupInit( $('.b-tips-greeting-popup') );
            $('.anno-overlay').remove();
            setTimeout( function() {
                $( '#' + popupId ).hooc('show');
            }, POPUP_TIMEOUT );
        }

        $annoElem
            .find('.anno-inner')
            .append( '<a class="b-tips__close" data-anno-chainindex="'
                    + anno.stepIndex
                    + '" data-anno-instance="'
                    + anno.instanceName
                    + '" data-anno-stepcounter="'
                    + anno.indexForCounter
                    + '" href="#"><span class="b-icon b-icon_style_cross-invert"></span></a>' )
            .end()
            .find('.anno-btn-container .b-tips__button_direction_back')
            .after( '<span class="b-tips__counter">'
                    + anno.indexForCounter + '/' + anno.tipWizardLength + '</span>' );

        self.sendStats( anno.tipWizardsId, anno.indexForCounter, 'open' );
        clearInterval( self.slideShownTimer );
        self.slideShownTiming = 0;
        self.slideShownTimer = setInterval( function() {
            self.slideShownTiming++;
        }, 1000 );
    };

    /**
     * Добавляет айди визарда в список просмотренных визардов в localStorage
     * @private
     * @method  addViewedTipToStorage
     * @for     Tips
     * @param   {Number} tipWizardsId айди визарда
     */
    Tips.prototype.addViewedTipToStorage = function( tipWizardsId ) {
        var storage = new window.Storage( { prefix: '' } ),
            tipWizardsLocalStorage = storage.get('tipWizards') || {
                userFlags : {},
                viewed    : [],
            };

        if ( tipWizardsLocalStorage.viewed.indexOf( tipWizardsId ) === -1 ) {
            tipWizardsLocalStorage.viewed.push( tipWizardsId );
            storage.set( 'tipWizards', tipWizardsLocalStorage );
        }
    };

    /**
     * Показывает визард
     * @private
     * @method  showTip
     * @for     Tips
     * @param   {Object} tipWizardInstance экземпляр класса Anno
     */
    Tips.prototype.showTip = function( tipWizardInstance ) {
        tipWizardInstance.show();
    };

    /**
     * Отправляет статистику в GA
     * @private
     * @method  generateStatsEvent
     * @for     Tips
     * @param   {Number} wizardId айди визарда
     * @param   {Number} step номер шага
     * @param   {String} action название действия
     * @uses    slideShownTiming
     */
    Tips.prototype.generateStatsEvent = function( wizardId, step, action ) {
        return function() {
            ga( 'send',
                'event',
                'tips_' + wizardId + '_' + step, action,
                REGRU.user_id, action === 'open' ? null : this.slideShownTiming
            );
        };
    };

    /**
     * В зависимости от готовности ГА вызывает отправку статистики или кладёт ее вызов в массив колбеков ГА
     * @private
     * @method  sendStats
     * @for     Tips
     * @param   {Number} wizardId айди визарда
     * @param   {Number} step номер шага
     * @param   {String} action название действия
     */
    Tips.prototype.sendStats = function( wizardId, step, action ) {

        if ( Site.Analytics.IsEnabled.google ) {
            this.generateStatsEvent( wizardId, step, action )();
        }
        else {
            Site.Analytics.Callbacks.google.push( this.generateStatsEvent( wizardId, step, action ) );
        }

    };

    Site.App.Tips.Core = { getInstance: Tips.getInstance };

} )();
