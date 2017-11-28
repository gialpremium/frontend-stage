

describe( 'b-recaptcha', function() {

    var recaptcha = new Site.App.Auth.Modules.Recaptcha(),
        rid = 'recaptchaTestContainerId',
        optionObject = { sitekey: '6LfU9QUTAAAAABOtrrApNyPn3_64iMNBJSodhE0F' },
        recaptcha1,
        recaptcha2,
        recaptcha3;

    this.timeout( 9000 );

    beforeEach( function() {
        sinon.spy( Site.App.Auth.Modules.Loader.prototype, 'load' );
    } );

    afterEach( function() {
        Site.App.Auth.Modules.Loader.prototype.load.restore();
    } );

    it( 'Загрузка скрипта капчи', function( cb ) {
        var loadStatus = recaptcha.isLoaded();
        recaptcha.load();

        // Если капча уже была загружена в одном из модулей
        if ( loadStatus ) {
            sinon.assert.callCount( Site.App.Auth.Modules.Loader.prototype.load, 0 );
        } else {
            sinon.assert.callCount( Site.App.Auth.Modules.Loader.prototype.load, 1 );
        }

        recaptcha.state.then( function() {
            expect( recaptcha.isLoaded() ).to.equal( true );
            expect( window['grecaptcha'] ).to.be.an('object');
            cb();
        } );
    } );

    it( 'Инициализация нескольких инстансов капчи', function( cb ) {
        recaptcha1 = new Site.App.Auth.Modules.Recaptcha();
        recaptcha2 = new Site.App.Auth.Modules.Recaptcha();
        recaptcha3 = new Site.App.Auth.Modules.Recaptcha();

        recaptcha1.load();
        recaptcha2.load();
        recaptcha3.load();

        $.when( recaptcha1.state, recaptcha2.state, recaptcha3.state )
            .then( function() {

                // -- check
                sinon.assert.callCount( Site.App.Auth.Modules.Loader.prototype.load, 3 );
                expect( recaptcha1.isLoaded() ).to.be.true;
                expect( recaptcha2.isLoaded() ).to.be.true;
                expect( recaptcha3.isLoaded() ).to.be.true;
                cb();
            } );

    } );

    describe( 'API', function() {

        beforeEach( function() {
            sinon.spy( grecaptcha, 'render' );
            sinon.spy( grecaptcha, 'reset' );
        } );

        afterEach( function() {
            grecaptcha.render.restore();
            grecaptcha.reset.restore();
        } );

        it( 'Рендер рекапчи на страницу', function() {
            $( '<div>', { id: rid } ).appendTo('body');

            recaptcha.options( optionObject )
            .renderTo( rid );

            sinon.assert.callCount( grecaptcha.render, 1 );
            sinon.assert.callCount( grecaptcha.reset, 0 );
            sinon.assert.calledWithMatch( grecaptcha.render,
                sinon.match( rid ),
                sinon.match.instanceOf( Object ).and( sinon.match.has('sitekey') )
            );
        } );

        it( 'Второй и последующие вызовы рендера капчи будут выполнены как reset', function() {
            recaptcha.renderTo( rid );

            sinon.assert.callCount( grecaptcha.reset, 1 );
            sinon.assert.callCount( grecaptcha.render, 0 );
            sinon.assert.calledWithMatch( grecaptcha.reset, sinon.match.number );
        } );

        it( 'Видимость блока капчи', function() {
            expect( recaptcha.isShown() ).to.equal( true );
        } );

        it( 'Скрытие блока капчи', function() {
            recaptcha.hide();
            expect( recaptcha.isShown() ).to.equal( false );
        } );

    } );

} );
