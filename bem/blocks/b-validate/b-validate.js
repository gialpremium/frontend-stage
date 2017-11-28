$( function() {
    var ERROR_PATH = 'validate.errors.messages.',
        glamor_error_in_head_text = t( ERROR_PATH + 'form' ),
        error_mesages = {
            maxlength : $.validator.format( t( ERROR_PATH + 'maxlength', '{0}' ) ),
            range     : $.validator.format( t( ERROR_PATH + 'range', {
                from : '{0}',
                to   : '{1}',
            } ) ),
            max         : $.validator.format( t( ERROR_PATH + 'max', '{0}' ) ),
            min         : $.validator.format( t( ERROR_PATH + 'min', '{0}' ) ),
            rangelength : $.validator.format( t( ERROR_PATH + 'rangelength', {
                from : '{0}',
                to   : '{1}',
            } ) ),
        },
        errorFields = Site.ValidationErrors,
        error_length,
        i;

    [
        'required', 'remote', 'email', 'url', 'date', 'dateISO', 'number', 'digits', 'equalTo', 'accept',
        'ascii', 'reqrus', 'onlyrus', 'creditcard', 'valid_ip', 'dname', 'real_ip', 'required_file',
    ].forEach( function( item ) {
        error_mesages[item] = t( ERROR_PATH + item );
    } );

    $.extend( true, $.validator.messages, error_mesages );

    // нужна видимость функций для b-validate.inc,
    // можно в виде плагина, пока так

    $.fn.get_clear_value = function( value ) {
        var nameValue = $( this ).attr('placeholder');

        return value == nameValue ? '' : value;
    };

    $.fn.optional_ok = function( value ) {
        var $required = $( this ).filter('[class $= required]');

        return !( value.length || $required.length );
    };


    // Inline definition
    $.validator.addMethod( 'dname', function( value, element ) {
        var $element = $( element );

        if ( $element.optional_ok( value ) ) {
            return true;
        }

        if ( $element.hasClass('no_idn') && /xn--/i.test( value ) ) {
            return false;
        }

        if ( $element.hasClass('allow_multi') ) {
            if ( $element.hasClass('no_idn') ) {
                return /^((\*\.){0,1}([A-Za-z0-9\-_])+\.)+([A-Za-z0-9\-_]{1,13})$/i.test( value );
            }
            else {
                return /^((\*\.){0,1}([A-Za-zА-Яа-яЁё0-9\-_])+\.)+([A-Za-zА-Яа-яЁё0-9\-_]{1,13})$/i.test( value );
            }
        }
        else {
            if ( $element.hasClass('no_idn') ) {
                return /^(([A-Za-z0-9\-_])+\.)+([A-Za-z0-9\-_]{1,13})$/i.test( value );
            }
            else {
                return /^(([A-Za-zА-Яа-яЁё0-9\-_])+\.)+([A-Za-zА-Яа-яЁё0-9\-_]{1,13})$/i.test( value );
            }
        }
    } );

    $.validator.addMethod( 'real_ip', function( value, element ) {
        if ( $( element ).optional_ok( value ) ) {
            return true;
        }

        return (
            !/^10(\.[0-9]+){3}$/i.test( value )
            && !/^172\.(1[6-9]|2[0-9]|3[01])(\.[0-9]+){2}$/i.test( value )
            && !/^192\.168(\.[0-9]+){2}$/i.test( value )
            && valid_ip( value )
        );
    } );

    $.validator.addMethod( 'valid_ip', function( value, element ) {
        var $element    = $( element ),
            ipv6_result = null;

        if ( $element.optional_ok( value ) ) {
            return true;
        }

        if ( $element.hasClass('allow_ipv6') ) {
            ipv6_result = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/i.test( value ); // eslint-disable-line max-len

            if ( ipv6_result ) {
                return true;
            }
        }

        return valid_ip( value );
    } );

    $.validator.methods.email = function( value, element ) {
        if ( !this.optional( element ) ) {
            return /^[a-zA-Zа-яА-ЯёЁ0-9_.+-]+@[a-zA-Zа-яА-ЯёЁ0-9-]+\.[a-zA-Zа-яА-ЯёЁ0-9-.]+$/.test( value );
        }
    };

    $.validator.methods.required = function( value, element, param ) {
        var $element = $( element ),
            val;

        // check if dependency is met
        if ( !this.depend( param, element ) ) {
            return 'dependency-mismatch';
        }

        if ( $element.attr('placeholder') && $element.attr('placeholder') === value ) {
            return false;
        }

        if ( element.nodeName.toLowerCase() === 'select' ) {

            // could be an array for select-multiple or a string, both are fine this way
            val = $element.val();

            return val && val.length > 0;
        }

        if ( this.checkable( element ) ) {
            return this.getLength( value, element ) > 0;
        }

        return $.trim( value ).length > 0;
    };

    $.validator.addMethod( 'required_file', function( value, element ) {
        var $element = $( element );

        if ( $element.hasClass('b-input-file__input') ) {
            return $element.MultiFile('data').files.length > 0;
        }

        return true;
    } );

    function valid_ip( value ) {
        return /^(([1-9]|[1-9][0-9]|1[0-9]{2}|2([0-4][0-9]|5[0-5]))\.)(([0-9]|[1-9][0-9]|1[0-9]{2}|2([0-4][0-9]|5[0-5]))\.){2}([0-9]|[1-9][0-9]|1[0-9]{2}|2([0-4][0-9]|5[0-5]))$/i.test( value ); // eslint-disable-line max-len
    }

    function get_highlight_element( element ) {
        var $errorElement = $( element );

        if ( $errorElement.hasClass('i-dropdown') ) {
            $errorElement = $errorElement.parent().find('div.b-dropdown');
        }



        if ( $errorElement.hasClass('b-select__manual-input') || $errorElement.hasClass('b-select__select') ) {
            $errorElement = $errorElement.closest('.b-select');
        }

        if ( $errorElement.hasClass('b-input-file__input') ) {
            $errorElement = $errorElement.MultiFile('data').block;
        }

        // wrap whole b-checkbox not only input
        if ( $errorElement.is(':checkbox') ) {
            $errorElement = $errorElement.closest('.b-checkbox');
        }

        return $errorElement;
    }

    $.validator.setDefaults( {

        // debug: [% is_production ? 'false' : 'true' %],
        errorClass     : 'glamor_error_border',
        validClass     : 'glamor_border',
        errorElement   : 'span',
        ignoreTitle    : true,
        errorPlacement : function( error, element ) {
            var $errorElement;

            if ( error ) {
                $errorElement = get_highlight_element( element );
                drawElementError( error, $errorElement );
            }

            return true;
        },
        success : function( /* element */ ) {

            // console.log(element[0].control);
            // $(element.get(0).control).nextAll('.i-validate__short-error, .i-validate__full-error').remove();
        },
        submitHandler : function( form ) {

            // [# Измененили чтобы вызывался PopupAuth %]
            $( form ).unbind('submit').submit();
        },
        highlight : function( element, errorClass ) {
            var $errorElement = get_highlight_element( element ),
                errorClassName = errorClass,
                MARGIN_TOP     = 70;

            if ( $errorElement.data('bSelect') ) {
                errorClassName = 'b-select_state_error';
            }

            $errorElement.addClass( errorClassName );

            if (
                $( '.i-validate__header-error-wrapper', $( this.currentForm ) ).length
                && !$( '.i-validate__header-error', $( this.currentForm ) ).length
            ) {
                $( '.i-validate__header-error-wrapper', $( this.currentForm ) )
                    .append(
                        '<span class="b-validate__header-error i-validate__header-error">'
                        + glamor_error_in_head_text
                        + '</span>'
                    );
            }

            if ( $errorElement.data().isInvalidScroll ) {
                $('html, body').animate( { 'scrollTop': $errorElement.offset().top - MARGIN_TOP }, 500 );

            }
        },
        unhighlight : function( element, errorClass ) {
            var $errorElement = get_highlight_element( element ),
                errorClassName = errorClass;

            if ( $errorElement.data('bSelect') ) {
                errorClassName = 'b-select_state_error';
            }

            $errorElement
                .removeClass( errorClassName )
                .nextAll('.i-validate__short-error, .i-validate__full-error')
                .remove();

            if (
                !$( '.' + errorClass, $( this.currentForm ) ).length
                && $( '.i-validate__header-error', $( this.currentForm ) ).length
            ) {
                $( '.i-validate__header-error', $( this.currentForm ) ).remove();
            }

            if ( $errorElement.hasClass('b-input-file') ) {
                $errorElement.MultiFile('data').removeError();
            }

            if ( $errorElement.data('bSelect') ) {
                $errorElement.data('bSelect').hideError();
            }
        },
    } );

    function drawElementError( error, $element ) {
        var wrapperWidth = $element.outerWidth( true ) + 1,
            $wrap,
            multifile,
            $validateFieldWrapper,
            $validateShortError;

        if ( $element.data('bSelect') ) {
            $element.data('bSelect').showError( error.text() );

            return false;
        }

        if ( $element.parent('.i-validate__field-wrapper').length ) {
            if (
                $element.parent('.i-validate__field-wrapper').find('.i-validate__short-error').text() == error.text()
            ) {
                return false;
            }
        }
        else {
            $element.parent().find('.i-validate__field-wrapper:empty').remove();

            try {
                $wrap = $('<span class="b-validate__field-wrapper i-validate__field-wrapper"></span>');

                if ( !$element.hasClass('b-input-file') ) {
                    $wrap.width( wrapperWidth );
                }

                $element.wrap( $wrap );
            }
            catch ( e ) {
                if ( window.console ) {
                    console.warn( e.message );
                }
            }
        }

        $element
            .closest('.i-validate__field-wrapper')
            .find('.i-validate__short-error, .i-validate__full-error')
            .remove();

        if ( error ) {

            $( error ).addClass('b-validate__short-error i-validate__short-error');

            // хак для b-input-file

            if ( $element.hasClass('b-input-file') ) {
                multifile = $element.MultiFile('data');
                $element.removeClass('glamor_error_border');
                multifile.removeError();
                multifile.showError( error.text() );
            }
            else {
                $( error ).insertAfter( $element );
            }

            $validateFieldWrapper = $element.parent('.i-validate__field-wrapper');
            $validateShortError = $( '.i-validate__short-error', $validateFieldWrapper );

            $validateShortError.css( { top: $element.outerHeight() } );

            if ( checkErrorTextLength( $validateFieldWrapper, $validateShortError ) ) {
                $validateShortError
                    .width( $element.outerWidth() )
                    .addClass('b-validate__short-error_state_preview')
                    .append('<span class="b-validate__expand-error i-validate__expand-error"></span>')
                    .after(
                        '<span class="b-validate__full-error i-validate__full-error">'
                        + error.text()
                        + '<span class="b-validate__collapse-error i-validate__collapse-error"></span></span>'
                    );

                $( '.i-validate__full-error', $validateFieldWrapper )
                    .css( { paddingTop: $element.outerHeight() + 10 } );

                bindErrorMethods( $validateFieldWrapper, $element );
            }
        }

    }

    function bindErrorMethods( $validateFieldWrapper, $element ) {
        var focusEvent = 0;

        $validateFieldWrapper.on( 'click', '.i-validate__expand-error', function() {
            showErrorWrapper( $validateFieldWrapper );
            $element.focus();
        } );

        $validateFieldWrapper.on( 'click', '.i-validate__collapse-error', function() {
            hideErrorWrapper( $validateFieldWrapper );
        } );

        $element.on( 'click focus', function() {
            focusEvent     = 1;

            showErrorWrapper( $validateFieldWrapper );

            $( this ).off('blur mouseout').on( 'blur', function() {
                hideErrorWrapper( $validateFieldWrapper );
                focusEvent = 0;
            } );
        } ).on( 'mouseover', function() {
            if ( focusEvent ) {
                return false;
            }

            showErrorWrapper( $validateFieldWrapper );

            $( this ).off('blur mouseout').on( 'mouseout', function() {
                hideErrorWrapper( $validateFieldWrapper );
            } );
        } );

        $element.is(':focus') ? showErrorWrapper( $validateFieldWrapper ) : hideErrorWrapper( $validateFieldWrapper );
    }

    function showErrorWrapper( $validateFieldWrapper ) {
        $validateFieldWrapper.css( 'zIndex', 100 );
        $( '.i-validate__full-error', $validateFieldWrapper ).show();
    }

    function hideErrorWrapper( $validateFieldWrapper ) {
        $validateFieldWrapper.css( 'zIndex', 1 );
        $( '.i-validate__full-error', $validateFieldWrapper ).hide();
    }

    function checkErrorTextLength( $validateFieldWrapper, $validateShortError ) {
        return ( $validateShortError.width() > $validateFieldWrapper.width() );
    }

    // Форма была обработана, возможны ошибки сгенерированные в контроллере, отображаем, если есть
    if ( Site.ValidationErrors ) {
        error_length = errorFields.length;

        if (
            error_length
            && $('.i-validate__header-error-wrapper').length
            && !$('.i-validate__header-error').length
        ) {
            $('.i-validate__header-error-wrapper')
                .append(
                    '<span class="b-validate__header-error i-validate__header-error">'
                    + glamor_error_in_head_text
                    + '</span>'
                );
        }

        for ( i = 0; i < error_length; i++ ) {
            $( errorFields[i].id ).addClass('glamor_error_border');
            drawElementError( $( '<span>' + errorFields[i].text + '</span>' ), $( errorFields[i].id ) );
        }
    }

    $('.i-validate_init_default').each( function() {
        $( this ).validate();
    } );
} );
