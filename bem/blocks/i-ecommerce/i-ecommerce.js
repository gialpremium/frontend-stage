/**
 * Глобальная область видимости window
 * @module window
 */

window.dataLayer = window.dataLayer || [];

/**
 * Обработка кодов аналитики Google Enhanced Ecommerce. В TT добавляются с помощью
 * counters/google_ecommerce_add.inc, в js передаются через counters/google_ecommerce.inc
 * и выводятся в <head> страницы.
 *
 * SEO-док: https://docs.google.com/a/reg.ru/document/d/1_X0fAwClIaPPypLInXDXM0sEoKT4myCBb05cnxD51H0/edit
 *
 * @class Ecommerce
 * @submodule Site.Analytics
 * @static
 */

Site.Analytics.Ecommerce = {

    /**
     * ec:addImpression коды. Собираются в counters/google_ecommerce.inc.
     *
     * @property addImpression
     * @type {Object}
     */
    addImpression : {},

    /**
     * ec:addProduct коды. Собираются в counters/google_ecommerce.inc.
     *
     * @property addProduct
     * @type {object}
     */
    addProduct : {},

    /**
     * Чистит сторадж екоммерса
     * @method clearStorage
     */
    clearStorage : function() {
        var ecommerceStorage = new Storage( { prefix: 'ecommerce_' } );

        ecommerceStorage.remove('addImpression');
        ecommerceStorage.remove('addProduct');
    },

    /**
     * Отсылает ga-коды если таковые имеются
     * @method send
     * @public
     * @param  {string}  mode                   all | addImpression | addProduct
     * @param  {string}  [action='detail']      custom-параметр действия
     *                                          пример: 'click', 'add', 'checkout'
     * @param  {object}  [options]              дополнительные параметры
     * @param  {boolean} [sendEvent]           нужно ли выполнять ga('send', 'event').
     * Требуется там, где код не выполняется в секции googleanalytics, имитирует событие клика.
     * @example
            // отправить в GA все addProduct-коды при заказе на 2-м шаге
            Site.Analytics.Ecommerce.send('addProduct', 'checkout', {'step': 2}, 1);
     */
    send : function( mode, action, options, sendEvent ) {

        var gaAction = action || 'detail',
            code,
            yaMetrikaProducts = [];

        if ( mode == 'addImpression' || mode == 'all' ) {
            for ( code in this.addImpression ) {
                ga( 'ec:addImpression', this.addImpression[code] );
            }
        }

        if ( mode == 'addProduct' || mode == 'all' ) {
            for ( code in this.addProduct ) {
                ga( 'ec:addProduct', this.addProduct[code] );
                yaMetrikaProducts.push( this.addProduct[code] );
            }

            window.dataLayer.push( { ecommerce: { detail: { products: yaMetrikaProducts } } } );
        }

        if ( options ) {
            ga( 'ec:setAction', gaAction, options );
        }
        else {
            ga( 'ec:setAction', gaAction );
        }

        if ( sendEvent ) {
            ga( 'send', 'event', 'eec', gaAction, options );
        }

        this.clearStorage();
    },

    /**
     * Добавляет коды Site.Analytics.Ecommerce.addImpression и
     * Site.Analytics.Ecommerce.addProduct соответственно
     *
     * @method process
     * @public
     * @param  {object}   ecommerce                 параметры
     * @param  {object}   ecommerce.data            исходные данные для счетчика
     * @param  {string}   ecommerce.data.id id      продукта/транзакции
     * @param  {string}   ecommerce.data.position   позиция в списке
     * @param  {string}   ecommerce.data.servtype   id услуги
     * @param  {string}   [ecommerce.data.name]     читабельное название
     * @param  {string}   [ecommerce.data.subtype]  id subtype
     * @param  {string}   [ecommerce.data.dname]    домен, если servtype == 'domain',
     *                                              пример: yandex.ru
     * @param  {string}   [ecommerce.data.tld]      доменная зона, если servtype == 'domain'

     * @param  {string}   [ecommerce.data.price]    цена товара за 1 ед.
     * @param  {string}   [ecommerce.data.quantity] кол-во товара
     * @param  {string}   [ecommerce.data.list]     название вкладки или блока, в котором представлена
     * услуга
     * @param  {string}   [ecommerce.data.coupon]   промокод
     * @param  {boolean}  [ecommerce.addProduct]    true: добавить объект в Site.Analytics.Ecommerce.addProduct
     * @param  {boolean}  [ecommerce.addImpression] true: добавить объект в Site.Analytics.Ecommerce.addImpression
     * @param  {int}      index                     порядковый индекс
     * @return {string}   ec_id                     id для доступа к json-объекту
     * @example
            var ecommerce = {
                addProduct: true
            };

            for ( var i = 0; i < bill_data.length; i++ ) {
                var bill = bill_data[i];

                ecommerce.data = {
                    id:         bill.bill_id,
                    name:       bill.descr_ru,
                    servtype:   bill.servtype,
                    subtype:    bill.subtype,
                    dname:      bill.dname,
                    tld:        bill.tld,
                    position:   i + 1,
                    price:      bill.payment / bill_item.amount,
                    quantity:   bill.amount,
                    list:       'Линух тарифы',
                    coupon:     bill.promo_code
                };

                Site.Analytics.Ecommerce.process(ecommerce, i);
            }
     */
    process : function( ecommerce, index ) {

        var dataPrepared = this._format( ecommerce.data ),
            ecId = dataPrepared.id + '_' + index;

        if ( ecommerce.addImpression && !this.addImpression[ecId] ) {

            this.addImpression[ecId] = dataPrepared;
        }

        if ( ecommerce.addProduct && !this.addProduct[ecId] ) {

            this.addProduct[ecId] = dataPrepared;
        }

        return ecId;
    },

    /**
     * Форматирует <a href="#method_process">ecommerce.data</a>
     * и подготавливает данные в соответствии с seo-правилами
     *
     * @method _format
     * @private
     * @param  {object} data объект из <a href="#method_process">ecommerce.data</a>
     *
     * Правила форматирования:
     * - если данные отсутствуют - не добавляем их в dataPrepare
     * - логика должна дублироваться для google_ecommerce_add.inc
     *
     * - id:       %servtype%-%subtype%-%domain%, // чего нет, того не добавлять
     * - category: %servtype%,                    // категория услуги (domain, srv_hosting...)
     * - variant:  %subtype%,                     // выводится, если есть %subtype%
     *
     * @return {object} dataPrepare объект для передачи в GA
     */
    _format : function( data ) {
        var subtype,
            id,
            dataPrepare;

        if ( data ) {
            subtype = data.subtype.replace( /-/g,'' );

            if ( data.dname ) {
                data.dname = data.dname.replace( /\./g,'' );

                if ( data.tld.match( /[а-яё]/i ) ) {

                    data.dname = punycode.ToASCII( data.dname );
                }
            }

            // дефолтный уникальный id, если не указан servtype
            id = 'P' + data.id + '-' + data.position;
            if ( data.servtype || ( data.servtype !== 'prepay' ) ) {
                id = data.servtype;

                if ( subtype ) {
                    id = id + '-' + subtype;
                }

                if ( data.servtype == 'domain' ) {
                    id = id + '-' + data.dname;
                }
            }

            dataPrepare = {
                id       : id,
                category : data.servtype,
                brand    : Site.User.IsReseller ? 'partner' : 'regru',
            };

            if ( data.position ) {
                dataPrepare.position = data.position;
            }

            if ( data.name ) {
                dataPrepare.name = data.name;
            }

            if ( data.subtype ) {
                dataPrepare.variant = data.subtype;
            }

            if ( data.servtype == 'domain' ) {
                dataPrepare.variant = data.tld;
            }
            else if ( data.servtype == 'srv_ssl_certificate' ) {
                dataPrepare.variant = data.extparams.provider;
            }

            dataPrepare.price = data.price || 0;
            dataPrepare.quantity = parseInt( data.quantity ) || 1;

            if ( data.list ) {
                dataPrepare.list = data.list;
            }

            if ( data.coupon ) {
                dataPrepare.coupon = data.coupon;
            }

            return dataPrepare;
        }
    },
};
