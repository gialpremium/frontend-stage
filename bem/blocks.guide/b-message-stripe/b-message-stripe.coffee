# умеет сворачиваться/разворачиваться, закрываться
# состояния хранит в sessionStorage по id блока сообщения
# Клик по заголовку сворачивает/разворачивает сообщение
#

$ ->
  # класс переключения состояния
  stateClass = 'b-message-stripe_state_collapsed'
  # настройка хранилища
  storage = new window.Storage
    storageType: 'session'
    prefix: 'regru_'

  # Метод обрабатывает данные с хранилища
  # b-message-stripe_state_hidden - флаг когда на странице раскрыт фильтр, и сообщения изначально невидно
  # Если сообщение закрыто, то удаляем его из дом
  processMessageState = ($message, id) ->
    sessionData = storage.get(id) or {}

    if sessionData.collapsed
      toggleMessageStyle $message, true
    else if typeof sessionData.collapsed isnt 'undefined'
      toggleMessageStyle $message, false

    unless sessionData.closed
      $message.slideDown 'fast' unless $message.hasClass 'b-message-stripe_state_hidden'
    else
      $message.remove()

  # сворачивание/разворачивание блока
  # обновление иконки toggle
  toggleMessageStyle = ($message, collapsed) ->
    $toggleLink = $('.b-message-stripe__toggle', $message)

    if collapsed
      $toggleLink.removeClass('b-icon_style_fold').addClass('b-icon_style_unfold')
      $message.addClass stateClass
    else
      $toggleLink.addClass('b-icon_style_fold').removeClass('b-icon_style_unfold')
      $message.removeClass stateClass

  # перебираем сообщения, инициируем, вешаем обработчики
  $('.b-message-stripe:not(.b-message-stripe_is_static)').each ->
    $message = $(this)
    storageId = $message.attr 'id'

    processMessageState $message, storageId

    # переключение состояния, обновление sessionStorage
    $('.b-message-stripe__toggle, .b-message-stripe__title', $message) .on 'click', (e) ->
      e.preventDefault()
      $this = $(this)
      sessionData = storage.get(storageId) or {}

      if $message.hasClass stateClass
        toggleMessageStyle $message, false
        sessionData.collapsed = 0
      else
        toggleMessageStyle $message, true
        sessionData.collapsed = 1

      storage.set storageId, sessionData


    # закрытие и удаление из DOM сообщения, обновление sessionStorage
    $('.b-message-stripe__close', $message) .on 'click', (e) ->
      e.preventDefault()
      sessionData = storage.get(storageId) or {}

      $message.slideUp('fast', ->
        $(this).remove()
      )
      sessionData.closed = 1
      storage.set storageId, sessionData
