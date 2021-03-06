// Provides on & off & trigger functions to build minimalist observables

// Use code from Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

let guid = 1;

function hide( obj, prop ) {
    if ( !!Object.defineProperty ) {
        try {
            Object.defineProperty( obj, prop, {
                enumerable: false
            } );
        } catch ( e ) {
            // tant pis
        }
    }
}

function addEvent( type, handler ) {
    // create a hash table of event types for the element
    
    if ( !this.__events__ ) {
        this.__events__ = {};
        hide( this, '__events__' );
    }
    
    // assign each event handler a unique ID
    
    if ( !handler.__events__Guid ) {
        handler.__events__Guid = guid++;
        hide( handler, '__events__Guid' );
    }
    
    // create a hash table of event handlers for each element/event pair
    
    let handlers = this.__events__[ type ];
    
    if ( !handlers ) {
        handlers = this.__events__[ type ] = {};
    }
    
    // store the event handler in the hash table
    
    handlers[ handler.__events__Guid ] = handler;
}

function removeEvent( type, handler ) {
    // delete the event handler from the hash table
    
    if ( this.__events__ && this.__events__[ type ] && handler && handler.__events__Guid ) {
        delete this.__events__[ type ][ handler.__events__Guid ];
    }
}

function triggerEvent( event ) {
    if ( typeof event === 'string' ) {
        event = { type: event };
    }
    
    let returnValue = true;
    
    // get a reference to the hash table of event handlers
    
    if ( this.__events__ && this.__events__[ event.type ] ) {
        let handlers = this.__events__[ event.type ];
        
        // execute each event handler
        
        for ( let i in handlers ) {
            let handler = handlers[ i ];
            
            if ( handler( event ) === false ) {
                returnValue = false;
            }
        }
    }
    
    return returnValue;
}

export const Observable = {
    on:      addEvent,
    off:     removeEvent,
    trigger: triggerEvent
};

export default Observable;
