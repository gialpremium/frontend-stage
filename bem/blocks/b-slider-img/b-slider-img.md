---
layout: page
title: 'b-slider-img: карусель скриншотов'
---

## Вызов:

```tt2
[%
INCLUDE 'b-slider-img.inc'
    # указываем высоту скриншотов(можно через сss, см reseller/regpanel/index.html)
    images_height = 466
    # добавляет указанные классы. Если надо кастомизировать стили - добавили класс и через него каскадом кастомизируем!
    add_class = 'calendar2013_gallery'
    # указываем имя хоста, если картинки аплоадим на !i.reg.ru(по дефолту подставляеться static_prefix)
    use_ext_urls = '//img.reg.ru'
    # если надо кастомная инициализация плагина(см. ниже)
    custom_init = 'i-slider-img_custom_announce-calendar2013'
    # нумерация подписей к скринам
    numbered_titles = 1
    # если надо к карусели fancybox(пример company/contacts/officelist.inc), в header.inc подключаем html.libraries.fancybox
    use_fancybox = 1
    # массив с галереей
    slider_data = [
        {
            # ссылка на скрин
            url => '/announce/calendar2013/1.jpg'
            # дескрипшен к скрину(опционально)
            desc => ru ? 'Январь' : 'January'
            # ссылка на полноразмерный скрин (только при 'use_fancybox = 1')
            fancybox_url => '/announce/calendar2013/big/1.jpg'
        }
    ]
    # добавляет хедер для карусели
    add_header = slider_header(BLOCK)
    # добавляет футер для карусели;
    add_footer = slider_footer(BLOCK);
%]
```

## Кастомная инициализация плагина:

```js
$('.i-slider-img_custom_announce-calendar2013').sliderImg({
    beforeStart: function(img, i) { }, // перед сменой скрина
    afterEnd: function(img, i) { }     // после смены скрина
});
```

В beforeStart && afterEnd доступны:

```js
var this, // $('.i-slider-img')
    img,  // $(текущий скрин)
    i;    // индекс текущего скрина
```
