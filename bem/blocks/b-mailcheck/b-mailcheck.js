if ( $.fn.mailcheck ) {

    $( function() {
        var suggestion_msg = ru ? 'Вы имели в виду ' : 'Did you mean ',
            $sugg_hint,
            $sugg_link,
            domains = [
                'mail.ru',
                'yandex.ru',
                'gmail.com',
                'bk.ru',
                'rambler.ru',
                'ya.ru',
                'list.ru',
                'inbox.ru',
                'yahoo.com',
                'hotmail.com',
                'ukr.net',
                'live.ru',
                '163.com',
                'gmail.ru',
                'narod.ru',
                'ngs.ru',
                'pochta.ru',
                'me.com',
                'tut.by',
                'i.ua',
                '126.com',
                'yandex.ua',
                'nm.ru',
                'pisem.net',
                'yandex.com',
                'mail.com',
                'qip.ru',
                'meta.ua',
                'sibmail.com',
                'inbox.lv',
                'bigmir.net',
                'spaces.ru',
                'livingwealthyhealthy.com',
                'land.ru',
                'binoculars-rating.com',
                'e1.ru',
                'tom.com',
                'hotbox.ru',
                'googlemail.com',
                'ro.ru',
                'aol.com',
                'reg.ru',
            ],
            tlds = [
                'co.uk',
                'com',
                'net',
                'org',
                'info',
                'edu',
                'gov',
                'mil',
                'ru',
                'com.ua',
            ];

        $('body').on( 'blur change keyup mouseup', 'input[type=email]', function( e ) {
            var $email = $( this ),
                $zindex_donor;

            if ( $email.attr('disabled') || $email.attr('readonly') ) {
                return;
            }

            if ( $email.closest('.b-popup').length ) {
                $zindex_donor = $email.closest('.b-popup');
            }
            else {
                $zindex_donor = $email;
            }


            if ( !$email.val().match( /[0-9a-z_]+@[0-9a-z_^.]+\.[a-z]{2,6}/ ) ) {
                if ( $sugg_hint ) {
                    $sugg_hint.hooc('hide');
                }

                return;
            }

            $email.mailcheck( {
                domains         : domains,
                topLevelDomains : tlds,

                suggested : function( element, suggestion ) {
                    var email_height = $email.outerHeight(),
                        sugg_left = $email.offset().left,
                        sugg_top = $email.offset().top + email_height,
                        last_email = $email.val().split(',').pop().trim(),
                        suggested_email = {},
                        new_value,
                        i;

                    if ( !$sugg_hint ) {
                        $sugg_hint = $( '<span class="b-mailcheck-suggestion i-mailcheck-suggestion">'
                            + suggestion_msg + '<a href="#" class="i-mailcheck-suggestion__link b-link"></a>?</span>'
                        ).appendTo( $('.b-page') );
                        $sugg_link = $( '.i-mailcheck-suggestion__link', $sugg_hint );
                    }

                    $email.attr( { autocomplete: 'off' } );

                    $sugg_hint.css( {
                        'top'  : sugg_top + 'px',
                        'left' : sugg_left + 'px',
                    } ).hooc( 'show', function() {
                        $email.attr( { autocomplete: 'on' } );
                    }, e ).zIndex( $zindex_donor.zIndex() + 1 );

                    if ( suggestion.length ) {
                        for ( i = 0; i < suggestion.length; i++ ) {
                            if ( suggestion[i].original == last_email ) {
                                suggested_email = suggestion[i];
                            }
                        }
                    }
                    else {
                        suggested_email = suggestion;
                    }

                    new_value = decodeURI( $email.val() ).replace( suggested_email.original, suggested_email.full );

                    $sugg_link.html( suggested_email.full ).click( function() {
                        $email.val( new_value );
                        $sugg_hint.hooc('hide');

                        return false;
                    } );
                },

                empty : function() {
                    if ( $sugg_hint ) {
                        $sugg_hint.hooc('hide');
                    }
                },
            } );
        } );
    } );
}
