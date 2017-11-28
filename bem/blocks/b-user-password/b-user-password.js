$( function() {

    var pass_meter = new window.PassMeter(
        '#change-password-new',
        '#newpass',
        {
            ru              : ru,
            on_real_submit  : function() {},
            status_callback : function( status ) {
                var $submitBtn = $('#newpass button[type=submit]');

                if ( status ) {
                    $submitBtn.removeProp('disabled');
                }
                else {
                    $submitBtn.prop( 'disabled', true );
                }
            },
        }
    );

    function validateNewPassword() {
        Site.App.Validator.Inline.create(
            '.b-user-password__form',
            '.b-user-password__wrap-new-pwd',
            Site.App.Validator.Rules.password
        );
    }

    pass_meter
        .attach_checkup()
        .refresh();

    validateNewPassword();

    $('.b-passmeter_type_popover').addClass('b-user-password__popover');
} );
