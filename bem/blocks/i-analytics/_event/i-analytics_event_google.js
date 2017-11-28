Site.Analytics.EventHandlers.google = function( $trigger ) {
    var d = $.Deferred(),
        gaEvents = $trigger.data('ga_params').replace( / /g, '' ).split('|'),
        eventsWithMissingAttrs = 0,
        attrs = [],
        category,
        action,
        label,
        value,
        callback = {
            hitCallback : function() {
                d.resolve();
            }, 
        };

    if ( !Site.Analytics.IsEnabled.google ) {
        return d.reject().promise();
    }

    gaEvents.forEach( function( gaEvent ) {
        attrs    = gaEvent.split(',');
        category = attrs[0];
        action   = attrs[1];
        label    = attrs[2];
        value    = attrs[3] || null;

        if ( !category || !action || !label ) {
            eventsWithMissingAttrs++;

            return;
        }

        if ( value ) {
            label = label + ':' + value;
        }

        ga( 'send', 'event', category, action, label, callback );

    } );

    if ( eventsWithMissingAttrs === gaEvents.length ) {
        d.reject();
    }

    return d.promise();
};
