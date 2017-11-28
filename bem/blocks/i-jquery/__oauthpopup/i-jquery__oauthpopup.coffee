# inspired by DISQUS
do (window) ->
    "use strict";
    $ = window.jQuery

    $.oauthpopup = (options) ->
        if !options || !options.path
            throw new Error "options.path must not be empty"

        screen = window.screen

        options = $.extend
            windowName: 'ConnectWithOAuth', # should not include space for IE
            windowOptions: [
                'location=0,status=0,width=800,height=400,'
                'top='
                ((screen.height-400)/2)
                ','
                'left='
                ((screen.width-800)/2)
                ''
            ].join('')
            callback: () -> window.location.reload()
        , options

        oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
        oauthInterval = window.setInterval () ->
            if oauthWindow && oauthWindow.closed
                window.clearInterval oauthInterval
                options.callback()
            null
        , 1000

    null
