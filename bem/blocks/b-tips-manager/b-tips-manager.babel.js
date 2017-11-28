Site.namespace('Site.App.Tips.Manager');

$( function() {

    var _tipsManagerSingleton = null;
    var _tipsInstance = null;
    var _properTipWizards = null;

    /**
     * Класс -- контроллер загрузки скрипта визардов-аннотаций.
     * Находит в localStorage данные о нужных клиенту визардах, сравнивает их со всеми доступными
     * для данной страницы и отдает полученный в итоге сравнения список тяжелому скрипту, который
     * подгружается только если список непустой.
     * @class TipsManager
     * @constructor
     */
    function TipsManager() {
        this.init();
    }

    /**
     * Возвращает синглтон TipsManager.
     * @static
     * @method getInstance
     * @for TipsManager
     * @return {Object} Синглтон класса TipsManager
     */
    TipsManager.getInstance = function() {
        if ( !_tipsManagerSingleton ) {
            _tipsManagerSingleton = new TipsManager();
        }

        return _tipsManagerSingleton;
    };

    /**
     * Метод инициализации конструктора. Создаёт загрузчик для визардов.
     * Активирует обработчики событий и вызывает создание prefetch-link.
     * @method  init
     * @for     TipsManager
     * @uses Site.App.Auth.Modules.Loader Загрузчик произвольных скриптов
     */
    TipsManager.prototype.init = function() {
        var storage              = new window.Storage( { prefix: '' } ),
            AGAVA_FLAG_OBJECT    = { 'ag': 'agava' },
            MNERU_FLAG_OBJECT    = { 'mneru': 'mneru' },
            NEW_USER_FLAG_OBJECT = { 'new_user': 'new_user' };

        // this.loader = new Site.App.Auth.Modules.Loader();

        if ( $.cookie('_notips') ) {
            return;
        }

        if ( $.cookie('_mneru') ) {
            this.saveFlagInLocalStorage( MNERU_FLAG_OBJECT );
            this.saveFlagInLocalStorage( NEW_USER_FLAG_OBJECT );
        }
        else if ( $.cookie('_agava') ) {
            this.saveFlagInLocalStorage( AGAVA_FLAG_OBJECT );
            this.saveFlagInLocalStorage( NEW_USER_FLAG_OBJECT );
        }

        this.tipWizardsObject = storage.get('tipWizards') || {
            userFlags : {},
            viewed    : [],
        };

        this.checkProperTipWizards();
    };

    /**
     * Пишет в localStorage метку
     * @method  saveFlagInLocalStorage
     * @param   {Object} flag объект-метка
     * @for     TipsManager
     */
    TipsManager.prototype.saveFlagInLocalStorage = function( flag ) {
        var storage    = new window.Storage( { prefix: '' } ),
            flagKey    = Object.keys( flag )[0],
            tipWizards = storage.get('tipWizards') || {
                userFlags : flag,
                viewed    : [],
            };

        tipWizards.userFlags = tipWizards.userFlags || {};
        tipWizards.userFlags[ flagKey ] = flag[ flagKey ];

        storage.set( 'tipWizards', tipWizards );
    };

    /**
     * Загрузка и инициализация скрипта визардов.
     * @private
     * @method  loadTipsAsync
     * @for     TipsManager
     * @return  {Promise} Статус готовности визардов
     */
    TipsManager.prototype.loadTipsAsync = function() {

        return import('b-tips/b-tips.deps.js');
    };

    /**
     * Инициализирует экземпляр класса визардов.
     * @private
     * @method  initTips
     * @for     TipsManager
     * @uses    Site.App.Tips.Core тяжелый скрипт визардов
     */
    TipsManager.prototype.initTips = function() {
        _tipsInstance = Site.App.Tips.Core.getInstance();

        return true;
    };

    /**
     * Проверяет наличие загруженного скрипта визардов.
     * @private
     * @method  areTipsLoaded
     * @for     TipsManager
     * @return  {Boolean} true - загружен, false - не загружен
     */
    TipsManager.prototype.areTipsLoaded = function() {
        return !!_tipsInstance;
    };

    /**
     * Проверяет, нашлись ли подходящие визарды и, если нашлись, запускает загрузку тяжелого скрипта.
     * @private
     * @method  checkProperTipWizards
     * @for     TipsManager
     * @uses    getProperTipWizards
     * @uses    loadTipsAsync
     */
    TipsManager.prototype.checkProperTipWizards = function() {

        var self = this,
            wizards = this.getProperTipWizards();

        if ( !wizards.length ) {

            return;
        }

        if ( this.areTipsLoaded() ) {
            _tipsInstance.init( wizards );

            return;
        }

        this.loadTipsAsync()
            .then( function() {
                if ( self.initTips() ) {
                    _tipsInstance.init( wizards );
                }
            } );
    };

    /**
     * Определяет, какие визарды показать клиенту в этот раз. В условиях тестовой среды определит все
     * визарды, акутальные для данной страницы, независимо от просмотренности и соответствия типа визарда
     * меткам в хранилище. Также учитывает наличия хеша #intro=id в урле, при котором определит только
     * один визард с айди, содержащимся в хеше урла.
     * @private
     * @method  getProperTipWizards
     * @for     TipsManager
     * @uses    filterFlaggedTipWizards
     * @uses    filterUnviewedTipWizards
     * @return  {Array} массив, состоящий из айди подходящих в этом случае визардов
     */
    TipsManager.prototype.getProperTipWizards = function() {
        var availableTipWizards = Site.TipWizards,
            flaggedTipWizards,
            properTipWizards,
            currentUrlHash = window.location.hash.replace( /^#/, '' );

        if ( _properTipWizards === null ) {
            _properTipWizards = [];
        }
        else {
            return _properTipWizards;
        }

        if ( currentUrlHash.match( /^intro=\d+/ ) ) {
            _properTipWizards.push( currentUrlHash.replace( /^intro=(\d+)\D*/, '$1' ) );
        }
        else if ( !REGRU.is_production && availableTipWizards.length ) {
            availableTipWizards.forEach( function( item ) {
                _properTipWizards.push( item.id );
            } );
        }
        else if ( availableTipWizards.length ) {
            flaggedTipWizards = availableTipWizards.filter( this.filterFlaggedTipWizards, this );
            properTipWizards = flaggedTipWizards.filter( this.filterUnviewedTipWizards, this );

            properTipWizards.forEach( function( item ) {
                _properTipWizards.push( item.id );
            } );
        }

        return _properTipWizards;
    };

    /**
     * Отделяет айди подходящих по типу визардов от айди неподходящих,
     * основываясь на метках типов из localStorage.
     * @private
     * @method  filterFlaggedTipWizards
     * @for     TipsManager
     * @uses    getTipWizardsTypes
     * @param   {Object} tipWizard объект, содержащий айди и тип визарда, получаемый из Site.TipWizards
     * @return  {Boolean} true -- визард нужно показать клиенту (метка есть в хранилище), false -- не нужно
     */
    TipsManager.prototype.filterFlaggedTipWizards = function( tipWizard ) {
        var flags = this.getTipWizardsTypes();

        return tipWizard.type && flags.indexOf( tipWizard.type ) !== -1;
    };

    /**
     * Отделяет айди просмотренных визардов от айди непросмотренных.
     * @private
     * @method  filterUnviewedTipWizards
     * @for     TipsManager
     * @param   {Object} tipWizard объект, содержащий айди и тип визарда, получаемый из Site.TipWizards
     * @return  {Boolean} true -- визард еще не был просмотрен клиентом, false -- уже был
     */
    TipsManager.prototype.filterUnviewedTipWizards = function( tipWizard ) {
        return tipWizard.id && this.tipWizardsObject.viewed.indexOf( tipWizard.id ) === -1;
    };

    /**
     * Получает из localStorage пользовательские метки, указывающие на то,
     * какие типы визардов нужно показывать клиенту. Например, для клиентов агавы
     * нужно показывать визарды с type === 'agava'. Об этом и будет свидетельствовать
     * наличие метки "ag":"agava" в localStorage[ 'tipWizards.userFlags' ]
     * @private
     * @method  getTipWizardsTypes
     * @for     TipsManager
     * @return  {Array} массив полученных из хранилища меток
     */
    TipsManager.prototype.getTipWizardsTypes = function() {
        var self = this,
            tipWizardsTypes = [];

        Object.keys( self.tipWizardsObject.userFlags ).forEach( function( tipWizardMark ) {
            tipWizardsTypes.push( self.tipWizardsObject.userFlags[ tipWizardMark ] );
        } );

        return tipWizardsTypes;
    };

    Site.App.Tips.Manager = { getInstance: TipsManager.getInstance };
    Site.App.Tips.Manager.getInstance();

} );
