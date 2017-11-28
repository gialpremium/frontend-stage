Frontend Stage Community
===================

## Структура

```
bem/
  blocks  # bem-блоки
  config  # служебная папка
  bundles # бандлы, "сборники" бэм-блоков, из них собирается статика
  pages   # обычные html-страницы, на которых можно проверять верстку
  root    # статика, отсюда подключаем js и стили в html
```

## Что нужно сделать, прежде чем приступить
1. Установить nodejs (nvm, n)
```
$ node -v
v8.8.1
```
2. Настроить редактор: линтеры, конфиги, плагины
3. Прочитать [Code Style](https://github.com/regru/frontend-stage#CODESTYLE.md) и держать открытым
3. Прочитать [Code Style](https://github.com/regru/frontend-stage#CODESTYLE.md) и держать открытым
3. Прочитать [Code Style](https://github.com/regru/frontend-stage#CODESTYLE.md) и держать открытым
3. Прочитать [Code Style](https://github.com/regru/frontend-stage#CODESTYLE.md) и держать открытым
4. Убедиться, что знаешь git


## Начало

Установит npm-модули
```
$ yarn
```

Соберет всю статику из модулей (bem-блоков) из папки bem => в папку root/dist, где all.css - all - имя бандла, css - технология
```
$ webpack
```

## Порядок работы
1. По каждому блоку будет создан Issues в Гитхабе
2. Подписываемся исполнителем на определенный issue в свободном порядке
3. Вся работа ведется в отдельной ветке от master-ветки, имя ветки: `issue_{issue_number}_{blockname}_{username}`
Пример: **issue_1_b-button_sobolev**
4. Далее можно создать Pull/Merge Request, где можно продолжить обсуждение по коду
5. Работа считается принятой когда в Pull/Merge Request:
- все комменты решены
- принят наставником и находится в общей ветке (master)
- issue закрыт

## Что можно

1. Привести bem-блоки в соответствие с принятым [Code Style](https://github.com/regru/frontend-stage#CODESTYLE.md)
2. Сделать блоки адаптивными, сверстать под мобильные устройства (mobile-first)
3. Заменить картинки css-стилями (стрелочки, крестики, кружочки и т.п.)

## Что можно еще
1. Переписать legacy jquery-код под jquery 3, либо на VanillaJS
2. Переписать coffee на jquery 3, либо на VanillaJS
3. Написать vuejs-реализацию для блока

## Что можно еще +
1. Написать доку по использованию bem-блока в ТТ
2. Да, у нас используется http://www.template-toolkit.org/ в качестве Perl-шаблонизатора, ты можешь у себя настроить
Перл + ТТ и проапгрейдить ТТ реализацию блоков
3. blocks.guide - здесь блоки разной степени образцовости (по коду, по реализации), но и в них можно много чего улучшать


## Что бесполезно делать без обсуждения с наставником

1. Менять текущую DOM-структуру верстки bem-блоков 
2. Менять названия БЭМ-блоков
3. Менять элементы и модификаторы БЭМ-блоков

Любые предложения, обсуждения, идеи - WELCOME!



# Ссылки для самостоятельного изучения
Что такое yarn ->  https://yarnpkg.com/lang/en/ (в общих чертах)
Что такое BEM  ->  https://ru.bem.info/ (critical!)
Что такое Webpack  ->  https://webpack.js.org/ (в общих чертах)
