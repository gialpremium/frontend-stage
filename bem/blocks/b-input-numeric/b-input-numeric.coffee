# onChange
# onInit
# events

$.fn.inputNumeric = (options) ->
  _opt = $.extend(
    step: 1
  , options)

  @.each ->
    $input = $('.b-input-numeric__value', @)
    $realInput = $('.b-input-numeric__real-value', @)
    $button = $('.b-input-numeric__button', @)
    buttonDisabledClass = 'b-input-numeric__button_state_disabled'
    minValue = ( $realInput.attr 'min' or _opt.min or 0 ) * 1
    maxValue = ( $realInput.attr 'max' or _opt.max or 0 ) * 1
    defaultValue = $input.html() or minValue or maxValue or ''
    step = $realInput.attr('step') * 1 or _opt.step
    inputEvents = ['keyup']

    if _opt.events
      inputEvents = inputEvents.concat _opt.events


    $input.on inputEvents.join(' '), ->
      currentValue = _updateInputValue()

      _opt.onChange.apply $input, [ currentValue ] if _opt.onChange and currentValue


    $button.on 'click', (e)->
      e.preventDefault()

      unless $(@).hasClass buttonDisabledClass
        increment = $(@).hasClass 'b-input-numeric__button_icon_increment'
        currentValue = _updateInputValue increment

        _opt.onChange.apply $input, [ currentValue ] if _opt.onChange and currentValue


    # вычисление нового значения
    _updateInputValue = (increment) ->
      currentValue = format_sum_to_number $input.html()

      if typeof increment isnt 'undefined'
        currentValue = parseInt(currentValue, 10)
        newValue = if increment then currentValue + step else currentValue - step
      else
        newValue = parseInt(currentValue, 10)

      newValue = _checkValueLimits newValue

      _toggleButtonsState newValue

      # обновлять только при несовпадении значения
      # иначе при вводе текста будет прыгать курсор
      if newValue.toString() != $input.html()
        $input.html( newValue )

      $realInput.val newValue

      newValue


    # дизейбл кнопок +/-
    _toggleButtonsState = (currentValue) ->
      $button.removeClass buttonDisabledClass

      if currentValue is minValue
        $button.filter('.b-input-numeric__button_icon_decrement').addClass buttonDisabledClass

      if currentValue is maxValue
        $button.filter('.b-input-numeric__button_icon_increment').addClass buttonDisabledClass


    # проверка нового значения на лимиты
    _checkValueLimits = (value) ->
      newValue = parseInt(value, 10)

      if !parseInt(value, 10)
        newValue = minValue

      if ( minValue is 0 or minValue ) and value <= minValue
        newValue = minValue

      if maxValue and value >= maxValue
        newValue = maxValue

      newValue


    # обновляем состояние инпута при инициализации
    _updateInputValue()
    _opt.onInit.apply $input, [ defaultValue ] if _opt.onInit
