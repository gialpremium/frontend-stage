/* stop event */
window.stopEvent = function stopEvent( e ) {
    if ( !e ) {
        return false;
    }

    if ( e.preventDefault ) {
        e.preventDefault();
        e.stopPropagation();
    }
    else {
        e.returnValue = false;
        e.cancelBubble = true;
    }

    return false;
};
