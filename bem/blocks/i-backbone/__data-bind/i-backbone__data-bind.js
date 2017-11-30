/*
var dataBind = new Site.App.Views.DataBind({
        model: this.model,          // модель с атрибутами для привязки
        el: this.el,                // элемент-родитель ( #contact например )
        selector: FIELDS_SELECTOR   // селектор полей ( input, select и т.д )
    });
 */
Site.App.Views.DataBind = Backbone.View.extend( {
    initialize : function() {
        this.model.on( 'destroy', this.destroy, this );
        this.model.on( 'reBindData', this.dataBind, this );
        this.model.on( 'setData', this.setData, this );
        this.dataBind();
        this.setModelOn();
        this.model.dataBind = this;
    },

    dataBind : function() {
        this.$el.find( this.options.selector )
            .not('.b-settings__bind-data_disabled')
            .on( 'change keyup', function( field ) {

                if ( this.isUpdateModel( field.currentTarget ) ) {
                    this.model.set( field.currentTarget.name, field.currentTarget.value );
                }

            }.bind( this ) );
    },

    isUpdateModel : function( field ) {
        return this.model.get( field.name ) !== 'undefined' ? true : false;
    },

    setModelOn : function() {
        _.each( this.$el.find( this.options.selector ), function( field ) {

            this.model.on( 'change:' + field.name, this.onModelChange, field );

        }, this );
    },

    setModelOff : function() {
        _.each( this.$el.find( this.options.selector ), function( field ) {

            this.model.off( 'change:' + field.name, this.onModelChange, field );

        }, this );
    },

    setData : function() {
        this.setModelOff();

        _.each( this.$el.find( this.options.selector ), function( field ) {

            this.model.set( field.currentTarget.name, field.currentTarget.value );

        }, this );

        this.setModelOn();
    },

    onModelChange : function( model ) {
        var caret;

        if ( this.type === 'checkbox' ) {
            this.checked = model.get( this.name ) ? true : false;
        }
        else if ( this.type === 'radio' ) {
            this.checked = model.get( this.name ) == this.value ? true : false;
        }
        else {

            // при обновлении value - слетает каретка в конец строки,
            // ставим обратно туда где был курсор до обновления value
            caret = $( this ).inputPointer();
            this.value = model.get( this.name ) || '';
            $( this ).inputPointer( caret );
        }
    },

} );

