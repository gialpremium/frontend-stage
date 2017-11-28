 $ ->
  $('.i-select-location').bSelect 'setOption', 'onSelected', ->
    value = this.$select.val()

    if value
      if value.match(/^\?/)
        location.search = value

      else if value.match(/^\#/)
        location.hash = value.substr 1

      else
        location.href = value
