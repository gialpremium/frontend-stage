require('jquery-tools/src/validator/validator.js');

$( function() {
    $.tools.validator.localize( 'en', {
        ':email'     : 'Please pass correct e-mail',
        ':number'    : 'Please pass correct number',
        '[max]'      : 'Please enter a number less than $1',
        '[min]'      : 'Please, enter a number more than $1',
        '[required]' : 'Kent&auml;n arvo on annettava',
        '[pattern]'  : 'Please correct this value',
    } );
    $.tools.validator.localize( 'ru', {
        ':email'     : 'Пожалуйста, введите правильный e-mail адре',
        ':number'    : 'Пожалуйста, введите правильное число',
        '[max]'      : 'Пожалуйста, введите число, не превышающее $1',
        '[min]'      : 'Пожалуйста, введите число, превышающее $1',
        '[required]' : 'Не заполнено обязательное поле',
        '[pattern]'  : 'Пожалуйста, исправьте значение',
    } );

    $.extend( $.tools.validator.conf, {
        errorClass      : 'b-input-error',
        inputEvent      : 'keyup change input',
        errorInputEvent : 'keyup change input',
        lang            : ru ? 'ru' : 'en',
        messageClass    : 'b-input-error__hint',
        position        : 'bottom left',
        offset          : [5, 0],
    } );
} );
