$( function() {
    'use strict';

    var COOKIE_NAME     = '_agava',
        COOKIE_LIFETIME = 365;

    if ( isAgavaReferrer() && !hasAgavaCookie() ) {

        // На данных страницах кука ставится без попапа
        if ( isSpecialPage() ) {
            saveAgavaCookie( COOKIE_NAME, COOKIE_LIFETIME );
        }
        else {
            $('#agava-popup').hooc( 'show', {
                onhide : function() {
                    saveAgavaCookie( COOKIE_NAME, COOKIE_LIFETIME );
                }, 
            } );
        }
    }

    function isAgavaReferrer() {
        return /https?:\/\/(?:[^/]*\.)*agava\.ru(?:\/|$)/.test( document.referrer );
    }

    function isSpecialPage() {
        return /^\/(support|user)\//.test( window.location.pathname );
    }

    function hasAgavaCookie() {
        return !!$.cookie( COOKIE_NAME );
    }

    function saveAgavaCookie( cookieName, cookieLifetime ) {
        $.cookie( cookieName, 1, {
            expires : cookieLifetime,
            path    : '/',
            domain  : '.reg.ru',
        } );
    }
} );
