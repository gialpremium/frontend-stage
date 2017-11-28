//
// мерялка надёжности пароля
//
// FIXME: невозможно сделать два инстанса этого объекта :(
//
window.PassMeter = ( function() {
    var PassMeter = function( elem, form, options ) {
        this.elem                   = elem; // id элемента
        this.form                   = form; // id формы
        this.$elem                  = $( elem ); // элемент формы
        this.$form                  = $( form ); // форма
        this.$body                  = $('body'); // документ
        this.password_check_status  = true; // статус проверки сложности
        this.$unmet                 = ''; // строка подсказки о длине и надёжности
        this.popup_template         = require('b-passmeter/passmeter.jade')(); // шаблон содержимого поповера
        this.$popup                 = $( this.popup_template ); // Содержимое поповера

        // имя класса для сокрытия надписи
        this.hideClass              = 'pass-meter-unmet-len_visibility_hidden';

        // флаг ипользования русского языка
        this.ru                     = options.ru;

        /* eslint-disable no-magic-numbers */
        // XXX
        // значения переменных должны быть согласованы со значениями
        // SRS::User::password_complex() и её вызовом из SRS::User::password_correct()
        this.password_min_length    = options.password_min_length || 6; // минимальная длина пароля
        this.password_scale_factor  = options.password_scale_factor || 0.8; // фактор сложности
        this.password_min_level     = options.password_min_level || 20; // минимальная сложность
        this.password_max_level     = options.password_max_level || 150; // максимальная сложность

        /* eslint-enable no-magic-numbers */

        // Пользовательский метод для получения статуса проверки
        this.status_callback        = options.status_callback || function() {};

        this.$popup.insertAfter( this.$elem );

        // стандартный обработчик
        this.submit_handler = function( ev ) {
            ev.preventDefault();

            return false;
        };

        // обработчики
        this.real_submit            = options.on_real_submit || this.submit_handler;
        this.fake_submit            = options.on_fake_submit || this.submit_handler;

        // поповер
        this.popover_level_desc = [
            t('passmeter.weak'),
            t('passmeter.average'),
            t('passmeter.strong'),
            t('passmeter.very_strong'),
        ];
        this.popover_unmet_length = [
            t('passmeter.minimum_of'),
            this.password_min_length,
            t('passmeter.characters_at_least'),
            this.password_min_level,
        ].join(' ') + t('passmeter.in_complexity');
        this.popover_title = t('passmeter.password_strength');
        this.popover_complexity = t('passmeter.complexity');
    };

    PassMeter.prototype = {

        constructor : PassMeter,

        // создание окошка и добавление проверки надёжности для поля
        attach_checkup : function() {
            this.$popup.find('.b-passmeter__title').html( this.popover_title );

            // хинт о длине пароля
            this.$unmet = this.$popup.find('.pass-meter-unmet-len').html( this.popover_unmet_length );

            this.$elem.complexify(
                {
                    strengthScaleFactor : this.password_scale_factor,
                    minimumChars        : this.password_min_length,
                    minComplexity       : this.password_min_level,
                    maxComplexity       : this.password_max_level,
                },
                _.bind( this.check_cb, this )
            );

            // запрет или разрешение отправки формы
            this.grant_submit( this.password_check_status );

            return this;
        },

        // колбэк проверки надёжности пароля
        check_cb : function( resp ) {
            this.password_check_status = resp.Status;

            // обновляем информацию надёжности пароля
            this.$popup.find('.pass-meter-status')
                .text(
                    this.popover_level_desc[resp.Grade.Level]
                    + ' (' + this.popover_complexity + ' ' + Math.round( resp.Grade.Complexity )
                    + '%)'
                );

            resp.Trigger.Length || resp.Trigger.Complexity
                ? this.$unmet.removeClass( this.hideClass )
                : this.$unmet.addClass( this.hideClass );

            this.$popup.find('.pass-meter-bar')
                .css( { 'width': resp.Grade.Complexity + '%' } )
                .removeClass()
                .addClass( 'pass-meter-bar pass-meter-lvl' + resp.Grade.Level );

            // запрет или разрешение отправки формы
            this.grant_submit( resp.Status );

            return this;
        },

        // запрет или разрешение отправки формы в зависимости от статуса проверки пароля
        grant_submit : function( is_allowed ) {

            // // изменение вида кнопки "продолжить"
            // is_allowed
            //     ? this.$form.find('.button-green-forward[type=submit]').removeAttr('disabled')
            //     : this.$form.find('.button-green-forward[type=submit]').attr( 'disabled', 'disabled' );

            // Сообщаем подписчику о статусе пароля
            this.status_callback( is_allowed );

            this.$form
                .off('submit')
                .on( 'submit', is_allowed ? this.real_submit : this.fake_submit );

            return this;
        },

        // установка реального обработчика отправки формы
        set_real_submit : function( func ) {
            this.real_submit = func;

            return this;
        },

        // проверка данных в поле пароля
        refresh : function() {
            this.$elem.trigger('keyup');

            return this;
        },
    };

    return PassMeter;

} )();
