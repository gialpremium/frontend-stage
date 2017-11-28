var siteSearchCategoriesList = [
    {
        value : 'all',
        title : ru ? 'Весь сайт' : 'All site',
    },
    {
        value : 'domains',
        title : ru ? 'Домены' : 'Domains',
    },
    {
        value : 'billing',
        title : ru ? 'Финансовые вопросы' : 'Billing',
    },
    {
        value : 'hosting',
        title : ru ? 'Хостинг' : 'Hosting',
    },
    {
        value : 'vps',
        title : 'VPS',
    },
    {
        value : 'newsandevents',
        title : ru ? 'Новости и мероприятия' : 'News and events',
    },
    {
        value : 'moneywithus',
        title : ru ? 'Заработок с Reg.ru' : 'Earnings &amp; Reg.ru',
    },
    {
        value : 'api',
        title : 'API',
    },
    {
        value : 'other',
        title : ru ? 'Доп. услуги' : 'Additionals',
    },
];

Site.App.Models.SiteSearch = Backbone.Model.extend( {
    defaults : {
        query    : '',
        category : '',
    },

    initialize : function() {
        this.on( 'invalid', this.showError, this );
    },

    validate : function( attrs ) {
        if ( !attrs.query ) {
            return 'не заполнено поле!';
        }
    },

    showError : function( /* model, error */ ) {

        // console.log(model, error);
    },
} );

Site.App.Views.SiteSearchFooter = Backbone.View.extend( {
    el : '.b-footer-search',

    initialize : function() {

        // console.log( 'init SiteSearchFooter');
        this.render();
    },

    render : function() {
        var siteSearchCategories = new Site.App.Collections.SiteSearchCategories( siteSearchCategoriesList );

        this.siteSearchCategoriesFooterView = new Site.App.Views.SiteSearchCategoriesFooter(
            { collection: siteSearchCategories }
        );

        this.$('.b-footer-search__categories-wrapper').remove();
        this.$('.b-button').before( this.siteSearchCategoriesFooterView.render().el );
    },

    events : {
        'focusin .b-footer-search__input' : 'showCategories',
        'submit'                          : 'updateQuery',
    },

    showCategories : function( e ) {
        var $form = this.$el;

        $form.addClass('b-footer-search_state_open');
        this.siteSearchCategoriesFooterView.$el.hooc( e, {
            hide : function() {
                $form.removeClass('b-footer-search_state_open');
            }, 
        } );

    },

    updateQuery : function( e ) {
        var newQuery = this.$('.b-footer-search__input').val(),
            category = this.$('.b-footer-search__categories input:checked').val();

        this.model.set( {
            query    : newQuery,
            category : category,
        }, { validate: true } );
        this.submitForm( e );
    },

    submitForm : function( e ) {
        if ( this.model.validationError ) {
            e.preventDefault();
        }
    },
} );

Site.App.Models.SiteSearchCategory = Backbone.Model.extend( {} );

Site.App.Views.SiteSearchFooterCategory = Backbone.View.extend( {
    tagName   : 'label',
    className : 'b-footer-search__category-label',
    template  : _.template('<input type="radio" name="categories" value="<%= value %>" class="b-footer-search__category-input"><%= title %>'), //  eslint-disable-line max-len
    initilize : function() {

        // console.log( 'init SiteSearchCategory');
        this.render();
    },
    render : function() {
        this.$el.html( this.template( this.model.toJSON() ) );

        return this;
    },
} );
Site.App.Collections.SiteSearchCategories = Backbone.Collection.extend( { model: Site.App.Models.SiteSearchCategory } );

Site.App.Views.SiteSearchCategoriesFooter = Backbone.View.extend( {
    tagName   : 'span',
    className : 'b-footer-search__categories-wrapper',
    template  : _.template('<span class="b-footer-search__trigger"><span class="b-footer-search__selected"></span><i class="b-triangle"></i></span><span class="b-footer-search__categories"></span>'), // eslint-disable-line max-len

    initilize : function() {

        // console.log( 'init SiteSearchCategoriesFooter');
        this.render();
    },

    render : function() {
        this.$el.html( this.template() );
        this.$categories = this.$('.b-footer-search__categories');

        this.collection.each( function( category ) {
            var siteSearchCategory = new Site.App.Views.SiteSearchFooterCategory( { model: category } );

            this.$categories.append( siteSearchCategory.render().el );
        }, this );

        this.$categories.find('input[value=all]').prop( 'checked', true ).trigger('change');

        return this;
    },

    events : {
        'click .b-footer-search__trigger'         : 'showCategoriesList',
        'change .b-footer-search__category-input' : 'selectCategory',
    },

    showCategoriesList : function( e ) {
        var $this = $( e.currentTarget ),
            p = $this.position();

        this.$categories.css( {
            display : 'block',
            left    : p.left,
            top     : p.top + $this.height() - 5, // padding b-form-compact
        } ).hooc( e );

        return false;
    },

    selectCategory : function( e ) {
        var $this = $( e.currentTarget );

        if ( $this.prop('checked') ) {
            this.$('.b-footer-search__selected').text( $this.parent().text() );
            this.$categories.hooc('hide');
        }
    },
} );

$( function() {
    var siteSearch = new Site.App.Models.SiteSearch;

    new Site.App.Views.SiteSearchFooter( { model: siteSearch } ); // eslint-disable-line no-new
} );
