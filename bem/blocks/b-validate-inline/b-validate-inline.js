/**
 * Глобальная область видимости window
 * @module window
 */

/**
 * Пространство имен для размещения валидаторов
 * @submodule Site.App.Validator
 */

Site.namespace('Site.App.Validator.Inline');

( function() {

    /**
     * Пометит поле формы как (не)валидное
     * @method handleFormFieldState
     * @for InlineValidator
     * @private
     * @static
     * @param  {String} wrapperSelector Селектор обертки поля, с которым работаем
     * @param  {Object} $error     jQuery-объект ошибки
     * @param  {Object} $element   jQuery-объект поля
     */
    function handleFormFieldState( wrapperSelector, $error, $element ) {
        var wrapperFieldSelector = wrapperSelector,
            inlineValidatorSelector = '.b-validate-inline',
            inlineValidatorOkClass = 'b-validate-inline_status_ok',
            inlineValidatorErrorClass = 'b-validate-inline_status_error',
            showErrorCondition = $error.html().length;

        $element.removeClass('glamor_error_border');
        if ( showErrorCondition ) {
            $element.closest( wrapperFieldSelector )
                .find( inlineValidatorSelector )
                .addClass( inlineValidatorErrorClass )
                .removeClass( inlineValidatorOkClass );
        }
        else {
            $element.closest( wrapperFieldSelector )
                .find( inlineValidatorSelector )
                .removeClass( inlineValidatorErrorClass )
                .addClass( inlineValidatorOkClass );
        }
    }

    /**
     * Создаст иконку валидатора для поля, если ее еще нет.
     */
    function createInlineIcon( wrapperSelector, customClass ) {
        var $icon = $( wrapperSelector + ' .b-validate-inline' );

        if ( !$icon.length ) {
            $( wrapperSelector ).append(
                $( '<div>', { class: 'b-validate-inline' } ).addClass( customClass )
            );
        }
    }

    Site.App.Validator.Inline = {
        create : function( formSelector, wrapperSelector, rules, customClass ) {
            var $form = $( formSelector );

            createInlineIcon( wrapperSelector, customClass );
            $form.validate( {
                ignore   : [],
                rules    : rules,
                onsubmit : false,
                onkeyup  : function() {
                    $form.valid();
                },
                errorPlacement : function( $error, $element ) {
                    handleFormFieldState( wrapperSelector, $error, $element );
                },
                invalidHandler : function( e ) {
                    e.preventDefault(); e.stopPropagation();

                    return false;
                },
            } );
        }, 
    };

} )();
