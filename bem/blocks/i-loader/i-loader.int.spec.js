

describe( 'i-loader', function() {

    var loader;

    before( function() {
        loader = new Site.App.Auth.Modules.Loader();
        sinon.stub( $, 'ajax' );
    } );

    after( function() {
        $.ajax.restore();
    } );

    it( 'Вызов load', function() {
        var url = '/my/test/url';
        loader.load( url );

        sinon.assert.callCount( $.ajax, 1 );
        $.ajax, sinon.match( {
            url      : sinon.match( url ),
            charset  : sinon.match('utf-8'),
            dataType : sinon.match('script'),
            cache    : sinon.match.truthy,
        } );

        /* sinon.assert.calledWithMatch(
            $.ajax, sinon.match.string
        ); */
    } );

} );
