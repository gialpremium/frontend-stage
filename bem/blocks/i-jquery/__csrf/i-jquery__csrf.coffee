# CSRF protection
do (window) ->
    "use strict";

    $ = window.jQuery
    setTimeout = window.setTimeout

    _token = null
    install = $.csrf = ->
        # if $.cookie('is_authorized') == 1
        #   $.cookie('_csrf', null)

        token = _token || $('head>meta[name="_csrf"]').prop('content') || $.cookie('_csrf')

        return @  unless token

        _token = token

        $('form:not(.no-csrf)').each (i, item) ->
            $item  = $ item
            $input = $item.find 'input[name="_csrf"]'

            if $input.length == 0
                $item.append ->
                    $('<input />').attr
                        type: 'hidden'
                        value: token
                        name: '_csrf'
            else
                $input.val token

        $.ajaxSetup
            headers:
                'X-Csrf-Token': token

        @

    $.csrf.getToken = ->
        unless _token
          install()
        return _token

    $.csrf.setToken = (token) ->
        _token = token
        install()


    # продление жизни токену
    renewToken = ->
        return 1    unless _token
        $.post("/user/renew_token/" + _token ).complete ->
            needRenewToken()
            1

    needRenewToken = ->
        setTimeout renewToken, 1600000 #  раз в 1800 - 200 (на всякий) секунд


    $ ->
        install()
        needRenewToken()
        1
