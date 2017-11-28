do (window) ->
  "use strict"
  clearTimeout = window.clearTimeout
  setTimeout = window.setTimeout
  Raven = window.Raven

  # ленивцы записываются в хэш по их id.
  # структура ленивца {
  #  timer: timerHandle
  #   initiated: timeStamp
  #   callback: callback
  #   lazyness: lazyness
  #   disableCount: 0
  # }
  sloths = {}

  getTimeStamp = ->
    (new Date()).valueOf()

  captureException = ( e ) ->
    if Raven
      Raven.captureException e
    else
      throw e
    null

  wrapExceptions = (lambda ) ->
    if Raven
      Raven.wrap lambda
    else
      lambda

  setTimer = ( id, delay ) ->
    try
      wrapper = wrapExceptions ->
        sloth = sloths[id]
        return null  unless sloth
        callback = sloth.callback
        delete sloths[id]
        callback()  if callback
        sloth = null
      sloths[id].timer = setTimeout(
        wrapper
        delay
      )
    catch e
      captureException e
    null

  resetTimer = ( id ) ->
    try
      sloth = sloths[id]
      if sloth && sloth.timer
        clearTimeout sloth.timer
        sloth.timer = null
    catch e
      captureException e
    null

  window.lazy = ( id, callback, lazyness = 50, timeLimit = 200 ) ->
    try
      now   = getTimeStamp()
      sloth = sloths[id]

      if sloth
        if (now - sloth.initiated) >= timeLimit
          lazyness = 0
        resetTimer id
        unless callback
          delete sloths[id]
          return

      else
        return unless callback

        sloth = sloths[id] = {
          initiated:    now
          disableCount: 0
        }

      sloth.callback = callback
      sloth.lazyness = lazyness

      if sloth.disableCount == 0
        setTimer id, lazyness
    catch e
      captureException e
    null

  window.lazy.disable = ( id ) ->
    try
      sloth = sloths[id]
      unless sloth
        sloth = sloths[id] = {
          initiated:    getTimeStamp()
          callback:     null
          lazyness:     0
          disableCount: 0
        }
      else
        if sloth.disableCount == 0
          resetTimer id

      sloth.disableCount += 1
    catch e
      captureException e
    null

  window.lazy.enable = ( id ) ->
    try
      sloth = sloths[id]
      return unless sloth
      sloth.disableCount -= 1
      if sloth.disableCount == 0 && sloth.callback
        setTimer id, sloth.lazyness
    catch e
      captureException e
    null

  1
