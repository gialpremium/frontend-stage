( function() {
    $('.b-screenshot').click( function() {
        var imageSrc = $( this ).find('img')[0].src;

        $.fancybox( {
            padding : 0,
            href    : imageSrc,
            wrapCSS : 'b-screenshot-popup',
            tpl     : {
                closeBtn : '<a title="Close"'
                            + ' class="b-screenshot-popup__close b-icon b-icon_style_cross"'
                            + ' href="javascript:;"></a>',
            },
            closeClick : true,
            helpers    : { overlay: { css: { 'background': '#e5e5e5' } } },
        } );
    } );
} )();
