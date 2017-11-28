$( function() {
    if ( $('.b-switcher').length ) {
        $('.b-switcher').not('.b-switcher_js_no').each( function() {
            var _this = this;

            _this.switchOn = function() {
                $( this )
                    .find('.b-switcher__checkbox')
                    .prop( 'checked', true )
                    .end()
                    .find('.b-switcher__button')
                    .removeClass('b-switcher__button_action_on')
                    .addClass('b-switcher__button_action_off')
                    .attr( 'title', ru ? 'Выключить' : 'Switch off' );
            };

            _this.switchOff = function() {
                $( this )
                    .find('.b-switcher__checkbox')
                    .removeProp('checked')
                    .end()
                    .find('.b-switcher__button')
                    .removeClass('b-switcher__button_action_off')
                    .addClass('b-switcher__button_action_on')
                    .attr( 'title', ru ? 'Включить' : 'Switch on' );
            };

            $( _this )
                .add( $( 'label[for=' + $( '.b-switcher__checkbox', $( _this ) ).attr('id') + ']' ) )
                .click( function() {
                    $( '.b-switcher__checkbox', $( _this ) ).prop('checked') ? _this.switchOff() : _this.switchOn();

                    return false;
                } );

            // init switchers state
            $( '.b-switcher__checkbox', $( _this ) ).prop('checked') ? _this.switchOn() : _this.switchOff();
        } );
    }

    // групповой переключатель для i-switcher
    if ( $('.b-switcher__group-checkbox').length ) {
        $('.b-switcher__group-checkbox').each( function() {
            var $groupCheckbox = $( this ),
                $switchers = $groupCheckbox.closest('.b-switcher__group-wrapper').find('.b-switcher');

            $groupCheckbox.change( function() {
                var $this = $( this ).removeClass('b-switcher__group-checkbox_state_not-full');

                if ( !$this.prop('checked') ) {
                    $switchers.each( function() {
                        var $this = this;

                        ( function( $this ) {
                            setTimeout( function() {
                                $this.switchOff();
                            },0 );
                        }( $this ) );
                    } );
                }
                else {
                    $switchers.each( function() {
                        var $this = this;

                        ( function( $this ) {
                            setTimeout( function() {
                                $this.switchOn();
                            },0 );
                        }( $this ) );
                    } );
                }
            } );
            $switchers.click( function() {
                checkGroupCheckbox( $( this ) );
            } );

            // init group checkboxes state
            checkGroupCheckbox( $( this ) );

            function checkGroupCheckbox( $this ) {
                var $cb_list = $this.closest('.b-switcher__group-wrapper').find('.b-switcher__checkbox'),
                    $groupCheckbox = $this.hasClass('b-switcher__group-checkbox')
                        ? $this
                        : $this.closest('.b-switcher__group-wrapper').find('.b-switcher__group-checkbox');

                if ( $cb_list.length == $cb_list.filter(':checked').length ) {
                    $groupCheckbox
                        .removeClass('b-switcher__group-checkbox_state_not-full')
                        .prop( 'checked', true );
                }
                else if ( $cb_list.filter(':checked').length === 0 ) {
                    $groupCheckbox.removeClass('b-switcher__group-checkbox_state_not-full').removeProp('checked');
                }
                else {
                    $groupCheckbox.addClass('b-switcher__group-checkbox_state_not-full').prop( 'checked', true );
                }
            }
        } );
    }
} );
