Site.Analytics.EventHandlers.seldon = function() {

    var d = $.Deferred();

    if ( !Site.Config.Seldon.IsEnabled ) {
        return d.reject().promise();
    }

    ga( 'send', 'event', 'seldon', 'click', window.location.href, {
        hitCallback : function() {
            d.resolve();
        }, 
    } );

    return d.promise();

};
