Site.App.Models.FormHeader = Backbone.Model.extend( {
    defaults : {
        query  : '',
        action : 'check',
    },
    initialize : function() {
        this.on( 'invalid', this.showError, this );
    },
    validate : function( attrs ) {
        if ( !attrs.query && attrs.action != 'whois' ) {
            return 'не заполнено поле!';
        }
        else {
            return '';
        }
    },
    showError : function( /* model, error */ ) {

        // console.log(model, error);
    },
} );

Site.App.Views.FormHeader = Backbone.View.extend( {
    initialize : function() {},
    events     : {
        'click button[name = check]' : 'actionCheck',
        'click button[name = whois]' : 'actionWhois',
    },
    actionCheck : function( e ) {
        this.model.set( 'action', 'check' );
        this.updateQuery().submitForm( e );
    },
    actionWhois : function( e ) {
        this.model.set( 'action', 'whois' );
        this.$el.append('<input type="hidden" name="whois" value="1" />');
        this.updateQuery().submitForm( e );
    },
    updateQuery : function() {
        var newQuery = this.$('input[name = query]').val();

        this.model.set( 'query', newQuery, { validate: true } );

        return this;
    },
    submitForm : function( e ) {
        if ( this.model.get('action') == 'whois' && !this.model.get('query') ) {
            e.preventDefault();
            document.location = REGRU.site_url_prefix_main + '/whois/';
        }

        if ( this.model.get('action') == 'check' && !this.model.get('query') ) {
            e.preventDefault();
            document.location = REGRU.site_url_prefix_main + '/domain/new/';
        }
    },
} );

$( function() {

    // форма поиска в шапке
    var formHeader = new Site.App.Models.FormHeader();

    new Site.App.Views.FormHeader( { // eslint-disable-line no-new
        el    : '.b-header__form .b-form-compact',
        model : formHeader,
    } );

    new Site.App.Views.FormHeader( { // eslint-disable-line no-new
        el    : '.b-menu__form .b-form-compact',
        model : formHeader,
    } );

    $('.b-header__popup-trigger').each( function() {
        var $trigger   = $( this ),
            popupClass = $trigger.data('popup'),
            $popup     = $( popupClass );

        if ( Site.App.isMobileDevice ) {
            $trigger.children('.tooltip').addClass('no-tooltip');
        }

        $popup.hooc( 'set', {
            show : function() {
                var $actualTrigger  = $( '.b-header__popup-trigger[data-popup="' + popupClass + '"]:visible' ),
                    $query          = $popup.find('.b-form-compact__query');

                $popup.show().css( {
                    left : $actualTrigger.offset().left + $actualTrigger.outerWidth() - $popup.outerWidth(),
                    top  : $actualTrigger.offset().top + $actualTrigger.outerHeight() + 5,
                } );

                if ( !$actualTrigger.hasClass('l-hidden@desktop') ) {

                // дважды меняем значение чтобы курсор был после последнего символа в инпуте
                    $query
                        .focus()
                        .val('')
                        .val( $query.val() );
                }

                $('.b-menu').removeClass('b-menu_status_visible');
            }, 
        } );

    } ).on( 'click', function( e ) {
        var $trigger = $( this ),
            $popup   = $( $trigger.data('popup') );

        // клик по вложеной ссылке
        if ( e.target.tagName.toLowerCase() === 'a' ) {
            return true;
        }

        // toggle не подходит
        $popup.hooc( $popup.is(':visible') ? 'hide' : 'show', e );

        return false;
    } );

    $( window ).resize(
        _.throttle( function() {
            $('.b-header__popup.i-hooc__popup_visible_true').hooc('show');

            $('.b-header__popup')
                .toggleClass( 'b-header__popup_is_mobile', Site.App.isAdaptivePage );

        }, 200, { leading: false } ) // eslint-disable-line no-magic-numbers
    );

} );
