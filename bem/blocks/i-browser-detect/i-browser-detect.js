require('imports-loader?this=>window!detectizr/dist/detectizr.js');

/*
global
    Detectizr,
*/
window.currentClient = ( function() {
    var currentClient = {
            browser    : Detectizr.browser.name,
            version    : parseFloat( Detectizr.browser.version ),
            os         : Detectizr.os.name,
            device     : Detectizr.device.model,
            deviceType : Detectizr.device.type,
            accept     : true,
        },

        // Accepted browsers
        acceptedBrowsers = [
            ['chrome', '30'],
            ['firefox','30'],
            ['ie', '10'],
            ['opera', '12'],
            ['safari', '6'],
        ],
        i;

    // форматирует данные под проверку с сервера
    if ( currentClient.os === 'windows'
         && ( currentClient.deviceType === 'phone' || currentClient.deviceType === 'tablet' ) ) {
        currentClient.os = 'windows_phone';
    }
    else if ( currentClient.os === 'mac os' ) {
        currentClient.os = 'macos';
    }

    if ( currentClient.deviceType === 'desktop' ) {
        currentClient.deviceType = 'pc';
    }

    if ( currentClient.browser && currentClient.version ) {
        for ( i = 0; i < acceptedBrowsers.length; i++ ) {
            if ( currentClient.browser == acceptedBrowsers[i][0] ) {
                currentClient.accept = currentClient.version >= parseFloat( acceptedBrowsers[i][1] );
            }
        }
    }

    return currentClient;
} )();

// используется в b-loading
if ( window.currentClient.browser === 'opera' && /^12\./i.test( window.currentClient.version ) ) {
    document.getElementsByTagName('html')[0].className += ' opera-old';
}
