$( function() {
    if ( $.cookie('transition_needs_saving') == '1' ) {
        setTimeout( function() {
            var cc = window.currentClient;

            $.ajax( {
                url  : '/misc/referral_transition',
                data : {
                    os       : cc.os,
                    device   : cc.deviceType,
                    language : navigator.language.replace( /-.+/, '' ).toUpperCase(),
                    browser  : cc.browser,
                },
            } );
        }, 2 * 1000 ); // сюда надо подставлять значение из конфига
    }
} );
