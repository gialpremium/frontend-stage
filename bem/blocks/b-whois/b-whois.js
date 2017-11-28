( function( $ ) {
    var $whoisForm = $('.b-whois-form'),
        domainCheckLocker = require('chooseDomain/lock-domain-checker.js').getInstance( function() {
            location.reload();
        } ),
        $popupWithCaptcha = $('#lock-check-domain-popup');

    // менять цвет кнопки, когда поле становится пустым
    $( '.b-whois-form__field', $whoisForm ).on( 'keyup', function() {
        if ( !this.value ) {
            $( '.b-whois-form__button', $whoisForm )
                .removeClass('b-button_color_primary-alternate')
                .addClass('b-button_color_primary');
        }
    } );

    function checkFormField( message, e ) {
        alert( message );
        stopEvent( e );
    }

    $whoisForm.submit( function( e ) {

        var $field           = $( '.b-whois-form__field', this ),
            fieldText        = $field.val().trim(),
            registrarPattern = /^\s*[-A-Z0-9]+(?:-[A-Z0-9]+)?-[A-Z0-9]+\s*$/i;

        if ( $field.attr('name') === 'registrar' ) {
            $( this ).find('input[name="registrar"]').val( fieldText.toUpperCase() );
        }

        if ( !fieldText ) {
            checkFormField( t('whois.bad_name'), e );
        }
        else if ( $field.attr('name') === 'registrar' && !fieldText.match( registrarPattern ) ) {
            checkFormField( t('whois.no_registrar'), e );
        }
        else if (
            $field.attr('name') === 'site'
            && !$.validator.methods.dname( fieldText, $field )
        ) {
            checkFormField( t('whois.no_site'), e );
        }
        else if (
            $field.attr('name') === 'dname'
            && !(
                $.validator.methods.dname( fieldText, $field )
                || $.validator.methods.real_ip( fieldText, $field )
            )
        ) {
            checkFormField( t('whois.no_dname'), e );
        }
        else {
            $('.b-loading').show();
            $('.b-whois__wrapper_hide_loading').hide();
        }
    } );


    // widgets
    $('.b-whois-widget_type_link').on( 'click', function( e ) {
        var $this = $( this );

        stopEvent( e );
        window.open( $( '.b-whois-widget__button', $this ).attr('href') );
    } );


    // punycode converter
    function convertURL( url ) {
        var formValue,
            matchy,
            convertResult;

        if ( !url ) {
            return '';
        }

        formValue = url.toLowerCase();
        matchy = formValue.match( /(?:https?:\/\/)?([^/\s]+)\/?/ )[1];

        if ( matchy.substring( 0, 4 ) === 'xn--' ) {
            convertResult = punycode.ToUnicode( matchy );
        }
        else {
            convertResult = punycode.ToASCII( matchy );
        }

        return formValue.replace( matchy, convertResult );
    }

    $('.b-whois__ip-link').click( function() {
        $whoisForm.find('input[name="dname"]').val( window.REMOTE_HOST );

        return false;
    } );


    $('.b-whois__punycode-link').click( function() {
        var $urlField = $whoisForm.find('input[name="dname"]'),
            url = $urlField.val();

        $urlField.val( convertURL( url ) );

        return false;
    } );


    $( window ).on( 'load', function() {

        // если пришло значение WHOIS_SEARCH и текущая позиция ниже позиции формы
        // при загрузке страницы скроллить к форме
        $whoisForm.each( function() {
            var $this = $( this );

            if ( window.WHOIS_SEARCH && $( document ).scrollTop() < $this.offset().top ) {
                $('html, body').animate( { scrollTop: $this.offset().top }, 500 );
            }
        } );

        /*
           показать попап с каптчей если она есть
         */
        if ( $popupWithCaptcha.length ) {
            domainCheckLocker.showPopup();
        }
    } );
} )( jQuery );

window.oneClickRenderer = ( function() {

    var oneClickRenderer = function( options ) {
        this.options = _.extend( {
            domain   : '',
            price    : '',
            oneclick : {
                disabled   : false,
                profiles   : [],
                balance    : 0,
                autocharge : {
                    bindings : [],
                    binding  : 0,
                    title    : '',
                },
            },
        }, options );

        this.oneclick = _.extend( this.options.oneclick, { domains: [ this.options.domain ] } );

        this.init();
    };

    oneClickRenderer.prototype = {

        init : function() {
            var bindings = this.oneclick.autocharge.bindings.length,
                type     = this.oneclick.balance >= this.options.price ? 'balance' : '';

            if ( type == 'balance' ) {
                this.oneclick.autocharge.binding = 0;
                this.oneclick.autocharge.title   = '';
            }
            else if ( bindings === 1 ) {
                this.oneclick.autocharge.binding = this.oneclick.autocharge.bindings[0].binding_id;
                type = 'card';
            }
            else if ( bindings ) {
                type = 'card_choose';
            }

            this.oneclick.type = type;


            this
                .initDOM()
                .render();

            return this;
        },

        initDOM : function() {
            var self = this;

            this.$oneclickWrapper = $('.b-checkmany-oneclick');

            // однокликовая регистрация (выбор профиля)
            this.$oneclickWrapper.on( 'change', '.b-checkmany-oneclick__profile', function() {
                var index = $( this ).data('profile-index');

                self.oneclick.profiles[ index ].selected = $( this ).val();
                self.oneclick.profiles[ index ].selectedTitle = $( 'option', this ).eq( this.selectedIndex ).text();
                self.render();

                return true;
            } );

            // однокликовая регистрация (выбор кредитной карты)
            this.$oneclickWrapper.on( 'change', '.b-checkmany-oneclick__card', function() {
                self.oneclick.autocharge.binding = $( this ).val();
                self.oneclick.autocharge.title   = $( 'option', this ).eq( this.selectedIndex ).text();
                self.render();

                return true;
            } );

            this.$oneclickWrapper.on( 'click', '.b-checkmany-oneclick__submit', function() {
                $('.b-whois-oneclick-form').submit();
            } );

            return this;
        },

        render : function() {

            this.$oneclickWrapper.html(
                require('chooseDomain/templates/oneclick.jade')( {
                    oneclick   : this.oneclick,
                    isOneclick : true,
                    isSingle   : true,
                } )
            );

            return this;
        },

    };

    return oneClickRenderer;

} )();
