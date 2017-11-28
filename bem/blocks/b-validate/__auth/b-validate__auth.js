
/**
 * Глобальная область видимости window
 * @module window
 */


var emailRegexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    loginRegexp = /^[a-zA-Z0-9_.-]+$/;

jQuery.validator.addMethod( 'reg_valid_email', function( value ) {
    return emailRegexp.test( value );
}, t('authorize.auth.uncorrect_email') );

jQuery.validator.addMethod( 'auth_valid_email_login', function( value ) {
    return emailRegexp.test( value ) || loginRegexp.test( value );
}, t('authorize.auth.uncorrect_email_or_login') );

jQuery.validator.addMethod( 'auth_valid_login', function( value ) {
    return loginRegexp.test( value );
}, t('authorize.auth.uncorrect_login') );

jQuery.validator.addMethod( 'password_length', function( value ) {

    /* eslint-disable no-magic-numbers */
    return 6 <= value.length && value.length <= 32;

    /* eslint-enable no-magic-numbers */
}, t('authorize.auth.uncorrect_login') );


Site.namespace('Site.App.Validator.Rules');

/**
 * Объект содержит методы, которые возвращают сгруппированые правила валидации
 * @submodule Site.App.Validator.Rules
 */
Site.App.Validator.Rules = {

    /**
     * @type {Object} Объект с правилами валидации для поля пароля
     */
    password : {
        password : {
            required        : true,
            password_length : true,
        }, 
    },

    /**
     * @type {Object} Объект с правилами валидации для формы авторизации/привязки соц.сети
     */
    authorizeForm : {
        login : {
            required               : true,
            auth_valid_email_login : true,
        },
        password : { required: true },
    },

    /**
     * @type {Object} Объект с правилами валидации для формы восстановления пароля
     */
    forgotPasswordForm : {
        email : {
            required               : true,
            auth_valid_email_login : true,
        }, 
    },

    /**
     * @type {Object} Объект с правилами валидации для формы регистрации
     */
    registrationForm : {
        email : {
            required        : true,
            reg_valid_email : true,
        }, 
    },

};
