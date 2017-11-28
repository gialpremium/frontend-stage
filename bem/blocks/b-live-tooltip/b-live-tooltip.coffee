###*
 * Расширения библиотеки jQuery
 * @submodule $
###


###*
 * Плагин для вывода кастомизированых тултипов. Через аттрибуты `data-tooltip-width`
 * и `data-tooltip-extraclass` можно добавлять персонализированые классы и размер контейнера,
 * под конкретный тултип. Содержимое для тултипа берется из title либо data-title элемента-триггера.
 * При наведении на {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}cancelSelector{{/crossLink}} - не показывает ничего,
 * но снова показывает, если внутри cancelSelector есть другой {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}selector{{/crossLink}}
 * и навести на него (измеряется близость родителя)
 * Есть возможность динамической(ajax) подгружать содержимое тултипа.
 *
 * @example
 *   **Минимальный пример:**
 *
 *       <span clas="tooltip" title="Тултип">Текст</span>
 *
 *   **Пример для настроек по умолчанию:**
 *
 *      <span class="tooltip"
 *        data-tooltip-width="100"
 *        data-tooltip-extraclass="some_class"
 *        title="Специальное предложение" >Акция!</span>
 *
 *   **Динамическая подгрузка содержимого:**
 *
 *       <abbr class="history" rel="/url/to/tooltip/content">Акция!</span>
 *
 *        $.liveTooltip({
 *           selector: 'abbr.history',
 *           ajax: {
 *               dataAttr: 'rel'
 *           }
 *        })
 *
 *
 * @class LiveTooltip
 * @namespace Site.App.Views
 * @submodule Site.App.Views
 * @constructor
 * @param {Object} [options] Настройки плагина, см {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}{{/crossLink}}
###

window.Site?.App?.Views? or window.Site.namespace 'Site.App.Views'

