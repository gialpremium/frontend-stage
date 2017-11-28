require('imports-loader?this=>window!tinymce/tinymce.js');
require('imports-loader?this=>window!tinymce/themes/modern/theme.js');

require('imports-loader?this=>window!tinymce/plugins/paste/plugin.js');
require('imports-loader?this=>window!tinymce/plugins/table/plugin.js');

/* eslint-disable */
var init = window.tinymce.init.bind( window.tinymce ),
    DEFAULTS = {
        skin    : false,
        plugins : 'paste table',
    };

window.tinymce.init = function( settings ) {
    var obj = Object.assign( DEFAULTS, settings );

    return init( obj );
};
