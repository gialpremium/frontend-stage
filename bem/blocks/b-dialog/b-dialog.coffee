###*
 * Глобальная область видимости window
 * @module window
###

###*
 * Различные модули представлений
 * @submodule Site.App.Views
###

###*
 * Создание диалогового окна. Для рендера использует свой JADE шаблон, внутри которого происходит
 * вызов миксина bPopup с определенными параметрами. Кнопки генерятся через b-button.jade.<br />
 * При помощи keymap можно подписать попап на различные события(dialog:keyup, custom:event)
 *
 * @example
 * См. код конструктор для glamor_alert glamor_confirm
 *
 * @class Dialog
 * @namespace Site.App.Views
 * @submodule Site.App.Views
 * @constructor
 * @param  {String}   message Сообщение в виде текста или html разметки
 * @param  {Object}   options Настроки для попапа
 * @param  {String}   options.title Заголовок для сообшения
 * @param  {Array}    options.buttons Массив опций для кнопок
 * @param  {Object}   options.keymap маппинг методов на внутренние событий
 * @param  {Function} options.keymap.close нажата кнопка закрытия
 * @param  {Function} options.keymap.esc нажата клавиша Esc
 * @param  {Function} options.keymap.enter нажата клавиша Enter
###
class window.Site.App.Views.Dialog
  constructor: (@message, @options)->
    ###*
     * срендереный попап
     *
     * @property {jQuery} $view
     * @private
    ###
    @$view = $( @_generateContent() )

    $('.b-dialog__actions', @$view).append @_generateButtons()
    $('body').append @$view

    @_bindDefaultHadlers()

  ###*
   * Генерация контента попапа.
   *
   * @method _generateContent
   * @return {String} HTML попапа
   * @private
  ###
  _generateContent: ->
    # для уникального ID попапа
    currentDate = new Date
    dialogOptions = _.extend @options,
      id: "dialog_#{currentDate.getTime()}"
      message: @message
      # ради обертки
      modal: true

    require('./b-dialog.jade') dialogOptions


  ###*
   * Генерация кнопок для попапа, биндинг обработчиков на кнопки
   *
   * @method _generateButtons
   * @return {Array} Массив jQuery кнопок
   * @private
  ###
  _generateButtons: ->
    for btn in @options.buttons
      $btn = $( JST['b-button'] btn )

      if btn.handler
        $btn.on 'click', $.proxy btn.handler, @

      $btn

  ###*
   * Биндинг обработчиков попапа. Кнопка закрытия диалога, привязка методов keymap
   * к внутренней системе событий dialog:keyup
   *
   * @method _bindDefaultHadlers
   * @private
  ###
  _bindDefaultHadlers: ->
    @$view.find('.b-popup__trigger-close').one 'click', $.proxy((e)->
      if @.options.keymap and @.options.keymap.close
        @.options.keymap.close.apply @
      else
        @close()
    , @)

    @$view.on 'dialog:keyup', $.proxy((e, key)->
      if @.options.keymap and @.options.keymap[key]
        @.options.keymap[key].apply @
    , @)


  ###*
   * Открытие попап диалога. После открытия устанавливаем на него фокус,
   * что бы корректно работал кейбиндинг
   *
   * @method open
   * @chainable
   * @public
  ###
  open: ->
    mL = parseInt @$view.outerWidth() / 2, 10
    $view = @$view

    bPopupInit( $view )

    setTimeout(->
      $view.hooc('show')
      $view.focus()
    , 1);

    @

  ###*
   * Закрытие попап диалога. После закрытия вызывается метод {{#crossLink "Site.App.Views.Dialog/destroy:method"}}{{/crossLink}}
   *
   * @method close
   * @chainable
   * @public
  ###
  close: ->
    @$view.hooc('hide')

    @destroy()

  ###*
   * Удаление попап диалога из DOM
   *
   * @method destroy
   * @chainable
   * @public
  ###
  destroy: ->
    @$view.off().remove()

    @



###*
 * @module window
###

###*
 * Декорированый alert(), работающий на основе {{#crossLink "Site.App.Views.Dialog"}}{{/crossLink}}. Можно кастомизировать тайтл,
 * навесить обработчик на закрытие(сработает также при Esc, Enter).
 * По умолчанию срабатывает {{#crossLink "Site.App.Views.Dialog/close:method"}}Dialog.close{{/crossLink}}
 *
 * @example
 *  **Простой алерта:**
 *     alert('Пароль успешно изменён');
 *
 *  ***
 *
 *  **Алерт с заголовкам:**
 *     alert('Пароль успешно изменён', {}, 'Смена пароля');
 *
 * @uses Dialog
 * @class glamor_alert
 * @constructor
 * @param  {String}     message                     Текст сообщения
 * @param  {Object}     callback                    Обработчики диалога
 * @param  {Function}   callback.ok=Site.App.Views.Dialog.close  Обработчик на клик OK
 * @param  {String}     title=ПОДТВЕРЖДЕНИЕ       Заголовок для сообшения
 * @return {Dialog}     Текущий экземпляр
 * @static
###
window.glamor_alert = (message, callback, title) ->
  true unless message

  # переопределяем стандартный обработчик
  buttonsHandlers = _.extend(
    ok: ->
      @close()

  , callback)

  dialog = new window.Site.App.Views.Dialog message,
    title: title or if ru then 'ВНИМАНИЕ' else 'Important'

    keymap:
      close: buttonsHandlers.ok
      esc: buttonsHandlers.ok
      enter: buttonsHandlers.ok

    buttons: [
      text: 'OK'
      handler: buttonsHandlers.ok
    ]

  dialog.open()

###*
 * Декорированый confirm(), работающий на основе {{#crossLink "Site.App.Views.Dialog"}}{{/crossLink}}. Можно кастомизировать тайтл.
 * По умолчанию при нажатии на кнопки - диалог просто закрывается.
 * В условия (if|else) его положить не получится, так как всегда будет возвращать true.
 * При нажатии на Esc будет отработан cancel обработчик, при Enter - Ok. По умолчанию на кнопках навешан
 * {{#crossLink "Site.App.Views.Dialog/close:method"}}Dialog.close{{/crossLink}}
 *
 * @example
 *     glamor_confirm('Вы уверены, что хотите сбросить пароль на аккаунт?', {
 *         ok: function() {
 *            console.log('press OK');
 *            this.close();
 *         },
 *         cancel: function() {
 *            console.log('press cancel');
 *            this.close();
 *         }
 *     }, 'Подтверждение сброса');
 *
 * @uses Dialog
 * @class glamor_confirm
 * @constructor
 * @param  {String}     message                 Текст сообщения
 * @param  {Object}     callback                Обработчики диалога
 * @param  {Function}   callback.ok             Обработчик на клик OK
 * @param  {Function}   callback.cancel         Обработчик на клик CANCEL
 * @param  {String}     title=ПОДТВЕРЖДЕНИЕ   Заголовок для сообшения
 * @return {Dialog}     Текущий экземпляр
 * @static
###
window.glamor_confirm = (message, callback, options) ->
  true unless message

  # переопределяем стандартный обработчик
  buttonsHandlers = _.extend(
    ok: ->
      @close()

    cancel: ->
      @close()

  , callback)

  dialog = new window.Site.App.Views.Dialog message,
    title: options?.title or if ru then 'ПОДТВЕРЖДЕНИЕ' else 'CONFIRMATION'

    keymap:
      close: buttonsHandlers.cancel
      esc: buttonsHandlers.cancel
      enter: buttonsHandlers.ok

    buttons: [
      text: options?.okText or 'OK'
      handler: buttonsHandlers.ok
    ,
      text: options?.cancelText or if ru then 'Отмена' else 'Cancel'
      color: 'important'
      handler: buttonsHandlers.cancel
    ]

  dialog.open()


###*
 * Аналог glamor_confirm, только в качестве механизма взаимодействия(ok/cancel) используется промис
 *
 * @example
 *     glamor_confirm_promise('Вы уверены, что хотите сбросить пароль на аккаунт?')
 *       .then(function() { console.log('click OK')})
 *       .fail(function() { console.log('click CANCEL')});
 *
 * @uses Dialog
 * @class glamor_confirm_promise
 * @constructor
 * @param  {String}     message                 Текст сообщения
 * @param  {String}     title=ПОДТВЕРЖДЕНИЕ   Заголовок для сообшения
 * @return {Promise}    Промис конфирма
 * @static
###
window.glamor_confirm_promise = (message, options) ->
  true unless message

  def = $.Deferred()

  buttonsHandlers =
    ok: ->
      @close()
      def.resolve()

    cancel: ->
      @close()
      def.reject()

  glamor_confirm message, buttonsHandlers, options

  def.promise()


# навешивание прослушки клавиш Esc, Enter
$ ->
  $(document).on 'keyup', (e) ->
    key = e.which
    $upperPopup = undefined

    if key is 27 or key is 13
      $dialog = $('.b-dialog:visible')

      if $dialog.length
        # отбираем по zIndex самый верхний попап
        $dialog.each ->
          unless $upperPopup
            $upperPopup = $(this)
          else if $(this).css('zIndex')*1 > $upperPopup.css('zIndex')*1
            $upperPopup = $(this)

        ###*
         * Генерация внутреннего события при нажатии клавиш.
         *
         * @event dialog:keyup
         * @param {Event} e
         * @param {String} pressedKey Нажатая кнопка
         * @for Dialog
        ###
        if key == 27
          $upperPopup.trigger 'dialog:keyup', ['esc']
        else if key == 13 and e.target.nodeName != 'TEXTAREA' and e.target.nodeName != 'INPUT'
          $upperPopup.trigger 'dialog:keyup', ['enter']

window.alert = window.glamor_alert
