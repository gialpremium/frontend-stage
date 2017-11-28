require('jquery.ui/ui/datepicker.js');

( function( $ ) {

    if ( typeof $.datepicker != 'undefined' ) {
        $.datepicker.regional.ru = {
            closeText   : 'Закрыть',
            prevText    : '&#x3c;Пред',
            nextText    : 'След&#x3e;',
            currentText : 'Сегодня',
            monthNames  : [
                'Январь','Февраль','Март','Апрель',
                'Май','Июнь', 'Июль','Август',
                'Сентябрь','Октябрь','Ноябрь','Декабрь',
            ],
            monthNamesShort : ['Янв','Фев','Мар','Апр','Май','Июн', 'Июл','Авг','Сен','Окт','Ноя','Дек'],
            dayNames        : ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
            dayNamesShort   : ['вск','пнд','втр','срд','чтв','птн','сбт'],
            dayNamesMin     : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            dateFormat      : 'dd.mm.yy',
            firstDay        : 1,
            isRTL           : false,
            buttonText      : 'Календарь',// alt
        };
        $.datepicker.regional.en = {
            closeText   : 'Close',
            prevText    : '&#x3c;Prev',
            nextText    : 'Next&#x3e;',
            currentText : 'Today',
            monthNames  : [
                'January','February','March','April',
                'May','June', 'July','August',
                'September','October','November','December',
            ],
            monthNamesShort : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin     : ['Su','Mo','Tu','We','Th','Fr','Sa'],
            dateFormat      : 'yy-mm-dd',
            isRTL           : false,
            buttonText      : 'Calendar',// alt
        };

        $.datepicker.setDefaults( $.datepicker.regional[ru ? 'ru' : 'en'] );

        $.datepicker.setDefaults( {

            // разобраться чо из настроек надо + buttonImage
            showAnim        : 'fadeIn',
            showButtonPanel : true,
            showOn          : 'both',
            dateFormat      : 'dd.mm.yy',
            buttonImageOnly : true,
            buttonImage     : '/i/crud/cal.png',
        } );
    }

    if ( typeof $.timepicker != 'undefined' ) {
        $.timepicker.regional['ru'] = {
            timeOnlyTitle : 'Выберите время',
            timeText      : 'Время',
            hourText      : 'Часы',
            minuteText    : 'Минуты',
            secondText    : 'Секунды',
            millisecText  : 'Миллисекунды',
            timezoneText  : 'Часовой пояс',
            currentText   : 'Сейчас',
            closeText     : 'Закрыть',
            timeFormat    : 'hh:mm',
            ampm          : false,
        };
        $.timepicker.regional['en'] = {
            timeOnlyTitle : 'Choose time',
            timeText      : 'Time',
            hourText      : 'Hours',
            minuteText    : 'Minutes',
            secondText    : 'Seconds',
            millisecText  : 'Milliseconds',
            timezoneText  : 'Tine zone',
            currentText   : 'Now',
            closeText     : 'Close',
            timeFormat    : 'hh:mm',
            amNames       : ['AM', 'A'],
            pmNames       : ['PM', 'P'],
            ampm          : true,
        };

        $.timepicker.setDefaults( $.timepicker.regional[ru ? 'ru' : 'en'] );

        $.timepicker.setDefaults( { showSecond: false } );
    }

    // в глобальном контексте недает переиначить настройки
    // $('.i-jquery-ui__datepicker').datepicker();

} )( jQuery );

