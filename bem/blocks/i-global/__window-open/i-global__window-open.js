( function() {
    var nativeWindowOpen = window.open;

    window.open = function() {
        var _args     = [].slice.call( arguments, 0 ),
            newWindow = nativeWindowOpen.apply( this, _args );

        newWindow.location = _args[0];
        newWindow.opener   = null;

        return newWindow;
    };
} );
