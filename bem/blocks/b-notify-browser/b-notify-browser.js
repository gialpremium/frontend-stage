var DEFAULT_EXPIRATION_TIME = 30,
    arrayCookies = document.cookie.split('; '),
    notifyBrowserCookie = 0,
    i;

for ( i = 0; i < arrayCookies.length; i++ ) {
    if ( arrayCookies[i].indexOf('hide_notify_browser') >= 0 ) {
        notifyBrowserCookie = 1;
    }
}

if ( ( !window.currentClient.accept && !notifyBrowserCookie ) || !window.jQuery ) {
    document.getElementById('notify_browser').style.display = 'block';
    document.body.className += ' b-page_notify-browser_visible';
}

$( function() {
    $('#notify_browser_close').click( function() {
        $('#notify_browser').hide();
        $('.b-page').removeClass('b-page_notify-browser_visible');
        $.cookie( 'hide_notify_browser', 1, { expires: DEFAULT_EXPIRATION_TIME } );

        return false;
    } );
} );
