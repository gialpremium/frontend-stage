###*
 * Глобальная область видимости window
 * @module window
###

do (window) ->
  "use strict"

  ###*
   * Обертка для нативных localStorage/sessionStorage. В качестве значений используется формат JSON.
   * Имеется свой 'сборщик мусора', который работает при ttl > 0.
   * @class Storage
   * @constructor
   * @param {Object} [options] Настройки плагина, см {{#crossLink "Storage/defaults:property"}}{{/crossLink}}
  ###
  class window.Storage
    ###*
     * Дефолтные настройки хранилища
     * @property {Object} [defaults]
     * @property {String} [defaults.storageType='local'] Тип хранилища. Доступны значения 'local' и 'session'
     * @property {Number} [defaults.ttl=-1] Время жизни записи в хранилище
     * @property {String} [defaults.prefix='_cache_'] Префикс ключа, добавляется в начало ключа, перед сохранением в хранилище
    ###
    defaults:
      storageType: 'local'
      ttl: -1
      prefix: '_cache_'


    ###*
     * Ссылка на текущий тип хранилища
     * @property _oStorage
     * @type {Object}
     * @private
    ###
    _oStorage: false


    ###*
     * Метод конвертации JSON в строку
     * @method _jsonEncode
     * @param {JSON} value JSON для конвертации
     * @type {Function}
     * @private
    ###
    _jsonEncode: Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify))


    ###*
     * Метод конвертации строки в JSON
     * @method _jsonDecode
     * @param {String} value строка для конвертации
     * @type {Function}
     * @private
    ###
    _jsonDecode: (window.JSON && (JSON.decode || JSON.parse)) || (str) -> String(str).evalJSON()

    ###*
     * Конструктор стораджа
     * @method constructor
     * @param options
     * @type {Function}
     * @public
    ###
    constructor: (options) ->
      _opt = Object.assign {}, @defaults, options
      @_avail = @_checkAvailability _opt.storageType

      if @_avail
        @_prefix = _opt.prefix
        @_ttl = Math.ceil _opt.ttl
        @_setStorageObject _opt.storageType


    ###*
     * Хранилище доступно, доступны методы JSON для работы с данными, ttl имеет валидное значение
     * @property _avail
     * @type {Boolean}
     * @private
    ###
    _avail: false


    ###*
     * Префикс для ключей записей
     * @property _prefix
     * @type {String}
     * @private
    ###
    _prefix: ''


    ###*
     * Время жизни записи в хранилище
     * @property _ttl
     * @type {Number}
     * @private
    ###
    _ttl: null


    ###*
     * Проверка доступности хранилища, а так же методов для работы с данными
     * @method _checkAvailability
     * @param  {String} type тип хранилища
     * @return {Boolean} Хранилище доступно для работы или нет
     * @private
    ###
    _checkAvailability: (type) =>
      storageName = "#{type}Storage"

      try
        @_ttl isnt 0 and
        typeof window[storageName] isnt 'undefined' and
        window[storageName] isnt null and
        typeof @_jsonEncode isnt 'undefined' and
        typeof @_jsonDecode isnt 'undefined'
      catch e
        false


    ###*
     * Инициализация хранилища данных.
     * Если не удалось инициализировать,
     * в начале пробуем отчистить хранилище,
     * потом помечаем его недоступным
     * @method _setStorageObject
     * @param  {String} type тип хранилища
     * @private
    ###
    _setStorageObject: (type) =>
      try
        uid = new Date;
        uid = uid.toString()
        @_oStorage = window["#{type}Storage"]
        @_oStorage.setItem(uid, uid)
        if @_oStorage.getItem(uid) != uid
          @_avail = false
      catch e
        @gc()
        @_avail = false


    ###*
     * Получение данных из хранилища
     * @method get
     * @param  {String} key ключ записи
     * @public
     * @return {JSON} данные из хранилища
    ###
    get: (key) =>
      return null  unless @_avail

      key   = @_prefix + key
      storageValue = @_oStorage.getItem key
      value = if storageValue then @_jsonDecode storageValue

      if value
        if @_ttl is -1
          return value
        else if new Date().getTime() <= value.__expires
          delete value.__expires
          return value
        else
          @_oStorage.removeItem key

      return null

    ###*
     * Запись данных в хранилище
     * @method set
     * @param {String} key ключ записи
     * @param {Object} value данные
     * @public
    ###
    set: ( key, value ) =>
      return null  unless @_avail

      if typeof value isnt 'object'
        throw new Error('Object expected')

      else
        key = @_prefix + key

        try
          value.__expires = new Date().getTime() + @_ttl * 1000  if @_ttl > 0
          @_oStorage.setItem key, @_jsonEncode value
        catch e
          @gc()

    ###*
     * Удаление записи по ключу
     * @method remove
     * @param {String} key ключ записи
     * @public
    ###
    remove: ( key ) =>
      return null  unless @_avail

      key = @_prefix + key

      @_oStorage.removeItem key


    ###*
     * Сборшик мусора. Чистит хранилище от записей, по совпадению {{#crossLink "Storage/_prefix:property"}}{{/crossLink}}
     * @method gc
     * @public
    ###
    gc: () =>
      return null  unless @_avail

      re = new RegExp @_prefix

      for key of @_oStorage
        continue unless re.test key

        value = @_jsonDecode @_oStorage.getItem key
        if value? and new Date().getTime() > value.__expires
          @_oStorage.removeItem key
