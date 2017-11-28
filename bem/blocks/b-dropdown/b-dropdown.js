( function( $ ) {

    var MAX_ELEM_COUNT = 7,
        methods = {
            add : function( o ) {
                var ddObj = $( this ).data('idropdown'),
                    select = ddObj.$select.get( 0 ),
                    $dd = ddObj.$dd,
                    data = $.extend( o.data, { value: o.value } ),
                    $newDdItem = $('<li class="b-dropdown__list-item"></li>').html( o.text ).data( data ),
                    newOption = document.createElement('option'),
                    optionPosition = o.position === 0 ? 0 : o.position || -1;

                // fill new option
                newOption.text = o.text;
                newOption.value = o.value;
                newOption.data = o.data;

                if ( o.disabled ) {
                    $newDdItem.addClass('b-dropdown__list-item_state_disabled');
                    newOption.disabled = 'disabled';
                }

                // add to dropdown new option
                if ( optionPosition < 0 ) {
                    $( '.b-dropdown__list', $dd )
                        .children('.b-dropdown__list-item')
                        .eq( optionPosition )
                        .after( $newDdItem );

                    try {
                        select.add( newOption, select.options[null] );
                    }
                    catch ( e ) {
                        select.add( newOption );
                    }
                }
                else {
                    $( '.b-dropdown__list', $dd )
                        .children('.b-dropdown__list-item')
                        .eq( optionPosition )
                        .before( $newDdItem );

                    try {
                        select.add( newOption, select.options[optionPosition] );
                    }
                    catch ( e ) {
                        select.add( newOption );
                    }
                }

                // selected if need
                if ( o.selected && !o.disabled ) {
                    $( select ).iDropdown( 'selected', { value: o.value } );
                }
            },
            change : function( pos, o ) {
                var ddObj = $( this ).data('idropdown'),
                    select = ddObj.$select.get( 0 ),
                    currentOption = select.options[pos],
                    $currentOption = $( currentOption ),
                    $dd = ddObj.$dd,
                    $currentDdOption = getCurrenListItem(
                        $( '.b-dropdown__list', $dd )
                            .children('.b-dropdown__list-item')
                            .eq( pos ),
                        currentOption.value
                    ),
                    options,
                    data;

                options = $.extend( {
                    data     : $currentOption.data(),
                    text     : getDdOptionHtml( $currentOption ),
                    value    : currentOption.value,
                    disabled : currentOption.disabled,
                }, o );

                data = $.extend( options.data || {}, { value: options.value } );

                $currentDdOption.html( options.text ).data( data );
                currentOption.text = options.text;
                currentOption.value = options.value;
                currentOption.data = options.data;

                if ( options.disabled ) {
                    $currentDdOption.addClass('b-dropdown__list-item_state_disabled');
                    currentOption.disabled = 'disabled';
                }
                else {
                    $currentDdOption.removeClass('b-dropdown__list-item_state_disabled');
                    currentOption.disabled = false;
                }

                // selected if need
                if ( options.selected && !options.disabled ) {
                    $( select ).iDropdown( 'selected', { position: pos } );
                }
            },
            remove : function( pos ) {
                var ddObj = $( this ).data('idropdown'),
                    select = ddObj.$select.get( 0 ),
                    currentOption = select.options[pos],
                    $dd = ddObj.$dd,
                    $currentDdOption = getCurrenListItem(
                        $( '.b-dropdown__list', $dd ).children('.b-dropdown__list-item').eq( pos ),
                        currentOption.value
                    );

                $currentDdOption.remove();
                select.remove( pos );
                $( select ).iDropdown( 'selected', { position: 0 } );
            },
            selected : function( o ) { // TODO disabled
                var ddObj = $( this ).data('idropdown'),
                    select = ddObj.$select.get( 0 );

                if ( typeof o.value !== 'undefined' ) {
                    $( select ).val( o.value ).change();
                }
                else if ( typeof o.position !== 'undefined' ) {
                    $( select ).val( select.options[o.position].value ).change();
                }
            },
            rebuild : function() {
                var ddObj = $( this ).data('idropdown'),
                    $dd = ddObj.$dd;

                $dd.remove();

                $( this ).removeData('idropdown')
                    .removeClass('b-dropdown_visibility_hidden');

                ddObj.$select.iDropdown();
            },
            disable : function() {
                $( this ).each( function() {
                    var ddObj = $( this ).data('idropdown');

                    ddObj.$select.attr( 'disabled', 'disabled' );
                    ddObj.$dd.addClass('b-dropdown_state_disabled');
                } );
            },
            enable : function() {
                $( this ).each( function() {
                    var ddObj = $( this ).data('idropdown');

                    ddObj.$select.removeAttr('disabled');
                    ddObj.$dd.removeClass('b-dropdown_state_disabled');
                } );
            },
        };

    // класс дропдауна
    function Dropdown( ddObj ) {
        var self = this;

        $.extend( this, ddObj );
        this.$ddList = $( '.b-dropdown__list-wrapper', self.$dd );
        this.$ddCurrent = $( '.b-dropdown__current-text', self.$dd );

        this.init = function() {
            var $dd = self.$dd,
                $select = self.$select,
                ddListW = self.ddListWidth;

            if ( $( 'option', $select ).length > MAX_ELEM_COUNT ) {
                ddListW = ddListW + $.getScrollbarWidth();
            }

            $dd.width( ddListW );
            $select.data( 'idropdown', self ).before( $dd ).addClass('b-dropdown_visibility_hidden');

            if ( self.isHidden ) {
                $dd.hide();
            }

            if ( $select.attr('disabled') ) {
                $dd.addClass('b-dropdown_state_disabled');
            }

            if ( $dd.width() < ddListW ) {
                self.$ddList.width( ddListW );
            }

            $dd.on( 'click.dropdown', function( e ) {
                self.openDropdown.apply( this, [e] );

                return false;
            } );
            $dd.on( 'click.dropdown', '.b-dropdown__list-item', function( e ) {
                if ( !$( this ).hasClass('b-dropdown__list-item_state_disabled') ) {
                    self.selectItem.apply( this, [e] );
                }

                return false;
            } );
            $select.on( 'change.dropdown', function( e ) {
                if ( $select.attr('disabled') ) {
                    $dd.addClass('b-dropdown_state_disabled');
                }
                else {
                    $dd.removeClass('b-dropdown_state_disabled');
                }
                self.onChange.apply( this, [e] );
            } );
            $select.on( 'focus.dropdown', function( e ) {
                self.openDropdown.apply( $dd, [e] );
            } );
        };

        this.openDropdown = function( e ) {
            var $this = $( this );

            if ( $this.hasClass('b-dropdown_state_disabled') ) {
                return false;
            }

            self.$ddList.css( { top: $this.outerHeight() } ).hooc( 'toggle', function() {
                $this.closest('.b-dropdown').css( 'zIndex', 1 );
            }, e );
            $this.css( 'zIndex', self.$ddList.is(':visible') ? '11' : '1' );
        };

        this.onChange = function( e ) {
            var $option = $( ':selected', $( this ) );

            self.$ddCurrent.html( getDdOptionHtml( $option ) );
            self.$ddList.hooc( 'hide', e );
            self.$dd.css( 'zIndex', '1' );
        };

        this.selectItem = function() {
            self.$select.val( $( this ).data('value') ).change();
        };

        return this;
    }

    function getCurrenListItem( $ddItem, selectValue ) {
        if ( $ddItem.data('value') === selectValue ) {
            return $ddItem;
        }
        else {
            return $ddItem.siblings().filter( function() {
                return $( this ).data('value') === selectValue;
            } );
        }
    }

    function getDdOptionHtml( $option ) {
        var data = $option.data();

        if ( data && data.source ) {
            return data.source;
        }
        else {
            return $option.html();
        }
    }

    $.fn.iDropdown = function( method ) {
        var selectsArray = [],
            selectsSize;

        if ( methods[method] && $( this ).data('idropdown') ) {
            methods[method].apply( this, [].slice.call( arguments, 1 ) );
        }
        else if ( typeof method === 'object' || !method ) {

            this.each( function() {
                if ( $( this ).is('select') && $( 'option', $( this ) ).length ) {
                    selectsArray.push( {
                        $select     : $( this ),
                        isHidden    : $( this ).css('display') === 'none' ? 1 : 0,
                        ddListWidth : 0,
                        html        : '',
                        extClass    : $( this ).attr('class').replace( 'i-dropdown', '' ),
                    } );
                }
            } );

            selectsSize = selectsArray.length;
            calculateDdWidth( selectsArray, selectsSize );

            if ( selectsSize < 50 ) {
                while ( selectsSize-- ) {
                    buildDd( selectsArray[selectsSize] );
                }
            }
            else {
                while ( selectsSize-- ) {
                    ( function( selectsSize ) {
                        setTimeout( function() {
                            buildDd( selectsArray[selectsSize] );
                        },0 );
                    }( selectsSize ) );
                }
            }
        }

        return this;

        function calculateDdWidth( arr, size ) {
            var $test_wrapper = $('<div class="b-dropdown__test-wrapper"></div>'),
                test_array = [],
                iterations = size,
                i;

            for ( i = 0; i < iterations; i++ ) {
                arr[i].$dd = makeDropdownHtml( arr[i] );
                $test_wrapper.append( arr[i].$dd.clone() );
            }

            $('body').append( $test_wrapper );
            test_array = $.makeArray( $( '.b-dropdown', '.b-dropdown__test-wrapper' ) );

            while ( iterations-- ) {
                arr[iterations].ddListWidth = parseInt(
                    $( test_array[iterations] ).find('.b-dropdown__list-wrapper').width(),
                    10
                );
            }

            $test_wrapper.remove();
            test_array.length = 0;
        }

        function makeDropdownHtml( ddObj ) {
            var currentHtml,
                $dd = $('<div class="b-dropdown"></div>').addClass( ddObj.extClass ),
                $ddCurrent = $('<div class="b-dropdown__current"><span class="b-dropdown__current-button"></span><div class="b-dropdown__current-text"></div></div>'), // eslint-disable-line max-len
                $ddList = $('<div class="b-dropdown__list-wrapper"><ul class="b-dropdown__list"></ul></div>'),
                $selected = ddObj.$select.find('[selected]');

            $dd.attr( 'data-name', ddObj.$select.attr('name') );

            if ( !$selected.length ) {
                $selected = ddObj.$select.find('option:eq(0)');
            }

            if ( ddObj.$select.attr('disabled') ) {
                $dd.addClass('b-dropdown_state_disabled');
            }

            $( 'option', ddObj.$select ).each( function() {
                var data = $.extend( $( this ).data(), { value: $( this ).attr('value') } ),
                    cl = 'b-dropdown__list-item';

                if ( $( this ).attr('disabled') ) {
                    cl += ' b-dropdown__list-item_state_disabled';
                }

                if ( $( this ).attr('class') ) {
                    cl += ( ' ' + $( this ).attr('class') );
                }

                $( '<li class="' + cl + '"></li>' ).html( getDdOptionHtml( $( this ) ) )
                    .data( data )
                    .appendTo( $( '.b-dropdown__list', $ddList ) );
            } );


            currentHtml = getDdOptionHtml( $selected );

            $( '.b-dropdown__current-text', $ddCurrent ).html( currentHtml );
            $dd.append( $ddCurrent, $ddList );

            return $dd;
        }

        function buildDd( selectObj ) {
            var dd = new Dropdown( selectObj );

            dd.init();
        }
    };

    // init
    $( function() {
        $('.i-dropdown').iDropdown();
    } );
} )( jQuery );
