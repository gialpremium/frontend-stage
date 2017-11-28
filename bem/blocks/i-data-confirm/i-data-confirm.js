
( function() {

    /**
     * Показывает нативный confirm-диалог юзеру и возвращает его результат.
     * @param  {Object} $this Элемент, при клике на который попадаем в текущий обработчик
     * @param  {Object} e     Событие
     * @return {Boolean} Результат confirm, либо предопределенное bool значение
     */
    window.confirmDialog = function( $this, e ) {
        var msg;

        if ( !e.originalEvent || e.originalEvent.__confirmDialog ) {

            // do not show twice, other handlers get false
            return true;
        }

        if ( $this.hasClass('i-data-confirm') || $this.data('confirm-message') ) {
            msg = ( $this.data('confirm-message') || '' ).replace( /\\n/g,'\n' );

            e.originalEvent.__confirmDialog = true;

            return confirm( msg );
        }

        return true;
    };

    /**
     * Показывает кастомный confirm-диалог. Возвращает Promise.
     * @param  {Object} $this Элемент при клике на который был вызван этот обработчик
     * @param  {Object} e     Объект события
     * @return {Object} Promise-объект
     */
    window.confirmDialogPromise = function( $this, e ) {
        var deferred = $.Deferred(),
            msg = ( $this.data('confirm-message') || '' ).replace( /\\n/g,'\n' );

        if ( !e.originalEvent || e.originalEvent.__confirmDialog ) {
            deferred.reject();

            return deferred.promise();
        }

        if ( $this.hasClass('i-data-confirm') || $this.data('confirm-message') ) {
            e.originalEvent.__confirmDialog = true;

            glamor_confirm( msg, {
                ok : function() {
                    deferred.resolve();
                    this.close();
                },
                cancel : function() {
                    deferred.reject();
                    this.close();
                },
            }, t('common.attention') );
        }
        else {
            deferred.resolve();
        }

        return deferred.promise();
    };


    $('form.i-data-confirm').on( 'submit', function( e ) {
        if ( confirmDialog( $( this ), e ) ) {
            return true;
        }

        return false;
    } );

    $('[type="submit"].i-data-confirm').on( 'click', function( e ) {
        if ( confirmDialog( $( this ), e ) ) {
            return true;
        }
        e.preventDefault();

        return false;
    } );

} )();