class window.Site.App.Views.LiveTooltip
  ###*
   * Дефолтные настройки тултипа
   * @property {Object} [defaults]
   * @property {jQuery} [defaults.$viewPort=$(window)] Видимая область работы тултипа
   * @property {String} [defaults.selector='.tooltip'] Селектор для элементов с тултипом
   * @property {String} [defaults.cancelSelector='.no-tooltip'] Селектор для элементов, при наведении на которые тултип будет скрыт
   * @property {String} [defaults.eventNamespace='liveTooltip'] Неймспейс для обработчиков событий
   * @property {Number} [defaults.offset=15] Смещение тултипа относительно указателя курсора
   * @property {Number} [defaults.showDelay=300] Задержка перед показом тултипа, мс
   * @property {Number} [defaults.hideDelay=200] Задержка перед скрытием тултипа, мс
   * @property {Function} [defaults.onShow] Функция, вызываемая при показе тултипа.
   * Принимает два параметра: event - cобытие триггера тултипа и $tooltip - jQuery тултип
   * @property {Function} [defaults.onHide] Функция, вызываемая перед скрытием тултипа.
   * Принимает два параметра: event - cобытие триггера тултипа и $tooltip - jQuery тултип
   * @property {Object} [defaults.ajax] Настройки для динамической подгрузки контента
   * @property {String} [defaults.ajax.dataAttr] Имя атрибута, в котором находится урл для POST запроса
   * @property {String} [defaults.ajax.loader='Please wait!'] Текст/HTML, которые будут показыватся, пока отрабатывается запрос
   * @property {String} [defaults.ajax.error='Sorry, the contents could not be loaded'] Текст/HTML ошибки, которая выводится при неудачном запросе
  ###
  defaults:
    $viewPort: $(window)
    selector: '.tooltip'
    cancelSelector: '.no-tooltip'
    eventNamespace: 'liveTooltip'
    offset: 15
    showDelay: 300
    hideDelay: 200
    onShow: null
    onHide: null
    ajax:
      dataAttr: ''
      loader: 'Please wait!'
      error: 'Sorry, the contents could not be loaded'

  ###*
   * Контейнер тултипа
   * @property {jQuery} _tooltip
   * @private
  ###
  _tooltip = null

  ###*
   * ID таймера закрытия тултипа
   * @property {Number} _hideTimeout
   * @private
  ###
  _hideTimeout = null

  ###*
   * ID таймера открытия тултипа
   * @property {Number} _showTimeout
   * @private
  ###
  _showTimeout = null

  ###*
   * Тултип виден, либо в процессе отображения(анимация показа)
   * @property {Boolean} _isVisible
   * @private
  ###
  _isVisible = false

  ###*
   * Тултип полностью скрыт(все анимации отработаны)
   * @property {Boolean} _isHidden
   * @private
  ###
  _isHidden = true

  ###*
   * Текущие событие триггера тултипа
   * @property {event} _currentEvent
   * @private
  ###
  _currentEvent = null

  ###*
   * Текушие координаты курсора
   * @property {Object} _lastPosition
   * @property {Number} _lastPosition.x
   * @property {Number} _lastPosition.y
   * @private
  ###
  _lastPosition = null

  ###*
   * Текуший аякс запрос
   * @property {Object} _ajaxRequest
   * @private
  ###
  _ajaxRequest = null


  constructor: (options) ->
    ###*
     * Текущие настройки плагина({{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}{{/crossLink}} + кастомные настройки)
     * @property {Object} _opt
     * @private
    ###
    @_opt = $.extend true, {}, @defaults, options

    _tooltip = _getTooltipContainer()
    _tooltip.addClass('b-live-tooltip_visible_false').hide()

    $(@_opt.selector).each ->
      _setTitle(this)
      return

    @_testSupportTouch()
    @_bindMouseHandlers()


  ###*
   * Закрыть тултип
   *
   * @method hide
   * @chainable
   * @public
  ###
  hide: ->
    # console.log "@hide _hideTimeout=#{_hideTimeout} _showTimeout=#{_showTimeout}"
    _dropTimeout()

    if _isVisible
      _hideTimeout = setTimeout((=>
        @_hideTooltip()
      ), @_opt.hideDelay)
    else
      @_hideTooltip()

    @


  ###*
   * Показать тултип
   *
   * @method show
   * @param  {Object} event Объект события , где в currentTarget - злемент с тултипом
   * @chainable
   * @public
  ###
  show: (event) ->
    # console.log "@show _hideTimeout=#{_hideTimeout} _showTimeout=#{_showTimeout}"
    _dropTimeout 'hide'

    if @_opt.cancelSelector
      if @_checkCancelSelector event
        @_hideTooltip()
        return

    # проверка на один и тот же элемент
    if _currentEvent and $(_currentEvent.currentTarget).is( $(event.currentTarget) )
      return

    unless _getTitle(event.currentTarget)
      _setTitle(event.currentTarget)

    _currentEvent = event
    _dropTimeout 'show'

    _showTimeout = setTimeout((=>
      unless @_opt.ajax.dataAttr
        @_showToolip()
      else
        @_showAjaxToolip()
    ), @_opt.showDelay)

    @


  ###*
   * Обновление позиции тултипа
   *
   * @method reflow
   * @param  {Object} event Объект события , с координатами курсора
   * @chainable
   * @public
  ###
  reflow: (event) ->
    _lastPosition =
      x: event.pageX
      y: event.pageY

    @


  ###*
   * Диначическое подставление контента в тултип. Адресс запроса берется
   * из атрибута {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}ajax.dataAttr{{/crossLink}}.
   * На время, пока выполняется запрос, в тултипе отображается временный лоадер. При удачном запросе элементу
   * устанавливается data-title, а атрибут ajax.dataAttr удаляется, во избежании повторных запросов
   *
   * @method _showAjaxToolip
   * @private
  ###
  _showAjaxToolip: () ->
    dataUrl = $(_currentEvent.currentTarget).attr @_opt.ajax.dataAttr
    $dataTarget = $(_currentEvent.currentTarget)

    unless dataUrl
      @_showToolip()
    else
      # вставляем Boolean, что бы для лоадера не срабатывал @_opt.onShow
      _ajaxRequest = true
      @_showToolip @_opt.ajax.loader

      _ajaxRequest = $.ajax
        type: 'POST'
        url: dataUrl

        success: (response) =>
          $dataTarget.data 'title', response
          # возможно стоит распилить данную часть, что бы можно было выставить флаг needRefresh - всегда обновлять тултип
          $dataTarget.removeAttr @_opt.ajax.dataAttr
          _ajaxRequest = null
          @_showToolip response, true

        error: (xhr, status, error) =>
          unless status is 'abort'
            _ajaxRequest = null
            @_showToolip @_opt.ajax.error, true


  ###*
   * Основной метод показа тултипа. По умолчанию показывает содержимое
   * из {{#crossLink "Site.App.Views.LiveTooltip/_getTitle:method"}}{{/crossLink}}.
   * Перед определением координат вывода, к тултипу применяются все внешние стили
   * и вставляется содержимое тултипа
   *
   * @param  {String} html содержимое тултипа
   * @param  {Boolean} [holdVisibility] флаг, по которому при обновлении тултипа, сам тултип не скрывается,
   * а только обновляется содержимое. Используется для аякс тултипов при замещении лоадера содержимым тултипа
   * @method _showToolip
   * @private
  ###
  _showToolip: (html, holdVisibility) ->
    unless _currentEvent
      return

    title = html || _getTitle(_currentEvent.currentTarget)

    if not title
      @hide()
      return

    _isHidden = false
    _isVisible = true

    # console.log '_showToolip', title, _currentEvent

    $target = $(_currentEvent.currentTarget)

    tooltipWidth = $target.data('tooltip-width') or ''
    tooltipExtraClass = $target.data('tooltip-extraclass') or ''

    unless holdVisibility
      _tooltip.fadeOut 0, ->
        _tooltip.removeClass 'b-live-tooltip_visible_false'

    _tooltip.width tooltipWidth  if tooltipWidth
    _tooltip.addClass tooltipExtraClass  if tooltipExtraClass
    _tooltip.html(title)

    _addCloseButton()  if @_opt.supportTouch

    coords = @_updateTooltipPosition _currentEvent

    _tooltip.css
      top: coords.y
      left: coords.x
      zIndex: 999

    if typeof @_opt.onShow is 'function' and not _ajaxRequest
      @_opt.onShow.apply _currentEvent, [ _tooltip ]

    _tooltip.fadeIn 200


  ###*
   * Основной метод скрытия тултипа. Если тултип генерится динамически, то отменяет
   * запрос к серверу
   *
   * @method _hideTooltip
   * @private
  ###
  _hideTooltip: ->
    # Вызываем коллбек, если нет аякс запроса и тултип виден
    applyCallback = not _ajaxRequest and _isVisible

    if _ajaxRequest and typeof _ajaxRequest is 'object'
      _ajaxRequest.abort()
      _ajaxRequest = null

    if typeof @_opt.onHide is 'function' and applyCallback
      @_opt.onHide.apply _currentEvent, [ _tooltip ]

    # console.log '_hideTooltip', _currentEvent
    _isHidden = true
    _isVisible = false
    _currentEvent = null

    _tooltip.fadeOut 50, ->
      _tooltip.css('width', '').removeAttr('class').addClass('b-live-tooltip b-live-tooltip_visible_false').html ''


  ###*
   * Высчитываются координаты отображения тултипа(top/left), относительно текущей позиции курсора.
   * При расчетах учитываются размеры {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}$viewPort{{/crossLink}},
   * если тултип не помещается в указаный въюпорт, то контейнер тултипа ровняется по краю видимой области
   *
   * @method _updateTooltipPosition
   * @param {Object} e Текущий объект события
   * @private
   * @return {Object} координаты отображения тултипа {x: number, y: number}
  ###
  _updateTooltipPosition: (e) ->
    positions = {}
    @reflow e unless _lastPosition

    dimensions =
      x: [
        if @_opt.supportTouch then @_opt.$viewPort[0].innerWidth else @_opt.$viewPort.width()
        @_opt.$viewPort.scrollLeft()
        _tooltip.outerWidth()
      ]
      y: [
        if @_opt.supportTouch then @_opt.$viewPort[0].innerHeight else @_opt.$viewPort.height()
        @_opt.$viewPort.scrollTop()
        _tooltip.outerHeight()
      ]

    for axis of dimensions
      if dimensions[axis][0] + dimensions[axis][1] < dimensions[axis][2] + _lastPosition[axis] + @_opt.offset
        positions[axis] = _lastPosition[axis] - dimensions[axis][2] - @_opt.offset

      else
        positions[axis] = _lastPosition[axis] + @_opt.offset

      # если не влазит тултип в текуший вьюпорт, ровняем по left/top c половинчатым @_opt.offset
      if positions[axis] <= dimensions[axis][1]
        positions[axis] = dimensions[axis][1] + @_opt.offset/2

    #console.log '_getTooltipPosition', positions
    positions


  ###*
   * Проверка элемента на наличие класса скрытия тултипа. Если у злемента есть
   * класс {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}cancelSelector{{/crossLink}},
   * либо у ближайшего из его родителей, то тултип непоказывается
   *
   * @method _checkCancelSelector
   * @param {Object} e Текущий объект события
   * @private
   * @return {Boolean} показывать/не показывать тултип
  ###
  _checkCancelSelector: (e) ->
    $target = $(e.target)
    cancelShow = false

    if $target.is(@_opt.selector)
      cancelShow = false

    else if $target.is(@_opt.cancelSelector)
      cancelShow = true

    # переключение чекбокса вызывает клик как минимум в android chrome
    else if e.target.tagName.toLowerCase() == 'input' and e.type == 'click'
      cancelShow = false

    else
      showParentLevel = $target.parentsUntil(@_opt.selector).length
      hideParentLevel = $target.parentsUntil(@_opt.cancelSelector).length

      # показывается, если ближе @_opt.selector. если ближе @_opt.cancelSelector - не показывается
      cancelShow = showParentLevel > hideParentLevel

    cancelShow


  ###*
   * Определение поддержки touch. Если обработчик сработал, то меняются настройки
   * плагина под touch события
   *
   * @method _testSupportTouch
   * @private
  ###
  _testSupportTouch: ->
    isTouchDevices = "ontouchstart" of window or window.DocumentTouch and document instanceof DocumentTouch

    if isTouchDevices
      $(window).on 'touchstart.detectTouch', =>
        $(window).off 'touchstart.detectTouch'

        @_opt.supportTouch = true
        @_opt.showDelay = 0
        @_opt.hideDelay = 0

        @_bindTouchHandlers()


  ###*
   * Снятие всех обработчиков плагина для {{#crossLink "Site.App.Views.LiveTooltip/defaults:property"}}eventNamespace{{/crossLink}}
   *
   * @method _unbindHandlers
   * @private
  ###
  _unbindHandlers: ->
    _tooltip.off ".#{@_opt.eventNamespace}"
    $('body').off ".#{@_opt.eventNamespace}"
    $(window).off ".#{@_opt.eventNamespace}"


  ###*
   * Навешивание обработчиков для mouse событий
   *
   * @method _bindMouseHandlers
   * @private
  ###
  _bindMouseHandlers: ->
    @_unbindHandlers()

    _tooltip.on "mouseenter.#{@_opt.namespace}", (e) ->
      _dropTimeout 'hide'

    _tooltip.on "mouseleave.#{@_opt.namespace}", (e) =>
      @hide()

    events = [
      "mouseover.#{@_opt.namespace}"
      "mouseleave.#{@_opt.namespace}"
      "mousemove.#{@_opt.namespace}"
    ]

    $('body').on events.join(' '), @_opt.selector, (e) =>
      stopEvent e
      # console.log "event.type=#{e.type}, _isHidden=#{_isHidden}, _isVisible=#{_isVisible}"

      if e.type is 'mouseover'
        @show e
      else if e.type is 'mouseleave'
        @hide e
      else if e.type is 'mousemove'
        @reflow e

    # при скроле страницы, скрываем текущий тултип
    $(window).on "scroll.#{@_opt.eventNamespace}", (e) =>
      @hide e  if _isVisible

    if @_opt.cancelSelector
      $('body').on "mouseover.#{@_opt.namespace}", @_opt.cancelSelector, (e) =>
        stopEvent e
        @hide e


  ###*
   * Навешивание обработчиков для touch событий
   * @method _bindTouchHandlers
   * @private
  ###
  _bindTouchHandlers: ->
    @_unbindHandlers()
    # Хак для iOS девайсов, что бы срабатывал click
    $('body').css('cursor', 'pointer').on "click.#{@namespace}", @_opt.selector, (e) =>
      @show e

    _tooltip.on "touchstart.#{@_opt.namespace}", '.b-live-tooltip__close', (e) =>
      stopEvent e
      @_hideTooltip()


  ###*
   * Переносит тултип из аттрибута title в data-title. Если уже есть data-title,
   * то проверяется актуальность тултипа и при необходимости обновляется сам data-title
   *
   * @method _setTitle
   * @param {Object} [target] Объект к которому нужно применить метод
   * @private
   * @static
   * @return {String} HTML тултипа
  ###
  _setTitle = (target) ->
    $target = $(target)
    notSettingTitle = $target.attr('title') and not $target.data('title')
    needUpdateTitle = $target.data('title') and $target.data('title') isnt $target.attr('title')

    if notSettingTitle or needUpdateTitle
      $target.data('title', $target.attr('title')).removeAttr 'title'

  ###*
   * Получить текущий title тултипа
   *
   * @method _getTitle
   * @param {Object} [target] Объект к которому нужно применить метод
   * @private
   * @static
   * @return {String} Текст title
  ###
  _getTitle = (target) ->
    $(target).data('title') or ''

  ###*
   * Определение контейнера для тултипов. Если контейнер есть, то возвращаем его,
   * если нет - создаем новый
   *
   * @method _getTooltipContainer
   * @private
   * @static
   * @return {jQuery} контейнер тултипа
  ###
  _getTooltipContainer = ->
    if $('.b-live-tooltip').length
      $('.b-live-tooltip')
    else
      $('<div class="b-live-tooltip"></div>').hide().appendTo('body')


  ###*
   * Добавляет в тултип кнопку закрыть
   *
   * @method _addCloseButton
   * @static
   * @private
  ###
  _addCloseButton = ->
    unless $('.b-live-tooltip__close', _tooltip).length
      _tooltip.addClass('b-live-tooltip_type_touch').append '<span class="b-live-tooltip__close b-icon b-icon_style_cross"></span>'


  ###*
   * Сбрасывание задержики показа/скрытия тултипа. Если тип не указан, то сбрасываются все таймеры
   *
   * @method _dropTimeout
   * @param {String} [type] Тип сбрасываемого таймера
   * @static
   * @private
  ###
  _dropTimeout = (type) ->
    if not type or type is 'show'
      clearTimeout _showTimeout
      _showTimeout = null

    if not type or type is 'hide'
      clearTimeout _hideTimeout
      _hideTimeout = null


###*
 * jQuery обертка для плагина {{#crossLink "Site.App.Views.LiveTooltip"}}{{/crossLink}}
 *
 *
 * @class liveTooltip
 * @namespace $
 * @param {Object} [options] Настройки плагина
 * @submodule $
 * @return {Object} Текущий экзепляр плагина с настройками
###
$.liveTooltip = (options) ->
  new window.Site.App.Views.LiveTooltip options
